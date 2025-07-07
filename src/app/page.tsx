'use client';

import { useStore } from '@/stores';
import { useEffect, useRef } from 'react';
import { useMainTimeline } from '@/hooks/useMainTimeline';
import { useGlobalScrollMonitor } from '@/hooks/useGlobalScrollMonitor';
import LoadingScreen from '@/components/LoadingScreen';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import NextSectionButton from '@/components/NextSectionButton';
import OpeningSection from '@/components/sections/opening/OpeningSection';
import ReportsSection from '@/components/sections/reports/ReportsSection';
import InnovationsSection from '@/components/sections/innovations/InnovationsSection';
import ChallengesSection from '@/components/sections/challenges/ChallengesSection';
import FeedbacksSection from '@/components/sections/feedbacks/FeedbacksSection';
import SupportSection from '@/components/sections/support/SupportSection';

// 主頁面組件：報導者十週年回顧網站
export default function Home() {
  // 從全域狀態取得目前頁面章節和載入狀態
  const { isLoading } = useStore();
  // DOM 元素參考：主要內容區域，用於背景顏色動畫
  const mainRef = useRef<HTMLElement>(null);
  // 主動畫時間軸
  const { startMainTimeline, cleanup } = useMainTimeline();
  // 防止重複觸發
  const animationTriggeredRef = useRef(false);
  
  // 啟用全域滾動監控
  useGlobalScrollMonitor();

  // 頁面載入時強制回到頂部
  useEffect(() => {
    // 立即滾動到頂部
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 額外保險：確保 DOM 渲染後再次滾動到頂部
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // 空依賴，只在組件首次載入時執行

  // 動畫期間禁止捲動的控制
  useEffect(() => {
    if (!isLoading && !animationTriggeredRef.current) {
      animationTriggeredRef.current = true;

      // 開始動畫前：禁止頁面捲動
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // 載入完成後延遲啟動動畫，確保所有組件已渲染
      const startTimer = setTimeout(() => {
        startMainTimeline();
      }, 1000); // 1秒延遲

      // 動畫結束後：恢復頁面捲動（總時間：1秒延遲 + 4.5秒動畫 = 5.5秒）
      const endTimer = setTimeout(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 5500); // 5.5秒後恢復捲動

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
        // 清理時也要恢復捲動
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isLoading, startMainTimeline]);

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
      cleanup(); // 清理主時間軸
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getById('main-background-animation')?.kill();
        });
      }
    };
    // 空依賴陣列：只在組件首次載入時執行
  }, [cleanup]);

  // 組件渲染輸出
  return (
    <div className="relative w-full">
      {/* 載入畫面：網站初始化時顯示 */}
      <LoadingScreen />

      {/* 主要內容區域：包含所有頁面章節 */}
      <main ref={mainRef} className="relative w-full transition-colors duration-300">
        <OpeningSection />
        <ReportsSection />
        <InnovationsSection />
        <ChallengesSection />
        <FeedbacksSection />
        <SupportSection />
      </main>

      {/* 全域 UI 組件層：在所有內容之上 */}
      <Navigation />
      <Modal />
      <SectionNavigation />
      <NextSectionButton />
    </div>
  );
}