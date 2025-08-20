'use client';


import { useEffect, useRef } from 'react';
import { useGlobalScrollMonitor } from '@/hooks/useGlobalScrollMonitor';
import { useGlobalPreloadStrategy } from '@/hooks/useGlobalPreloadStrategy';
import { useSupporterData } from '@/hooks/useSupporterData';

import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import OpeningSpline from '@/components/sections/opening/OpeningSpline';
import HeroSection from '@/components/sections/hero/HeroSection';
import ReportsSection from '@/components/sections/reports/ReportsSection';
import InnovationsSection from '@/components/sections/innovations/InnovationsSection';
import ChallengesSection from '@/components/sections/challenges/ChallengesSection';
import CallToActionSection from '@/components/sections/feedbacks/CallToActionSection';
import FooterSection from '@/components/sections/footer/FooterSection';




// 主頁面組件：報導者十週年回顧網站
export default function Home() {
  // DOM 元素參考：主要內容區域，用於背景顏色動畫
  const mainRef = useRef<HTMLElement>(null);

  // 啟用全域滾動監控
  useGlobalScrollMonitor();

  // 啟用全域預載策略
  const { preloadStats } = useGlobalPreloadStrategy();

  // 載入支持者數據
  useSupporterData();



  // 開發環境顯示預載統計
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[預載統計]', preloadStats);
    }
  }, [preloadStats]);



  // 禁用瀏覽器滾動恢復並強制回到頂部
  useEffect(() => {
    // 禁用瀏覽器的自動滾動恢復功能
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // 立即滾動到頂部（僅在初始化時）
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 多重保險：在不同時機確保滾動位置重置（但要避免與 Swiper 動畫衝突）
    const safeScrollToTop = () => {
      // 檢查是否有 Swiper 正在動畫
      if (!document.body.hasAttribute('data-swiper-animating')) {
        window.scrollTo(0, 0);
      }
    };

    const timers = [
      setTimeout(safeScrollToTop, 0),
      setTimeout(safeScrollToTop, 100),
      setTimeout(safeScrollToTop, 300),
    ];

    // 監聽頁面完全載入
    const handleLoad = () => {
      safeScrollToTop();
    };

    if (document.readyState !== 'complete') {
      window.addEventListener('load', handleLoad);
    } else {
      handleLoad();
    }

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []); // 空依賴，只在組件首次載入時執行

  // 初始化 GSAP 動畫套件和 ScrollTrigger 滾動觸發器
  useEffect(() => {
    // 非同步函數：動態載入和設定 GSAP
    const initScrollTrigger = async () => {
      // 檢查是否在瀏覽器環境中運行
      if (typeof window !== 'undefined') {
        // 動態導入 GSAP 核心套件
        const { gsap } = await import('gsap');
        // 動態導入 ScrollTrigger 滾動觸發器套件
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        // 註冊 ScrollTrigger 外掛程式
        gsap.registerPlugin(ScrollTrigger);

        // 設定背景顏色切換動畫
        const setupBackgroundAnimation = () => {
          const mainElement = mainRef.current;
          if (!mainElement) return;

          // 建立背景顏色切換觸發器：FeedbacksSection 區域
          ScrollTrigger.create({
            // 觸發元素：FeedbacksSection
            trigger: '#section-feedbacks',
            // 開始觸發點：章節頂部到達視窗 25% 處
            start: 'top 25%',
            // 結束觸發點：章節頂部到達視窗 100% 處
            end: 'top 100%',
            // 滾動時執行的動畫
            scrub: true,
            // 動畫更新回調
            onUpdate: (self) => {
              // 根據滾動進度計算背景色透明度
              const progress = self.progress;
              const colorProgress = 255 - progress * 255;
              // 設定背景色：從白色漸變到黑色，透明度始終為1
              gsap.set(mainElement, {
                backgroundColor: `rgb(${colorProgress}, ${colorProgress}, ${colorProgress})`
              });
            },
            // 動畫識別 ID
            id: 'main-background-animation'
          });
        };

        // 執行背景動畫設定
        setupBackgroundAnimation();

        // 延遲執行：等待所有組件完成渲染後刷新觸發器
        setTimeout(() => {
          // 重新計算所有滾動觸發點
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    // 執行初始化函數
    initScrollTrigger();

    // 清理函數：組件卸載時移除背景動畫觸發器
    return () => {
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getById('main-background-animation')?.kill();
        });
      }
    };
    // 空依賴陣列：只在組件首次載入時執行
  }, []);

  // 組件渲染輸出
  return (
    <div className="relative w-full">
      {/* OpeningSpline 移到最外層，確保最高層級 */}
      <OpeningSpline />

      {/* 主要內容區域：包含所有頁面章節，移除高度限制讓 sticky footer 生效 */}
      <main ref={mainRef} className="relative z-10 w-full min-h-screen transition-colors duration-300 bg-white">
        <HeroSection />
        <ReportsSection />
        <InnovationsSection />
        <ChallengesSection />
        <CallToActionSection />
      </main>

      {/* Sticky Footer：移到 main 外面，在頁面層級實作 */}
      <FooterSection />

      {/* 全域 UI 組件層：在所有內容之上 */}
      <Navigation />
      <Modal />
      <SectionNavigation />

    </div>
  );
}