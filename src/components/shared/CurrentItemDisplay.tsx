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
            className={`select-none max-w-[40rem] w-full md:min-w-[25rem] group px-4 ${className} ${currentItem && onTitleClick
                ? 'cursor-pointer hover:text-gray-600'
                : ''
                }`}
            onClick={currentItem && onTitleClick ? handleTitleClick : undefined}
        >
            {/* 標題 */}
            {title && (
                <h4 className="text-inherit">
                    {title}
                </h4>
            )}
            {/* 副標題 */}
            {subtitle && (
                <h6 className="
                mt-2 text-inherit font-noto-sans-tc font-normal text-md leading-relaxed">
                    {subtitle}
                </h6>
            )}
        </div>
    );
} 