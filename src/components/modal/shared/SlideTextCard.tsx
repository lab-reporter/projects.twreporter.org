'use client';

// 文字卡片組件 - 用於在媒體上顯示文字
interface SlideTextCardProps {
    text: string;
    className?: string; // 定位和樣式
}

export default function SlideTextCard({ text, className = '' }: SlideTextCardProps) {
    return (
        <div className={`
      px-6 py-4 
      bg-white bg-opacity-60 backdrop-blur-lg 
      rounded-lg
      shadow-md
      ${className}
    `}>
            <p className="text-gray-800 leading-relaxed">
                {text}
            </p>
        </div>
    );
}
