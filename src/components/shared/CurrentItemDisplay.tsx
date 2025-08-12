'use client';

interface CurrentItemDisplayProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export default function CurrentItemDisplay({ title, subtitle, className = "" }: CurrentItemDisplayProps) {
    // 如果沒有標題也沒有副標題，則不顯示
    if (!title && !subtitle) return null;

    return (
        <div className={`max-w-[40rem] px-4 ${className}`}>
            {/* 標題 */}
            {title && (
                <h3 className="mb-2" dangerouslySetInnerHTML={{ __html: title }} />
            )}
            {/* 副標題 */}
            {subtitle && (
                <h6 className="text-gray-700 font-noto-sans-tc font-normal text-md leading-relaxed" dangerouslySetInnerHTML={{ __html: subtitle }} />
            )}
        </div>
    );
} 