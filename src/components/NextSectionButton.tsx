'use client';

import { useStore } from '@/stores';
import { useEffect, useState } from 'react';

// 章節跳轉映射：定義當前章節對應的下一個章節
const sectionNextMap: Record<string, string> = {
  'reports': 'innovations',
  'innovations': 'challenges',
  'challenges': 'feedbacks'
};

// 章節顯示名稱映射
const sectionDisplayMap: Record<string, string> = {
  'innovations': '創新',
  'challenges': '突圍',
  'feedbacks': '證言'
};

// 下一章節按鈕組件
export default function NextSectionButton() {
  // 從全域狀態取得當前章節
  const { currentSection } = useStore();
  // 控制按鈕是否顯示的狀態
  const [isVisible, setIsVisible] = useState(false);

  // 副作用：根據當前章節控制按鈕顯示
  useEffect(() => {
    // 只在指定的三個章節顯示按鈕
    const shouldShow = currentSection && sectionNextMap[currentSection];
    setIsVisible(shouldShow);
  }, [currentSection]);

  // 滾動到下一個章節的函數
  const scrollToNextSection = () => {
    if (!currentSection) return;

    const nextSectionId = sectionNextMap[currentSection];
    if (!nextSectionId) return;

    // 查找目標元素
    const targetElement = document.getElementById(`section-${nextSectionId}`);
    if (targetElement) {
      // 平滑滾動到目標位置
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 如果按鈕不可見，不渲染任何內容
  if (!isVisible || !currentSection || !sectionNextMap[currentSection]) {
    return null;
  }

  const nextSectionId = sectionNextMap[currentSection];
  const nextSectionName = sectionDisplayMap[nextSectionId];

  return (
    // 按鈕容器：固定在右下角
    <div className="fixed bottom-8 right-8 z-[998]">
      <button
        onClick={scrollToNextSection}
        className="group relative flex items-center justify-center w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
        title={`跳到下一章節：${nextSectionName}`}
        aria-label={`跳到 ${nextSectionName} 章節`}
      >
        {/* 箭頭圖示 */}
        <svg
          className="w-4 h-4 text-gray-700 group-hover:text-red-600 transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>

        {/* 懸停提示文字 */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          下一章節：{nextSectionName}
        </div>
      </button>
    </div>
  );
}