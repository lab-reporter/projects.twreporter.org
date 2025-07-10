'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { PhotoItemConfig } from './challenges.config';

interface ChallengePhotoProps {
  photoConfig: PhotoItemConfig;
  index: number;
  isActive: boolean;
  animationProgress: number;
  hasPassedRange?: boolean;
  className?: string;
  scrollProgress?: number;
}

// 使用 memo 來避免不必要的重新渲染
const ChallengePhoto = memo(({
  photoConfig,
  index,
  isActive,
  animationProgress,
  hasPassedRange = false,
  className = '',
  scrollProgress = 0
}: ChallengePhotoProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // 初始化照片位置
  useEffect(() => {
    if (!cardRef.current) return;

    // 設置初始狀態 - 完全隱藏
    gsap.set(cardRef.current, {
      z: photoConfig.animationConfig.startZ,
      scale: 0,
      opacity: 0,
      visibility: 'hidden',
      force3D: true
    });

    return () => {
      // 清理動畫
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, []); // 只在掛載時執行

  // 處理動畫 - 根據滾動進度和是否在範圍內
  useEffect(() => {
    if (!cardRef.current) return;

    const { startZ, endZ, startScale, endScale } = photoConfig.animationConfig;
    
    // 清理之前的動畫
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    if (hasPassedRange && scrollProgress > photoConfig.triggerRange.endIndex + 1) {
      // 照片已經通過範圍，計算消失動畫
      const overflowProgress = (scrollProgress - photoConfig.triggerRange.endIndex - 1);
      const extendedZ = endZ + (overflowProgress * 3000); // 繼續往遠處移動
      const fadeOpacity = Math.max(0, 1 - overflowProgress * 1.5); // 根據距離淡出
      
      // 使用 set 來即時更新位置，確保滾動時的流暢性
      gsap.set(cardRef.current, {
        z: extendedZ,
        scale: endScale,
        opacity: fadeOpacity,
        visibility: fadeOpacity > 0 ? 'visible' : 'hidden',
        immediateRender: true,
        overwrite: 'auto'
      });
    } else if (animationProgress > 0 && animationProgress <= 1) {
      // 照片在顯示範圍內
      const targetZ = startZ + (endZ - startZ) * animationProgress;
      const targetScale = startScale + (endScale - startScale) * animationProgress;
      
      // 即時更新位置
      gsap.set(cardRef.current, {
        z: targetZ,
        scale: targetScale,
        opacity: 1,
        visibility: 'visible',
        immediateRender: true,
        overwrite: 'auto'
      });
    } else {
      // 照片還沒到範圍，保持隱藏
      gsap.set(cardRef.current, {
        z: startZ,
        scale: 0,
        opacity: 0,
        visibility: 'hidden',
        immediateRender: true,
        overwrite: 'auto'
      });
    }

  }, [animationProgress, hasPassedRange, scrollProgress, photoConfig]);

  return (
    <div
      ref={cardRef}
      className={`absolute rounded-2xl bg-gray-300 overflow-hidden challenge-photo-${index} ${className}`}
      style={{
        top: photoConfig.position.top,
        left: photoConfig.position.left,
        width: '200px',
        height: '200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform opacity',
        backfaceVisibility: 'hidden' // 防止閃爍
      }}
    >
      {!imageLoaded && (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
      
      <Image
        src={photoConfig.imagePath}
        alt={`Challenge ${photoConfig.id}`}
        width={200}
        height={200}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        loading={index < 6 ? 'eager' : 'lazy'}
      />
    </div>
  );
});

ChallengePhoto.displayName = 'ChallengePhoto';

export default ChallengePhoto;