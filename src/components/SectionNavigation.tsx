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
  // 確保有預設值：如果 currentSection 為空，預設為 'reports'
  const activeSection = currentSection || 'reports';
  
  // 開發環境調試
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 SectionNavigation - currentSection:', currentSection);
      console.log('🎯 SectionNavigation - activeSection:', activeSection);
    }
  }, [currentSection, activeSection]);
  // 控制導航是否顯示的狀態
  const [isVisible, setIsVisible] = useState(false);
  // 動畫完成狀態追蹤
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);
  // Reports heading 動畫完成狀態
  const [isReportsHeadingVisible, setIsReportsHeadingVisible] = useState(false);

  // 副作用：監聽主動畫完成狀態
  useEffect(() => {
    // 根據 useMainTimeline 的時間配置：
    // REPORTS_HEADING_START: 3.5s + 動畫時長 1s = 4.5秒
    const REPORTS_HEADING_COMPLETE = 4500;

    // 標記動畫完成
    const animationTimer = setTimeout(() => {
      setIsAnimationCompleted(true);
      setIsReportsHeadingVisible(true);
    }, REPORTS_HEADING_COMPLETE);

    return () => clearTimeout(animationTimer);
  }, []);

  // 副作用：根據滾動位置和動畫狀態控制導航顯示
  useEffect(() => {
    // 檢查導航是否應該顯示的函數
    const checkVisibility = () => {
      // 只有在 Reports heading 動畫完成後才顯示導航
      if (!isReportsHeadingVisible) {
        setIsVisible(false);
        return;
      }

      // Reports heading 動畫完成後即顯示導航
      setIsVisible(true);
    };

    // 初始檢查導航可見性
    checkVisibility();

    // 監聽滾動事件來動態調整可見性
    window.addEventListener('scroll', checkVisibility);

    // 額外監聽 resize 事件，確保響應式正確
    window.addEventListener('resize', checkVisibility);

    // 定期檢查狀態（減少頻率，因為已經簡化邏輯）
    const intervalCheck = setInterval(checkVisibility, 200);

    // 清理函數：移除事件監聽器
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      clearInterval(intervalCheck);
    };
  }, [isReportsHeadingVisible]); // 添加 isReportsHeadingVisible 作為依賴


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

  // 如果導航不可見或動畫未完成，不渲染任何內容
  if (!isVisible || !isAnimationCompleted) {
    return null;
  }

  return (
    // 導航容器：固定在右側中間位置，簡單淡入效果
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[999] transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(-50%) translateX(${isVisible ? '0' : '20px'})`
      }}
    >

      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              padding: '8px 8px',
              // 根據是否為當前章節設定背景色
              backgroundColor: activeSection === section.id ? '#9B051E' : 'transparent',
              // 根據是否為當前章節設定文字顏色
              color: activeSection === section.id ? 'white' : '#9CA3AF',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            // 滑鼠進入事件：非當前章節時變更樣式
            onMouseEnter={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }
            }}
            // 滑鼠離開事件：非當前章節時還原樣式
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
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