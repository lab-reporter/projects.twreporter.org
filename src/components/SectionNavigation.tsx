'use client';

import { useStore } from '@/stores';
import { useEffect, useState } from 'react';


// 章節導航配置：定義所有可導航的頁面章節
// 第一組：reports, innovations, challenges（透明背景樣式）
const firstGroupSections = [
  { id: 'reports', name: '報導影響力' },
  { id: 'innovations', name: '多元創新' },
  { id: 'challenges', name: '媒體突圍' }
];

// 第二組：support（實心背景樣式）
const secondGroupSections = [
  { id: 'support', name: '贊助支持' }
];



// 章節導航組件
export default function SectionNavigation() {
  // 從全域狀態取得當前章節和導航顯示狀態
  const { currentSection, isSectionNavigationVisible } = useStore();
  // 確保有預設值：如果 currentSection 為空，預設為 'reports'
  const activeSection = currentSection || 'reports';

  // 開發環境調試
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 SectionNavigation - currentSection:', currentSection);
      console.log('🎯 SectionNavigation - activeSection:', activeSection);
    }
  }, [currentSection, activeSection]);
  // 結合 store 狀態和視窗寬度判斷是否顯示
  const [isWindowSizeValid, setIsWindowSizeValid] = useState(true);


  // 副作用：監聽視窗大小變化
  useEffect(() => {
    // 初始化視窗寬度
    if (typeof window !== 'undefined') {
      // 根據視窗寬度設定是否顯示
      setIsWindowSizeValid(window.innerWidth >= 768);
    }

    // 處理視窗大小變化
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        // 小於 768px 時隱藏
        setIsWindowSizeValid(width >= 768);
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


    // 檢查是否有 swiper 正在動畫，如果是則忽略此次調用
    if (document.body.hasAttribute('data-swiper-animating')) {
      return;
    }

    // 查找目標元素
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (!targetElement) {
      return;
    }

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

  // 如果導航不可見或視窗太小，不渲染任何內容
  if (!isSectionNavigationVisible || !isWindowSizeValid) {
    return null;
  }

  // 第一組按鈕的樣式生成函數
  const getFirstGroupButtonClass = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    const baseClass = 'bg-transparent backdrop-blur-md border-none cursor-pointer transition-all duration-300 ease-out';

    if (isActive) {
      return `${baseClass} text-black`;
    }
    return `${baseClass} text-[rgba(150,150,150,0.5)] hover:text-red-90`;
  };

  // 第二組按鈕的樣式生成函數
  const getSecondGroupButtonClass = () => {
    return 'py-4 px-2 text-white bg-red-70 hover:bg-red-50 border-none cursor-pointer rounded-full mt-4 transition-all duration-300 ease-out';
  };

  return (
    // 導航容器：固定在右側中間位置，簡單淡入效果
    // 使用 hidden md:flex 來確保在小裝置上完全不渲染
    <nav
      className="select-none w-[4rem] border-white sticky left-[100vw] top-1/2 -translate-y-1/2 z-[999] transition-all duration-500 ease-out"
      style={{
        opacity: isSectionNavigationVisible ? 1 : 0,
        transform: `translateY(-50%) translateX(${isSectionNavigationVisible ? '0' : '20px'})`
      }}
    >
      <div className="flex flex-col justify-center items-center gap-4">
        {/* 第一組按鈕：reports, innovations, challenges */}
        {firstGroupSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={getFirstGroupButtonClass(section.id)}
            title={section.name}
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

        {/* 第二組按鈕：support */}
        {secondGroupSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={getSecondGroupButtonClass()}
            title={section.name}
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