'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// 導航按鈕組件介面定義
interface NavigationButtonsProps {
    // 上一個項目的點擊處理函數
    onPrevious: () => void;
    // 下一個項目的點擊處理函數
    onNext: () => void;
    // 上一個按鈕的無障礙標籤
    previousLabel?: string;
    // 下一個按鈕的無障礙標籤
    nextLabel?: string;
    // 上一個按鈕的提示文字
    previousTooltip?: string;
    // 下一個按鈕的提示文字
    nextTooltip?: string;
    // 自訂樣式類別
    className?: string;
    // 是否禁用按鈕
    disabled?: boolean;
}

// 統一的導航按鈕組件
export default function NavigationButtons({
    onPrevious,
    onNext,
    className = "",
    disabled = false
}: NavigationButtonsProps) {
    // 統一的按鈕基礎樣式
    const buttonBaseStyles = "group relative z-50 p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";

    // 統一的圖標樣式
    const iconStyles = "w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300 group-disabled:group-hover:text-gray-700";

    return (
        <div className={`flex gap-4 ${className}`}>
            {/* 上一個按鈕 */}
            <button
                onClick={onPrevious}
                disabled={disabled}
                className={buttonBaseStyles}
            >
                <ChevronLeft className={iconStyles} />
            </button>

            {/* 下一個按鈕 */}
            <button
                onClick={onNext}
                disabled={disabled}
                className={buttonBaseStyles}
            >
                <ChevronRight className={iconStyles} />
            </button>
        </div>
    );
}
