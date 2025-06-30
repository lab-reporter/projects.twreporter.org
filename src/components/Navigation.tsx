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

    // 使用 gsap.fromTo 的精簡寫法 - 導航位置從中央移動到頂部
    gsap.fromTo(nav,
      {
        top: '50%',
        left: '50%',
        scale: 1.5,
        xPercent: -50,
        yPercent: -50
      },
      {
        top: '3rem',
        left: '50%',
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        scrollTrigger: {
          trigger: '#section-reports',
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
          markers: true,
          id: 'navigation-position'
        }
      }
    );

    return () => {
      ScrollTrigger.getById('navigation-position')?.kill();
    };
  }, []);

  return (
    <>
      {/* navigation 外層容器 - 永遠顯示 */}
      <div
        ref={navRef}
        className="w-full fixed flex justify-center items-center z-[99] text-black"
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