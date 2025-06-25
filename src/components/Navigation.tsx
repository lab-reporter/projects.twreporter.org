'use client';

import { useEffect } from 'react';
import { useStore } from '@/stores';
import { useScrollManager } from '@/hooks/useScrollManager';

const Navigation = () => {
  const { modal, currentSection } = useStore();
  const { showNav, setShowNav } = useScrollManager();

  // 當 Modal 打開時，強制隱藏導航欄
  useEffect(() => {
    if (modal.isOpen) {
      setShowNav(false);
    }
  }, [modal.isOpen, setShowNav]);

  // 決定是否顯示導航欄：
  // 1. 在 Opening 區塊中時不顯示
  // 2. Modal 打開時不顯示
  // 3. 否則根據滾動狀態決定
  const isInOpeningSection = currentSection === 'opening';
  const shouldShowNav = !isInOpeningSection && showNav && !modal.isOpen;

  return (
    <>
      {/* navigation 外層容器 */}
      <div
        className="w-full fixed top-4 right-auto left-auto flex justify-center items-center z-[9999] text-black transition-transform duration-300 ease-in-out"
        style={{
          transform: shouldShowNav ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        {/* navigation 本體 */}
        <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
          {/* LOGO */}
          <img
            className="h-10 w-auto"
            src="/assets/nav_logo--light.svg"
            alt="Logo"
          />
        </div>
      </div>
    </>
  );
};

export default Navigation; 