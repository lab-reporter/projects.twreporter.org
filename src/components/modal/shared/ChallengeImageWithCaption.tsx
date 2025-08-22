'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ChallengeImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

// 挑戰章節圖片與說明文字元件
export default function ChallengeImageWithCaption({
  src,
  alt,
  caption,
  priority = false,
  className = "",
  containerClassName = ""
}: ChallengeImageWithCaptionProps) {
  const [imageError, setImageError] = useState(false);

  // 如果圖片載入失敗，顯示備用內容
  if (imageError) {
    return (
      <div className={`img-container py-4 ${containerClassName}`}>
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">圖片載入失敗</p>
        </div>
        {caption && (
          <p className="mt-2 text-sm text-center text-gray-700">
            {caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`img-container py-4 ${containerClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`!relative h-auto w-full object-contain ${className}`}
        priority={priority}
        quality={85}
        onError={() => setImageError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
      {caption && (
        <p className="text-sm mt-2 mb-4 text-justify text-gray-700">
          {caption}
        </p>
      )}
    </div>
  );
}