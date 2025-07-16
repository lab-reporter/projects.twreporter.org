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
        style={{ cursor: 'pointer', transform: 'translateX(-50%)' }}
        onClick={() => onClick(title)}
      >
        {/* <h1 className="absolute text-[50vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100">
          ？
        </h1> */}
        <h3
          className="text-black relative z-1 hover:text-gray-700 transition-colors duration-300"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div className="text-gray-100 relative z-1 mt-4 text-md bg-gray-900 inline-block px-4 py-2">
          Read More
        </div>
      </div>
    </div>
  );
}