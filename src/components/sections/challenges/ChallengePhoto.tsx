'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { PhotoPosition } from './challenges.config';

interface ChallengePhotoProps {
  index: number;
  position: PhotoPosition;
  size: { width: number; height: number };
  imageNumber: number;
  filePrefix: string;
  className?: string;
}

export default function ChallengePhoto({
  index,
  position,
  size,
  imageNumber,
  filePrefix,
  className = ''
}: ChallengePhotoProps) {
  const cardRef = useRef<HTMLDivElement>(null);

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
        }}
      />
    </div>
  );
}