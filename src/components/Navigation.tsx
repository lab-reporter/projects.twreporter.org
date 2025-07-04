'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 主導航組件
const Navigation = () => {
  // DOM 元素參考：用於動畫控制
  const navRef = useRef<HTMLDivElement>(null);

  // 副作用：設定導航位置動畫
  useEffect(() => {
    // 檢查是否在瀏覽器環境中運行
    if (typeof window === 'undefined') return;

    // 註冊 ScrollTrigger 外掛程式
    gsap.registerPlugin(ScrollTrigger);

    // 取得導航 DOM 元素
    const nav = navRef.current;
    if (!nav) return;

    // 使用 GSAP 設定導航位置動畫：從中央移動到頂部
    gsap.fromTo(nav,
      {
        // 起始狀態：位於螢幕中央
        top: '50%',
        left: '50%',
        scale: 1.5,
        xPercent: -50,
        yPercent: -50
      },
      {
        // 結束狀態：移動到頂部
        top: '3rem',
        left: '50%',
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        scrollTrigger: {
          // 觸發元素：reports 區塊
          trigger: '#section-reports',
          // 動畫開始時機
          start: 'top 80%',
          // 動畫結束時機
          end: 'top 50%',
          // 滾動同步程度
          scrub: 1,
          // markers: true,
          // 動畫識別 ID
          id: 'navigation-position'
        }
      }
    );

    // 清理函數：組件卸載時移除動畫
    return () => {
      ScrollTrigger.getById('navigation-position')?.kill();
    };
  }, []);

  return (
    <>
      {/* 導航外層容器：永遠顯示在最上層 */}
      <div
        ref={navRef}
        className="w-full fixed flex justify-center items-center z-[99] text-black"
      >
        {/* 導航內容容器 */}
        <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
          {/* 網站標誌 */}
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