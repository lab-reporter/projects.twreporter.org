'use client';

import SlideMedia from './SlideMedia';
import SlideTextCard from './SlideTextCard';

// 組合式媒體文字投影片
interface MediaTextSlideProps {
    media: {
        type: 'video' | 'image' | 'iframe';
        src: string;
        alt?: string;
        className?: string;
    };
    text?: {
        content: string;
        position?: 'center' | 'bottom' | 'top' | 'left' | 'right';
        className?: string;
    };
    isActive?: boolean;
}

export default function MediaTextSlide({ media, text, isActive = true }: MediaTextSlideProps) {
    // 根據文字位置設定樣式
    const getTextPositionClass = () => {
        if (!text) return '';

        switch (text.position) {
            case 'top':
                return 'top-8 left-1/2 -translate-x-1/2';
            case 'bottom':
                return 'bottom-8 left-1/2 -translate-x-1/2';
            case 'left':
                return 'left-8 top-1/2 -translate-y-1/2';
            case 'right':
                return 'right-8 top-1/2 -translate-y-1/2';
            case 'center':
            default:
                return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        }
    };

    return (
        <div className="relative w-full h-full">
            {/* 媒體背景 */}
            <SlideMedia
                type={media.type}
                src={media.src}
                alt={media.alt}
                className={media.className}
                isActive={isActive}
            />

            {/* 文字覆蓋層 */}
            {text && (
                <div className={`absolute ${getTextPositionClass()} ${text.className || ''}`}>
                    <SlideTextCard text={text.content} />
                </div>
            )}
        </div>
    );
}
