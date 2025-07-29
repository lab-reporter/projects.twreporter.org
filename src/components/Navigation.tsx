'use client';

import Image from 'next/image';
import { useStore } from '@/stores';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// 主導航組件
const Navigation = () => {
  // 從全域狀態取得當前章節和導航欄可見性
  const { currentSection, isNavigationVisible, setNavigationVisible } = useStore();
  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50; // 滾動閾值，避免過於敏感

  // 滾動監聽邏輯
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      
      // 只有在滾動超過閾值時才更新
      if (scrollDelta < scrollThreshold) return;
      
      // 判斷滾動方向並更新導航欄可見性
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // 向下滾動且已經滾動超過 100px，隱藏導航欄
        setNavigationVisible(false);
      } else {
        // 向上滾動或在頂部，顯示導航欄
        setNavigationVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    // 添加滾動監聽器
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 清理函數
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setNavigationVisible]);
  
  // 根據可見性狀態更新導航欄位置
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isNavigationVisible ? 0 : -100,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
  }, [isNavigationVisible]);

  // 根據當前章節決定使用哪個 logo
  // Reports/Innovations/Challenges 使用 light logo (預設)
  // Feedbacks/Event/Support 使用 dark logo
  const isDarkSection = currentSection === 'feedbacks' || currentSection === 'event' || currentSection === 'support';
  const logoSrc = isDarkSection ? '/assets/nav_logo--dark.svg' : '/assets/nav_logo--light.svg';

  return (
    <>
      {/* 導航外層容器：永遠顯示在最上層 */}
      <div
        id="main-navigation"
        ref={navRef}
        className="w-full fixed top-6 flex justify-center items-center z-[99] text-black"
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