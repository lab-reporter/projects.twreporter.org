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
      bg-white/60 backdrop-blur-sm 
      rounded-lg
      shadow-lg
      absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl
      ${className}
    `}>
            <p className="text-black leading-relaxed">
                {text}
            </p>
        </div>
    );
}
