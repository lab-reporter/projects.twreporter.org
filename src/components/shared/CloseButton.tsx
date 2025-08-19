'use client';

import { ReactNode } from 'react';

interface CloseButtonProps {
    onClick: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'modal' | 'overlay';
    children?: ReactNode;
    ariaLabel?: string;
}

/**
 * 共用的關閉按鈕組件
 * 提供統一的關閉按鈕樣式和行為
 */
export default function CloseButton({
    onClick,
    className = '',
    size = 'md',
    variant = 'default',
    children,
    ariaLabel = '關閉'
}: CloseButtonProps) {
    // 尺寸配置
    const sizeClasses = {
        sm: 'w-8 h-8 p-1',
        md: 'w-12 h-12 p-2',
        lg: 'w-16 h-16 p-3'
    };

    // 變體樣式配置
    const variantClasses = {
        default: 'bg-white/50 shadow-md hover:bg-black group',
        modal: 'bg-white/50 shadow-md hover:bg-black group',
        overlay: 'bg-gray-100 hover:bg-red-50 hover:text-white'
    };

    // SVG 圖示尺寸
    const iconSizes = {
        sm: '12',
        md: '16',
        lg: '20'
    };

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center rounded-full transition-colors duration-300
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
            aria-label={ariaLabel}
        >
            {children || (
                <svg
                    width={iconSizes[size]}
                    height={iconSizes[size]}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={variant === 'default' || variant === 'modal' ?
                        'stroke-current group-hover:stroke-white' :
                        'stroke-current'
                    }
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            )}
        </button>
    );
}
