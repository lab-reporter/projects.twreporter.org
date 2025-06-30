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
                e.target.style.backgroundColor = 'white';
                e.target.style.color = 'black';
              }
            }}
            onMouseLeave={(e) => {
              if (currentSection !== section.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#9CA3AF';
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