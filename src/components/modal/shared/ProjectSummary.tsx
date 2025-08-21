'use client';

import { ReactNode } from 'react';

interface SummaryItem {
  text: string;
  children?: SummaryItem[];
}

interface ProjectSummaryProps {
  items?: (string | SummaryItem)[];
  children?: ReactNode;
  itemClass?: string;
  childListClass?: string;
  childItemClass?: string;
  className?: string;
}

export default function ProjectSummary({
  items,
  children,
  itemClass = "mb-4 last:mb-0 last:border-b-0 last:pb-0 leading-relaxed font-noto-sans-tc border-b border-gray-300 pb-4",
  childListClass = "ml-6 mt-2 list-disc",
  childItemClass = "mb-1 last:mb-0 leading-relaxed font-noto-sans-tc text-base",
  className = ''
}: ProjectSummaryProps) {

  // 渲染單個項目的函數 - 完全匹配原始邏輯
  const renderItem = (item: string | SummaryItem, index: number, isChild: boolean = false) => {
    // 選擇要使用的樣式類別
    const currentItemClass = isChild ? childItemClass : itemClass;

    // 如果是字串，直接渲染
    if (typeof item === 'string') {
      return (
        <li key={index} className={currentItemClass}>
          {item}
        </li>
      );
    }

    // 如果是物件，檢查是否有子項目
    if (typeof item === 'object' && item.text) {
      return (
        <li key={index} className={currentItemClass}>
          {item.text}
          {/* 如果有子項目，創建嵌套的 ul */}
          {item.children && item.children.length > 0 && (
            <ul className={childListClass}>
              {item.children.map((childItem, childIndex) =>
                renderItem(childItem, childIndex, true)
              )}
            </ul>
          )}
        </li>
      );
    }

    return null;
  };

  return (
    <div className={`max-w-[40rem] relative mx-auto ${className}`}>
      <div className="absolute top-[1rem] right-[-1.5rem] w-[5rem] h-[1px] bg-red-90 rotate-45"></div>
      <div className="absolute bottom-[1rem] left-[-1.5rem] w-[5rem] h-[1px] bg-red-90 rotate-45"></div>
      <ul className="my-12 no-list-style px-8 py-12 bg-white text-lg font-noto-sans-tc">
        {items ? (
          items.map((item, index) => renderItem(item, index, false))
        ) : (
          children
        )}
      </ul>
    </div>
  );
}