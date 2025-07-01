'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { PhotoPosition } from './challenges.config';

interface ChallengePhotoProps {
  index: number;
  position: PhotoPosition;
  size: { width: number; height: number };
  imageNumber: number;
  filePrefix: string;
  shouldLoad?: boolean; // 新增：是否應該載入圖片
  className?: string;
}

export default function ChallengePhoto({
  index,
  position,
  size,
  imageNumber,
  filePrefix,
  shouldLoad = false,
  className = ''
}: ChallengePhotoProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 設置初始 GSAP 狀態
  useEffect(() => {
    if (cardRef.current && typeof window !== 'undefined') {
      // 使用 GSAP 設置初始狀態，確保 3D 變換正確
      gsap.set(cardRef.current, {
        z: -50000,
        scale: 0,
      });
    }
  }, []);

  // 處理圖片載入
  useEffect(() => {
    if (shouldLoad && !hasLoaded && !imageError) {
      setHasLoaded(true);
    }
  }, [shouldLoad, hasLoaded, imageError]);

  return (
    <div
      ref={cardRef}
      className={`absolute rounded-2xl bg-gray-300 overflow-hidden will-change-transform card card-${index + 1} ${className}`}
      style={{
        top: position.top,
        left: position.left,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 載入中的佔位符 */}
      {!hasLoaded && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />
        </div>
      )}

      {/* 實際圖片 */}
      {hasLoaded && (
        <Image
          src={`/assets/${filePrefix}${imageNumber}.png`}
          alt={`Challenge background ${index + 1}`}
          width={size.width}
          height={size.height}
          className="w-full h-full object-cover"
          priority={index < 3} // 前3張優先載入
          onError={(e) => {
            // 如果照片載入失敗，使用預設照片
            const target = e.target as HTMLImageElement;
            target.src = `/assets/${filePrefix}1.png`;
            setImageError(true);
          }}
          onLoad={() => {
            // 圖片載入完成，可以添加淡入效果
            if (cardRef.current) {
              gsap.fromTo(cardRef.current.querySelector('img'), {
                opacity: 0
              }, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
              });
            }
          }}
        />
      )}
    </div>
  );
}