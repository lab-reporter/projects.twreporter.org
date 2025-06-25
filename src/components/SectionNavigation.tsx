'use client';

import { useStore } from '@/stores';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const sections = [
  { id: 'reports', name: '影響力報導' },
  { id: 'innovation', name: '多元創新' },
  { id: 'timeline', name: '非營利媒體之路' },
  { id: 'feedback', name: '贊助者證言' },
  { id: 'support', name: '贊助支持' }
];

export default function SectionNavigation() {
  const { currentSection } = useStore();

  const scrollToSection = (sectionId) => {
    console.log('🔧 點擊導航按鈕:', sectionId);
    
    // 檢查 GSAP ScrollTrigger 狀態
    const gsapInfo = (window as any).gsapScrollInfo;
    if (gsapInfo) {
      console.log('📡 GSAP ScrollTrigger 狀態:', gsapInfo);
    }
    
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) {
      console.error('❌ 找不到 section:', sectionId);
      return;
    }

    // 方法 1: 嘗試使用 HTML ID 錨點跳轉
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (targetElement) {
      console.log('✅ 使用 HTML ID 錨點跳轉:', `section-${sectionId}`);
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // 同樣需要手動觸發 ScrollTrigger 更新
      setTimeout(() => {
        console.log('🔄 HTML ID 跳轉後手動觸發 ScrollTrigger 更新');
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event('scroll'));
      }, 1000);
      
      return;
    }

    // 方法 2: 計算百分比位置跳轉
    const sectionProgress = sectionIndex / sections.length;
    const totalHeight = document.documentElement.scrollHeight;
    const currentScrollY = window.scrollY;
    const targetY = sectionProgress * totalHeight;
    
    console.log('📊 滾動除錯資訊:', {
      sectionIndex,
      sectionProgress: `${(sectionProgress * 100).toFixed(1)}%`,
      totalHeight,
      currentScrollY,
      targetY,
      willScroll: targetY !== currentScrollY
    });
    
    if (Math.abs(targetY - currentScrollY) < 10) {
      console.log('⚠️ 目標位置與當前位置太接近，跳過滾動');
      return;
    }
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    
    // 等待滾動完成後，手動觸發 ScrollTrigger 更新
    setTimeout(() => {
      const newScrollY = window.scrollY;
      console.log('🔍 滾動結果檢查:', {
        期望位置: targetY,
        實際位置: newScrollY,
        差異: Math.abs(targetY - newScrollY),
        滾動成功: Math.abs(targetY - newScrollY) < 50
      });
      
      // 手動刷新 ScrollTrigger 讓 3D 場景同步
      console.log('🔄 手動觸發 ScrollTrigger 更新');
      ScrollTrigger.refresh();
      
      // 如果還是不同步，強制觸發 scroll 事件
      window.dispatchEvent(new Event('scroll'));
    }, 1000);
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998]">
      <div className="flex flex-col space-y-2 gap-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              group relative flex items-center justify-center transition-all duration-300 hover:scale-105 px-4 py-2 cursor-pointer
              ${currentSection === section.id 
                ? 'bg-red-90 text-white' 
                : 'bg-transparent text-black hover:bg-gray-100'
              }
            `}
            style={{
              padding: '8px'
            }}
            title={section.name}
            aria-label={`跳到 ${section.name} 區塊`}
          >
            <p
              className="text-base font-medium tracking-wider"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
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