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
  // 控制導航是否顯示的狀態 - 預設為顯示
  const [isVisible, setIsVisible] = useState(true);
  // 視窗寬度狀態
  const [windowWidth, setWindowWidth] = useState(1024);


  // 副作用：監聽視窗大小變化
  useEffect(() => {
    // 初始化視窗寬度
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      // 根據視窗寬度設定是否顯示
      setIsVisible(window.innerWidth >= 768);
    }

    // 處理視窗大小變化
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        setWindowWidth(width);
        // 小於 768px 時隱藏
        setIsVisible(width >= 768);
      }
    };

    // 註冊事件監聽器
    window.addEventListener('resize', handleResize);

    // 清理函數
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // 滾動到指定章節的函數
  const scrollToSection = async (sectionId: string) => {
    // 查找目標元素
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (!targetElement) return;

    // 立即更新當前章節狀態
    const { setCurrentSection } = useStore.getState();
    setCurrentSection(sectionId);
    
    // 獲取目標位置
    const targetPosition = targetElement.offsetTop;
    
    // 手動處理背景顏色
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // 如果跳轉到 feedbacks 或 support，背景應該是黑色
      if (sectionId === 'feedbacks' || sectionId === 'support') {
        mainElement.style.backgroundColor = 'rgba(0, 0, 0, 1)';
      } else {
        // 其他區塊背景應該是白色
        mainElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      }
    }
    
    // 強制跳轉（無動畫）
    window.scrollTo(0, targetPosition);
    
    // 確保 ScrollTrigger 更新並重新計算背景動畫
    setTimeout(async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      // 刷新所有 ScrollTrigger
      ScrollTrigger.refresh();
      
      // 強制更新背景動畫的進度
      const bgAnimation = ScrollTrigger.getById('main-background-animation');
      if (bgAnimation) {
        bgAnimation.refresh();
      }
    }, 50);
  };

  // 如果導航不可見，不渲染任何內容
  if (!isVisible) {
    return null;
  }

  return (
    // 導航容器：固定在右側中間位置，簡單淡入效果
    // 使用 hidden md:flex 來確保在小裝置上完全不渲染
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[999] transition-all duration-500 ease-out hidden md:flex"
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
              className="text-sm font-medium tracking-wider font-noto-sans-tc"
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