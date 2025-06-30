'use client';

import { useStore } from '@/stores';

const sections = [
  { id: 'reports', name: '影響力' },
  { id: 'innovations', name: '創新' },
  { id: 'challenges', name: '突圍' },
  { id: 'feedbacks', name: '證言' },
  { id: 'support', name: '贊助支持' }
];

export default function SectionNavigation() {
  const { currentSection } = useStore();

  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(`section-${sectionId}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998]">
      <div className="flex flex-col space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              flex items-center justify-center transition-all duration-300 p-2 cursor-pointer
              ${currentSection === section.id
                ? 'bg-red-90 text-white'
                : 'bg-transparent text-gray-400 hover:bg-white hover:text-black'
              }
            `}
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