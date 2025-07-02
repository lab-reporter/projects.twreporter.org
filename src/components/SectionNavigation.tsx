'use client';

import { useStore } from '@/stores';
import { useEffect, useState } from 'react';

// 章節導航配置：定義所有可導航的頁面章節
const sections = [
  { id: 'reports', name: '影響力' },
  { id: 'innovations', name: '創新' },
  { id: 'challenges', name: '突圍' },
  { id: 'feedbacks', name: '證言' },
  { id: 'support', name: '贊助支持' }
];

// 章節導航組件
export default function SectionNavigation() {
  // 從全域狀態取得當前章節
  const { currentSection } = useStore();
  // 控制導航是否顯示的狀態
  const [isVisible, setIsVisible] = useState(false);

  // 副作用：開發環境中記錄章節變化
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 SectionNavigation: currentSection 變更為 "${currentSection}"`);
    }
  }, [currentSection]);

  // 副作用：根據滾動位置控制導航顯示
  useEffect(() => {
    // 檢查導航是否應該顯示的函數
    const checkVisibility = () => {
      // 取得 reports 章節的 DOM 元素
      const reportsSection = document.getElementById('section-reports');
      if (reportsSection) {
        // 取得元素的位置資訊
        const rect = reportsSection.getBoundingClientRect();
        // 當 Reports 章節進入視窗範圍時顯示導航
        const shouldShow = rect.top <= window.innerHeight * 0.8;
        setIsVisible(shouldShow);
      }
    };

    // 初始檢查導航可見性
    checkVisibility();

    // 監聽滾動事件來動態調整可見性
    window.addEventListener('scroll', checkVisibility);

    // 清理函數：移除事件監聽器
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  // 滾動到指定章節的函數
  const scrollToSection = (sectionId: string) => {
    // 查找目標元素
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (targetElement) {
      // 平滑滾動到目標位置
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 如果導航不可見，不渲染任何內容
  if (!isVisible) {
    return null;
  }

  return (
    // 導航容器：固定在右側中間位置
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[999]">
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              padding: '8px 8px',
              // 根據是否為當前章節設定背景色
              backgroundColor: currentSection === section.id ? '#9B051E' : 'transparent',
              // 根據是否為當前章節設定文字顏色
              color: currentSection === section.id ? 'white' : '#9CA3AF',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            // 滑鼠進入事件：非當前章節時變更樣式
            onMouseEnter={(e) => {
              if (currentSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }
            }}
            // 滑鼠離開事件：非當前章節時還原樣式
            onMouseLeave={(e) => {
              if (currentSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }
            }}
            // 滑鼠懸停時的提示文字
            title={section.name}
            // 無障礙標籤
            aria-label={`跳到 ${section.name} 區塊`}
          >
            <p
              className="text-base font-medium tracking-wider"
              style={{
                // 垂直排列文字
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                lineHeight: '1'
              }}
            >
              {section.name}
            </p>
          </button>
        ))}
      </div>
    </nav>
  );
}