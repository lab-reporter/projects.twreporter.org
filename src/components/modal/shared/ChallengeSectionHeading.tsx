'use client';

interface ChallengeSectionHeadingProps {
  text: string;
  className?: string;
}

// 挑戰章節小標題元件
export default function ChallengeSectionHeading({ 
  text,
  className = "" 
}: ChallengeSectionHeadingProps) {
  return (
    <h4 className={`text-xl font-bold text-center ${className}`}>
      {text}
    </h4>
  );
}