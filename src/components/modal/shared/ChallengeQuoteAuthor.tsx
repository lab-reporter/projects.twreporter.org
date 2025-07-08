'use client';

interface ChallengeQuoteAuthorProps {
  author: string;
  title?: string;
  organization?: string;
  className?: string;
}

// 挑戰章節引言作者元件
export default function ChallengeQuoteAuthor({ 
  author,
  title,
  organization,
  className = "" 
}: ChallengeQuoteAuthorProps) {
  // 組合完整的作者資訊
  const fullAuthorText = [
    organization && `《${organization}》`,
    title,
    `${author}：`
  ].filter(Boolean).join('');

  return (
    <h3 className={`text-2xl font-bold text-center ${className}`}>
      {fullAuthorText}
    </h3>
  );
}