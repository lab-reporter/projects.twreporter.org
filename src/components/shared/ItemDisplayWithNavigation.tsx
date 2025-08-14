'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import CurrentItemDisplay from './CurrentItemDisplay';

// 整合組件介面定義
interface ItemDisplayWithNavigationProps {
    // CurrentItemDisplay 相關屬性
    title?: string;
    subtitle?: string;
    displayClassName?: string;

    // NavigationButtons 相關屬性
    onPrevious: () => void;
    onNext: () => void;
    previousLabel?: string;
    nextLabel?: string;
    previousTooltip?: string;
    nextTooltip?: string;
    navigationDisabled?: boolean;

    // 容器相關屬性
    className?: string;
}

// 帶導航的項目顯示組件：常用的左按鈕 + 內容 + 右按鈕佈局
export default function ItemDisplayWithNavigation({
    // CurrentItemDisplay 屬性
    title,
    subtitle,
    displayClassName,

    // NavigationButtons 屬性
    onPrevious,
    onNext,
    previousLabel = "上一個項目",
    nextLabel = "下一個項目",
    previousTooltip = "上一個",
    nextTooltip = "下一個",
    navigationDisabled = false,

    // 容器屬性
    className = ""
}: ItemDisplayWithNavigationProps) {
    // 統一的按鈕基礎樣式
    const buttonStyles = "group relative z-50 p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";
    const iconStyles = "w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300 group-disabled:group-hover:text-gray-700";
    const tooltipStyles = "font-noto-sans-tc absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none group-disabled:opacity-0";

    return (
        <div className={`flex justify-center items-center ${className}`}>
            {/* 上一個按鈕 */}
            <button
                onClick={onPrevious}
                disabled={navigationDisabled}
                className={buttonStyles}
                aria-label={previousLabel}
            >
                <ChevronLeft className={iconStyles} />
                <div className={tooltipStyles}>
                    {previousTooltip}
                </div>
            </button>

            {/* 內容顯示區域 */}
            <CurrentItemDisplay
                title={title}
                subtitle={subtitle}
                className={`mx-6 ${displayClassName || ''}`}
            />

            {/* 下一個按鈕 */}
            <button
                onClick={onNext}
                disabled={navigationDisabled}
                className={buttonStyles}
                aria-label={nextLabel}
            >
                <ChevronRight className={iconStyles} />
                <div className={tooltipStyles}>
                    {nextTooltip}
                </div>
            </button>
        </div>
    );
}
