'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

// 媒體投影片組件 - 用於顯示影片、圖片或 iframe
interface SlideMediaProps {
  type: 'video' | 'image' | 'iframe';
  src: string;
  alt?: string;
  className?: string; // 自訂樣式
  iframeProps?: {
    title?: string;
    allow?: string;
    allowFullscreen?: boolean;
    sandbox?: string;
  };
  isActive?: boolean; // 是否為當前顯示的投影片
}

export default function SlideMedia({
  type,
  src,
  alt,
  className = '',
  iframeProps,
  isActive = true
}: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 控制影片播放
  useEffect(() => {
    if (type !== 'video' || !videoRef.current) return;

    if (isActive) {
      videoRef.current.play().catch(() => {
        // 自動播放失敗時的靜默處理
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, type]);

  switch (type) {
    case 'video':
      return (
        <video
          ref={videoRef}
          src={src}
          className={`${className}`}
          muted
          loop
          playsInline
          preload="auto"
        />
      );

    case 'iframe':
      return (
        <iframe
          src={src}
          title={iframeProps?.title || alt || 'Embedded content'}
          className={`w-full h-full ${className}`}
          allow={iframeProps?.allow}
          allowFullScreen={iframeProps?.allowFullscreen}
          sandbox={iframeProps?.sandbox}
        />
      );

    case 'image':
    default:
      return (
        <div className={`relative w-full h-full ${className}`}>
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
            // priority={isActive}
            quality={90}
            loading="lazy"
          />
        </div>
      );
  }
}