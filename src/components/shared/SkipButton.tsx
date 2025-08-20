'use client';

import { ButtonHTMLAttributes } from 'react';

// SKIP 按鈕屬性介面
interface SkipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** 按鈕位置變體 */
    position?: 'bottom-right' | 'top-right' | 'custom';
    /** 自訂樣式類別 */
    className?: string;
    /** 點擊事件處理函數 */
    onClick?: () => void;
}

/**
 * 統一的 SKIP 按鈕元件
 * 
 * 用於跳過動畫、載入等情況的標準化按鈕
 */
export default function SkipButton({
    position = 'bottom-right',
    className = '',
    onClick,
    ...props
}: SkipButtonProps) {

    // 位置樣式配置
    const positionClasses = {
        'bottom-right': 'absolute bottom-4 right-4',
        'top-right': 'absolute top-4 right-4',
        'custom': '' // 使用自訂的 className
    };

    // 基礎樣式
    const baseClasses = 'z-[99999] bg-[rgba(0,0,0,0.5)] backdrop-blur-lg text-gray-200 px-2 py-2 text-sm hover:bg-gray-800 hover:text-white transition-colors leading-none';

    // 組合最終的 className
    const finalClassName = [
        baseClasses,
        positionClasses[position],
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            onClick={onClick}
            className={finalClassName}
            aria-label="跳過"
            {...props}
        >
            SKIP
        </button>
    );
}
