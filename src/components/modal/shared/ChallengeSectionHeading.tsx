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
    <h5 className={`font-bold mt-12 mb-6 text-center ${className}`}>
      {text}
    </h5>
  );
}