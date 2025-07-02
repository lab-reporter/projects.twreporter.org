'use client';

interface CurrentItemDisplayProps {
    currentItem?: {
        title: string;
        subtitle?: string;
    } | null;
    className?: string;
}

export default function CurrentItemDisplay({ currentItem, className = "" }: CurrentItemDisplayProps) {
    if (!currentItem) return null;

    return (
        <div className={`absolute w-full bottom-16 transform text-center flex flex-col items-center justify-center ${className}`}>
            {/* 當前項目標題 */}
            <h3 className="text-4xl font-bold mb-2 text-gray-900">
                {currentItem.title || ''}
            </h3>
            {/* 當前項目副標題 */}
            <h4 className="text-xl text-gray-700">
                {currentItem.subtitle || ''}
            </h4>
        </div>
    );
} 