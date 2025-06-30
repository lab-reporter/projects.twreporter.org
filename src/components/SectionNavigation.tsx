'use client';

import { useStore } from '@/stores';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'reports', name: '影響力' },
  { id: 'innovations', name: '創新' },
  { id: 'challenges', name: '突圍' },
  { id: 'feedbacks', name: '證言' },
  { id: 'support', name: '贊助支持' }
];

export default function SectionNavigation() {
  const { currentSection } = useStore(); // 恢復使用全域狀態
  const [isVisible, setIsVisible] = useState(false);

  // Debug: 監聽 currentSection 變化
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 SectionNavigation: currentSection 變更為 "${currentSection}"`);
    }
  }, [currentSection]);

  // 使用滾動位置來控制顯示
  useEffect(() => {
    const checkVisibility = () => {
      const reportsSection = document.getElementById('section-reports');
      if (reportsSection) {
        const rect = reportsSection.getBoundingClientRect();
        // 當 Reports Section 進入視窗範圍時顯示導航
        const shouldShow = rect.top <= window.innerHeight * 0.8;
        setIsVisible(shouldShow);
      }
    };

    // 初始檢查
    checkVisibility();

    // 監聽滾動事件
    window.addEventListener('scroll', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 如果不可見，返回 null
  if (!isVisible) {
    return null;
  }

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998]">
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              padding: '8px 8px',
              backgroundColor: currentSection === section.id ? '#9B051E' : 'transparent',
              color: currentSection === section.id ? 'white' : '#9CA3AF',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (currentSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }
            }}
            onMouseLeave={(e) => {
              if (currentSection !== section.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }
            }}
            title={section.name}
            aria-label={`跳到 ${section.name} 區塊`}
          >
            <p
              className="text-base font-medium tracking-wider"
              style={{
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