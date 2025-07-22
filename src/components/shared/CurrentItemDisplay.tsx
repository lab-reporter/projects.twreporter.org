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
        <div className={` ${className}`}>
            {/* 標題 */}
            {title && (
                <h3 className="mb-2">
                    {title}
                </h3>
            )}
            {/* 副標題 */}
            {subtitle && (
                <h5 className="text-gray-700">
                    {subtitle}
                </h5>
            )}
        </div>
    );
} 