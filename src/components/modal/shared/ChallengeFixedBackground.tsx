'use client';

import Image from 'next/image';

interface ChallengeFixedBackgroundProps {
  src: string;
  alt?: string;
}

// 挑戰章節固定背景圖片元件
export default function ChallengeFixedBackground({ 
  src, 
  alt = "背景圖片" 
}: ChallengeFixedBackgroundProps) {
  return (
    <div className="w-full h-[92vh] fixed top-0 left-0 z-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority // 背景圖片優先載入
        quality={90}
      />
    </div>
  );
}