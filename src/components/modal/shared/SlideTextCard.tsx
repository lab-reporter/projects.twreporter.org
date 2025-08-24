'use client';

// 文字卡片組件 - 用於在媒體上顯示文字
interface SlideTextCardProps {
    text: string;
    className?: string; // 定位和樣式
}

export default function SlideTextCard({ text, className = '' }: SlideTextCardProps) {
    return (
        <div className={`
      w-[80%] px-6 py-4 
      bg-white/50 backdrop-blur-md 
      rounded-lg
      shadow-lg
      absolute bottom-16 lg:bottom-8 left-1/2 -translate-x-1/2 max-w-[40rem]
      ${className}
    `}>
            <p className="text-black leading-relaxed">
                {text}
            </p>
        </div>
    );
}
