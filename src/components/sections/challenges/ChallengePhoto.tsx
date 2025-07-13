'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Image from 'next/image';
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

  // 緩存動畫配置
  const { startZ, endZ, startScale, endScale } = photoConfig.animationConfig;

  // 使用 ref 儲存動畫狀態，避免重複渲染
  const animationStateRef = useRef({
    transform: '',
    opacity: '0',
    visibility: 'hidden' as 'hidden' | 'visible',
    z: startZ,
    scale: 0
  });

  // 初始化照片位置
  useEffect(() => {
    if (!cardRef.current) return;

    // 設置初始狀態
    const initialTransform = `translate(-50%, -50%) translateZ(${startZ}px) scale(0)`;
    animationStateRef.current = {
      transform: initialTransform,
      opacity: '0',
      visibility: 'hidden',
      z: startZ,
      scale: 0
    };

    // 應用初始狀態
    cardRef.current.style.transform = initialTransform;
    cardRef.current.style.opacity = '0';
    cardRef.current.style.visibility = 'hidden';
  }, [startZ]);

  // 處理動畫更新 - 使用 ref 避免重複渲染
  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;
    const state = animationStateRef.current;

    // 計算新的動畫值
    let targetZ: number;
    let targetScale: number;
    let targetOpacity: number;

    if (hasPassedRange && scrollProgress > photoConfig.triggerRange.endIndex) {
      // 照片已經通過範圍
      const overflowProgress = (scrollProgress - photoConfig.triggerRange.endIndex);
      targetZ = endZ + (overflowProgress * 5000);
      targetScale = endScale;
      targetOpacity = Math.max(0, 1 - overflowProgress * 5);
    } else if (animationProgress > 0 && animationProgress <= 1) {
      // 照片在顯示範圍內
      targetZ = startZ + (endZ - startZ) * animationProgress;
      targetScale = startScale + (endScale - startScale) * animationProgress;
      targetOpacity = 1;
    } else {
      // 照片還沒到範圍
      targetZ = startZ;
      targetScale = 0;
      targetOpacity = 0;
    }

    // 使用閾值檢查，避免微小變化觸發更新
    const zChanged = Math.abs(state.z - targetZ) > 1;
    const scaleChanged = Math.abs(state.scale - targetScale) > 0.01;
    const opacityChanged = Math.abs(parseFloat(state.opacity) - targetOpacity) > 0.01;

    // 只在有顯著變化時更新
    if (zChanged || scaleChanged) {
      const newTransform = `translate(-50%, -50%) translateZ(${targetZ}px) scale(${targetScale})`;
      element.style.transform = newTransform;
      state.transform = newTransform;
      state.z = targetZ;
      state.scale = targetScale;
    }

    if (opacityChanged) {
      const newOpacity = targetOpacity.toFixed(2);
      element.style.opacity = newOpacity;
      state.opacity = newOpacity;

      // 更新 visibility
      const newVisibility = targetOpacity > 0 ? 'visible' : 'hidden';
      if (state.visibility !== newVisibility) {
        element.style.visibility = newVisibility;
        state.visibility = newVisibility;
      }
    }

  }, [animationProgress, hasPassedRange, scrollProgress, startZ, endZ, startScale, endScale, photoConfig.triggerRange.endIndex]);

  return (
    <div
      ref={cardRef}
      className={`absolute rounded-md bg-gray-300 overflow-hidden challenge-photo-${index} ${className}`}
      style={{
        top: photoConfig.position.top,
        left: photoConfig.position.left,
        width: '300px',
        height: '200px',
        transformStyle: 'preserve-3d',
        willChange: isActive ? 'transform, opacity' : 'auto',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint'
      }}
    >
      {!imageLoaded && (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}

      <Image
        src={photoConfig.imagePath}
        alt={`Challenge ${photoConfig.id}`}
        width={300}
        height={200}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        onLoad={() => setImageLoaded(true)}
        loading={index < 6 ? 'eager' : 'lazy'}
        priority={index < 2}
      />
    </div>
  );
});

ChallengePhoto.displayName = 'ChallengePhoto';

export default ChallengePhoto;