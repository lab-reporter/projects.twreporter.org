'use client';

import { useStore } from '@/stores';
import { useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import OpeningSection from '@/components/sections/opening/OpeningSection';
import ReportsSection from '@/components/sections/reports/ReportsSection';
import InnovationsSection from '@/components/sections/innovations/InnovationsSection';
import ChallengesSection from '@/components/sections/challenges/ChallengesSection';
import FeedbacksSection from '@/components/sections/feedbacks/FeedbacksSection';
import SupportSection from '@/components/sections/support/SupportSection';

// 主頁面組件：報導者十週年回顧網站
export default function Home() {
  // 從全域狀態取得目前頁面章節
  const { currentSection } = useStore();

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

        // 延遲執行：等待所有組件完成渲染後刷新觸發器
        // 等待時間
        setTimeout(() => {
          // 重新計算所有滾動觸發點
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    // 執行初始化函數
    initScrollTrigger();
    // 空依賴陣列：只在組件首次載入時執行
  }, []);

  // 組件渲染輸出
  return (
    <div className="relative w-full">
      {/* 載入畫面：網站初始化時顯示 */}
      <LoadingScreen />

      {/* 主要內容區域：包含所有頁面章節 */}
      <main className="relative w-full">
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
    </div>
  );
}