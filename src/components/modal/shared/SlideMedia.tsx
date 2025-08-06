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

export function SlideMedia({ 
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
          className={`w-full h-full object-cover ${className}`}
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            className="object-cover"
            priority={isActive}
            quality={90}
          />
        </div>
      );
  }
}

// 文字卡片組件 - 用於在媒體上顯示文字
interface SlideTextCardProps {
  text: string;
  className?: string; // 定位和樣式
}

export function SlideTextCard({ text, className = '' }: SlideTextCardProps) {
  return (
    <div className={`
      px-6 py-4 
      bg-white bg-opacity-90 backdrop-blur-md 
      border border-gray-200 rounded-lg
      shadow-lg
      ${className}
    `}>
      <p className="text-gray-800 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

// 組合式媒體文字投影片
interface MediaTextSlideProps {
  media: {
    type: 'video' | 'image' | 'iframe';
    src: string;
    alt?: string;
    className?: string;
  };
  text?: {
    content: string;
    position?: 'center' | 'bottom' | 'top' | 'left' | 'right';
    className?: string;
  };
  isActive?: boolean;
}

export function MediaTextSlide({ media, text, isActive = true }: MediaTextSlideProps) {
  // 根據文字位置設定樣式
  const getTextPositionClass = () => {
    if (!text) return '';
    
    switch (text.position) {
      case 'top':
        return 'top-8 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'bottom-8 left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-8 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-8 top-1/2 -translate-y-1/2';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 媒體背景 */}
      <SlideMedia
        type={media.type}
        src={media.src}
        alt={media.alt}
        className={media.className}
        isActive={isActive}
      />
      
      {/* 文字覆蓋層 */}
      {text && (
        <div className={`absolute ${getTextPositionClass()} ${text.className || ''}`}>
          <SlideTextCard text={text.content} />
        </div>
      )}
    </div>
  );
}