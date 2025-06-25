'use client';

import { useStore } from '@/stores';

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
    if (sectionIndex !== -1) {
      const targetY = sectionIndex * window.innerHeight;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998]">
      <div className="flex flex-col space-y-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              group relative flex items-center justify-center px-[4px] py-[8px] rounded-sm transition-all duration-300 hover:scale-105 active:scale-95
              ${currentSection === section.id 
                ? 'text-white' 
                : 'bg-transparent'
              }
            `}
            style={{
              backgroundColor: currentSection === section.id ? '#9B051E' : 'transparent'
            }}
            title={section.name}
            aria-label={`跳到 ${section.name} 區塊`}
          >
            <span
              className="text-sm text-inherit md:text-base font-medium tracking-wider"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}
            >
              {section.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}