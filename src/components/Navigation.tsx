'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Navigation = () => {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const nav = navRef.current;
    if (!nav) return;

    // 設定初始位置為畫面正中央
    gsap.set(nav, {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(1.5)',
    });

    // 創建 ScrollTrigger 動畫
    const trigger = ScrollTrigger.create({
      trigger: '#section-reports',
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1,
      markers: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // 使用 GSAP 的 interpolate 功能來平滑過渡
        const topProgress = gsap.utils.interpolate(50, 4, progress); // 從 50% 到 4%

        gsap.to(nav, {
          top: `${topProgress}%`,
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
        });
      },
      onLeave: () => {
        // 當滾動超過動畫區域時，確保停留在最終狀態
        gsap.to(nav, {
          top: '4%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onEnterBack: (self) => {
        // 往回滾動進入動畫區域時，根據當前進度設定狀態
        const progress = self.progress;
        const topProgress = gsap.utils.interpolate(50, 4, progress);

        gsap.to(nav, {
          top: `${topProgress}%`,
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        // 往回滾動離開動畫區域時，恢復到初始狀態
        gsap.to(nav, {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      id: 'navigation-position'
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <>
      {/* navigation 外層容器 - 永遠顯示 */}
      <div
        ref={navRef}
        className="w-full fixed flex justify-center items-center z-[9999] text-black"
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