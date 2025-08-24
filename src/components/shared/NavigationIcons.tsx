'use client';

interface NavigationIconProps {
    size?: number;
    className?: string;
}

// 左箭頭圖示
export function ChevronLeftIcon({ size = 16, className = '' }: NavigationIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-colors duration-300 ${className}`}
        >
            <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
    );
}

// 右箭頭圖示
export function ChevronRightIcon({ size = 16, className = '' }: NavigationIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-colors duration-300 ${className}`}
        >
            <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
    );
}

// 上箭頭圖示
export function ChevronUpIcon({ size = 16, className = '' }: NavigationIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-colors duration-300 ${className}`}
        >
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    );
}

// 下箭頭圖示
export function ChevronDownIcon({ size = 16, className = '' }: NavigationIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-colors duration-300 ${className}`}
        >
            <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
    );
}
