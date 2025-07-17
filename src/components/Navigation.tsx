'use client';

import Image from 'next/image';
import { useStore } from '@/stores';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// 主導航組件
const Navigation = () => {
  // 從全域狀態取得當前章節
  const { currentSection } = useStore();
  const navRef = useRef<HTMLDivElement>(null);

  // 設定初始狀態：直接顯示在正常位置
  useEffect(() => {
    if (navRef.current) {
      // 設定正常位置
      gsap.set(navRef.current, {
        top: '3rem',
        transform: 'translateY(0) scale(1)'
      });
    }
  }, []);

  // 根據當前章節決定使用哪個 logo
  // Reports/Innovations/Challenges 使用 light logo (預設)
  // Feedbacks/Support 使用 dark logo
  const isDarkSection = currentSection === 'feedbacks' || currentSection === 'support';
  const logoSrc = isDarkSection ? '/assets/nav_logo--dark.svg' : '/assets/nav_logo--light.svg';

  return (
    <>
      {/* 導航外層容器：永遠顯示在最上層 */}
      <div
        id="main-navigation"
        ref={navRef}
        className="w-full fixed flex justify-center items-center z-[99] text-black"
      >
        {/* 導航內容容器 */}
        <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
          {/* 網站標誌 */}
          <Image
            src={logoSrc}
            alt="Logo"
            width={160}
            height={40}
            priority={true}
            className="h-10 w-auto"
          />
        </div>
      </div>
    </>
  );
};

export default Navigation;