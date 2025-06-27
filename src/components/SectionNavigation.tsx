'use client';

import { useStore } from '@/stores';
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
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    // 使用 HTML ID 錨點跳轉
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // 手動觸發 ScrollTrigger 更新
      setTimeout(() => {
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
    
    if (Math.abs(targetY - currentScrollY) < 10) {
      return; // 目標位置與當前位置太接近
    }
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    
    // 等待滾動完成後，手動觸發 ScrollTrigger 更新
    setTimeout(() => {
      ScrollTrigger.refresh();
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
                : 'bg-transparent text-gray-400 hover:bg-white hover:text-black'
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