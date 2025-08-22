'use client';

interface ChallengeArticleTitleProps {
  title: string;
  className?: string;
}

// 挑戰章節文章主標題元件
export default function ChallengeArticleTitle({
  title,
  className = ""
}: ChallengeArticleTitleProps) {
  return (
    <h2
      className={`text-4xl py-12 font-bold text-center ${className}`}
    >
      {title}
    </h2>
  );
}