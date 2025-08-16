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

    navigationDisabled?: boolean;

    // 容器相關屬性
    className?: string;

    // 新增：當前項目資料和點擊處理函數
    currentItem?: Record<string, unknown>;
    onTitleClick?: (item: Record<string, unknown>) => void;
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

    navigationDisabled = false,

    // 容器屬性
    className = "",

    // 新增屬性
    currentItem,
    onTitleClick
}: ItemDisplayWithNavigationProps) {
    // 統一的按鈕基礎樣式
    const buttonStyles = "group relative z-50 p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";
    const iconStyles = "w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300 group-disabled:group-hover:text-gray-700";


    return (
        <div className={`flex px-8 justify-center items-center ${className}`}>
            {/* 上一個按鈕 */}
            <button
                onClick={() => {
                    if (!navigationDisabled) {
                        onPrevious();
                    }
                }}
                disabled={navigationDisabled}
                className={buttonStyles}
                aria-label={previousLabel}
            >
                <ChevronLeft className={iconStyles} />
            </button>

            {/* 內容顯示區域 */}
            <CurrentItemDisplay
                title={title}
                subtitle={subtitle}
                currentItem={currentItem}
                onTitleClick={onTitleClick}
            />

            {/* 下一個按鈕 */}
            <button
                onClick={() => {
                    if (!navigationDisabled) {
                        onNext();
                    }
                }}
                disabled={navigationDisabled}
                className={buttonStyles}
                aria-label={nextLabel}
            >
                <ChevronRight className={iconStyles} />
            </button>
        </div>
    );
}
