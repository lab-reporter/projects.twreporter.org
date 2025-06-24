'use client';

import { useStore } from '@/stores';

const sections = [
  { id: 'opening', name: '開場', icon: '🎬' },
  { id: 'reports', name: '報導', icon: '📰' },
  { id: 'innovation', name: '創新', icon: '💡' },
  { id: 'timeline', name: '歷程', icon: '⏳' },
  { id: 'feedback', name: '見證', icon: '💬' },
  { id: 'support', name: '支持', icon: '❤️' }
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
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-black/30 backdrop-blur-md rounded-full p-2 space-y-1">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              group relative block w-12 h-12 rounded-full transition-all duration-300
              ${currentSection === section.id 
                ? 'bg-white text-black scale-110' 
                : 'bg-white/20 text-white hover:bg-white/40 hover:scale-105'
              }
            `}
            title={section.name}
          >
            <span className="text-lg">{section.icon}</span>
            
            {/* 工具提示 */}
            <div className={`
              absolute right-full mr-3 top-1/2 -translate-y-1/2
              bg-black text-white px-3 py-1 rounded text-sm whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            `}>
              {section.name}
            </div>
            
            {/* 當前指示器 */}
            {currentSection === section.id && (
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}