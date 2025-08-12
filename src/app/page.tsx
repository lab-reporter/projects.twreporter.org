'use client';


import { useEffect, useRef } from 'react';
import { useGlobalScrollMonitor } from '@/hooks/useGlobalScrollMonitor';
import { useGlobalPreloadStrategy } from '@/hooks/useGlobalPreloadStrategy';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import OpeningSpline from '@/components/sections/opening/OpeningSpline';
import ReportsSection from '@/components/sections/reports/ReportsSection';
import InnovationsSection from '@/components/sections/innovations/InnovationsSection';
import ChallengesSection from '@/components/sections/challenges/ChallengesSection';
import FeedbacksSection from '@/components/sections/feedbacks/FeedbacksSection';
import EventSection from '@/components/sections/event/EventSection';



// 主頁面組件：報導者十週年回顧網站
export default function Home() {
  // DOM 元素參考：主要內容區域，用於背景顏色動畫
  const mainRef = useRef<HTMLElement>(null);

  // 啟用全域滾動監控
  useGlobalScrollMonitor();

  // 啟用全域預載策略
  const { preloadStats } = useGlobalPreloadStrategy();

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

    // 立即滾動到頂部
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 多重保險：在不同時機確保滾動位置重置
    const timers = [
      setTimeout(() => window.scrollTo(0, 0), 0),
      setTimeout(() => window.scrollTo(0, 0), 100),
      setTimeout(() => window.scrollTo(0, 0), 300),
    ];

    // 監聽頁面完全載入
    const handleLoad = () => {
      window.scrollTo(0, 0);
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
            // 開始觸發點：章節頂部到達視窗 90% 處
            start: 'top 70%',
            // 結束觸發點：章節頂部到達視窗 60% 處
            end: 'top 40%',
            // 滾動時執行的動畫
            scrub: true,
            // 動畫更新回調
            onUpdate: (self) => {
              // 根據滾動進度計算背景色透明度
              const progress = self.progress;
              // 設定背景色：從透明漸變到黑色
              gsap.set(mainElement, {
                backgroundColor: `rgba(0, 0, 0, ${progress})`
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

      {/* 主要內容區域：包含所有頁面章節 */}
      <main ref={mainRef} className="relative w-full transition-colors duration-300">
        <div className="w-full h-screen bg-white flex items-center justify-center">
          這裡是主視覺的佔位區塊
        </div>
        <ReportsSection />
        <InnovationsSection />
        <ChallengesSection />
        <FeedbacksSection />
        <EventSection />
        {/* <SupportSection /> */}
      </main>

      {/* 全域 UI 組件層：在所有內容之上 */}
      <Navigation />
      <Modal />
      <SectionNavigation />
    </div>
  );
}