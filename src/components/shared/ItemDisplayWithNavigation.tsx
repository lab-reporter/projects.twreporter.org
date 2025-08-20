'use client';

import CurrentItemDisplay from './CurrentItemDisplay';
import Button from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from './NavigationIcons';


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


    return (
        <div className={`flex px-8 justify-center items-center ${className}`}>
            {/* 上一個按鈕 */}
            <Button
                variant="navigation"
                shape="circle"
                size="sm"
                onClick={() => {
                    if (!navigationDisabled) {
                        onPrevious();
                    }
                }}
                disabled={navigationDisabled}
                aria-label={previousLabel}
                leftIcon={<ChevronLeftIcon size={16} />}
            />

            {/* 內容顯示區域 */}
            <CurrentItemDisplay
                title={title}
                subtitle={subtitle}
                className={displayClassName}
                currentItem={currentItem}
                onTitleClick={onTitleClick}
            />

            {/* 下一個按鈕 */}
            <Button
                variant="navigation"
                size="sm"
                shape="circle"
                onClick={() => {
                    if (!navigationDisabled) {
                        onNext();
                    }
                }}
                disabled={navigationDisabled}
                aria-label={nextLabel}
                leftIcon={<ChevronRightIcon size={16} />}
            />
        </div>
    );
}
