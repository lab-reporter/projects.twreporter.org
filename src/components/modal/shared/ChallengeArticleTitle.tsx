'use client';

import Image from 'next/image';

interface ChallengeArticleTitleProps {
  title: string;
  className?: string;
}

// 挑戰章節文章主標題元件
export default function ChallengeArticleTitle({
  title,
  className: _className = ""
}: ChallengeArticleTitleProps) {
  return (
    <div className="pointer-events-none select-none relative my-24">
      <h3 className="text-center z-10 relative">
        {title}
      </h3>
      <Image
        src="/assets/line.png"
        alt="Innovation"
        className="absolute bottom-[-1rem] left-1/2 -translate-x-1/2 z-0 w-full h-8"
        width={1382}
        height={213}
      />
    </div>
  );
}