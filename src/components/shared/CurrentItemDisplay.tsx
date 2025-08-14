'use client';

interface CurrentItemDisplayProps {
    title?: string;
    subtitle?: string;
    className?: string;
    // 新增：當前項目資料和點擊處理函數
    currentItem?: Record<string, unknown>;
    onTitleClick?: (item: Record<string, unknown>) => void;
}

export default function CurrentItemDisplay({
    title,
    subtitle,
    className = "",
    currentItem,
    onTitleClick
}: CurrentItemDisplayProps) {
    // 如果沒有標題也沒有副標題，則不顯示
    if (!title && !subtitle) return null;

    // 處理標題點擊事件
    const handleTitleClick = () => {
        if (currentItem && onTitleClick) {
            onTitleClick(currentItem);
        }
    };

    return (
        <div
            className={`max-w-[45rem] px-8 ${className} ${currentItem && onTitleClick
                    ? 'cursor-pointer hover:opacity-80 transition-opacity duration-300'
                    : ''
                }`}
            onClick={currentItem && onTitleClick ? handleTitleClick : undefined}
        >
            {/* 標題 */}
            {title && (
                <h4
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: title }}
                />
            )}
            {/* 副標題 */}
            {subtitle && (
                <h6 className="text-gray-700 font-noto-sans-tc font-normal text-md leading-relaxed" dangerouslySetInnerHTML={{ __html: subtitle }} />
            )}
        </div>
    );
} 