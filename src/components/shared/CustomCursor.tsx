'use client';

import { useEffect, useState } from 'react';

interface CursorConfig {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

// 預設的 cursor 配置
const cursorConfigs: Record<string, CursorConfig> = {
  explore: {
    text: 'EXPLORE',
    className: 'bg-white border border-black p-2 text-sm font-medium shadow-lg'
  },
  view: {
    text: 'VIEW',
    className: 'bg-black text-white p-2 text-sm font-medium shadow-lg'
  },
  read: {
    text: 'READ MORE',
    className: 'bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded shadow-lg'
  },
  play: {
    text: 'PLAY',
    className: 'bg-red-500 text-white p-2 text-sm font-medium rounded-full shadow-lg'
  }
};

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentCursor, setCurrentCursor] = useState<CursorConfig | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // 檢查當前滑鼠位置下的元素
      const target = e.target as HTMLElement;
      
      // 尋找所有可能的客製化 cursor 屬性
      let foundCursor: CursorConfig | null = null;
      
      for (const [key, config] of Object.entries(cursorConfigs)) {
        const element = target.closest(`[data-custom-cursor="${key}"]`);
        if (element) {
          foundCursor = config;
          break;
        }
      }
      
      // 檢查是否有自定義配置（data-cursor-text 屬性）
      const customElement = target.closest('[data-cursor-text]');
      if (customElement && !foundCursor) {
        const customText = customElement.getAttribute('data-cursor-text');
        const customClass = customElement.getAttribute('data-cursor-class');
        
        if (customText) {
          foundCursor = {
            text: customText,
            className: customClass || 'bg-white border border-black p-2 text-sm font-medium shadow-lg'
          };
        }
      }
      
      setCurrentCursor(foundCursor);
    };

    // 監聽滑鼠移動
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!currentCursor) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[10001] transition-all duration-150"
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) translate(-50%, -50%)`,
      }}
    >
      <div 
        className={currentCursor.className}
        style={currentCursor.style}
      >
        {currentCursor.text}
      </div>
    </div>
  );
}