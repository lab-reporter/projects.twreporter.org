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
    previousLabel = "上一個項目",
    nextLabel = "下一個項目",
    previousTooltip = "上一個",
    nextTooltip = "下一個",
    className = "",
    disabled = false
}: NavigationButtonsProps) {
    // 統一的按鈕基礎樣式
    const buttonBaseStyles = "group relative z-50 p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";

    // 統一的圖標樣式
    const iconStyles = "w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300 group-disabled:group-hover:text-gray-700";

    // 統一的提示文字樣式
    const tooltipStyles = "font-noto-sans-tc absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none group-disabled:opacity-0";

    return (
        <div className={`flex gap-4 ${className}`}>
            {/* 上一個按鈕 */}
            <button
                onClick={onPrevious}
                disabled={disabled}
                className={buttonBaseStyles}
                aria-label={previousLabel}
            >
                <ChevronLeft className={iconStyles} />
                {/* 懸停提示文字 */}
                <div className={tooltipStyles}>
                    {previousTooltip}
                </div>
            </button>

            {/* 下一個按鈕 */}
            <button
                onClick={onNext}
                disabled={disabled}
                className={buttonBaseStyles}
                aria-label={nextLabel}
            >
                <ChevronRight className={iconStyles} />
                {/* 懸停提示文字 */}
                <div className={tooltipStyles}>
                    {nextTooltip}
                </div>
            </button>
        </div>
    );
}
