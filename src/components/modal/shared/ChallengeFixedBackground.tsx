'use client';

import Image from 'next/image';

// 挑戰章節固定背景圖片元件
export default function ChallengeFixedBackground() {
  return (
    <div className="w-full h-[92vh] fixed top-0 left-0 z-0">
      <Image
        src="/assets/challenges/challenge-bg.svg"
        alt="挑戰背景圖"
        fill
        className="object-cover opacity-40"
        priority // 背景圖片優先載入
        quality={90}
      />
    </div>
  );
}