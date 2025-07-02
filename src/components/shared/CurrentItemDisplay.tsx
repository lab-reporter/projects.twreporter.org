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
        <div className={`w-full text-center flex flex-col items-center justify-center ${className}`}>
            {/* 標題 */}
            {title && (
                <h3 className="text-4xl font-bold mb-2 text-gray-900">
                    {title}
                </h3>
            )}
            {/* 副標題 */}
            {subtitle && (
                <h4 className="text-xl text-gray-700">
                    {subtitle}
                </h4>
            )}
        </div>
    );
} 