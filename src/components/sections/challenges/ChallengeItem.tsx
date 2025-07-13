'use client';

interface ChallengeItemProps {
  title: string;
  onClick: (title: string) => void;
  className?: string;
}

export default function ChallengeItem({ title, onClick, className = '' }: ChallengeItemProps) {
  return (
    <div className={`relative w-screen flex-1 flex flex-col justify-center items-center challenge ${className}`}>
      <div
        className="challengeTitle text-center px-4"
        data-custom-cursor="view"
        style={{ cursor: 'none', transform: 'translateX(-50%)' }}
        onClick={() => onClick(title)}
      >
        <h2 
          className="text-2xl md:text-3xl font-bold text-black hover:text-gray-700 transition-colors duration-300"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
    </div>
  );
}