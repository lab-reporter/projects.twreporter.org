'use client';

import { useStore } from '@/stores';
import { useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import FontDemo from '@/components/shared/FontDemo';

// 2D Section 組件
import OpeningSection from '@/components/sections/opening/OpeningSection';
import ReportsSection from '@/components/sections/reports/ReportsSection';
import InnovationsSection from '@/components/sections/innovations/InnovationsSection';
import ChallengesSection from '@/components/sections/challenges/ChallengesSection';
import FeedbacksSection from '@/components/sections/feedbacks/FeedbacksSection';
import SupportSection from '@/components/sections/support/SupportSection';

export default function Home() {
  const { currentSection } = useStore();

  // 初始化 GSAP 和 ScrollTrigger
  useEffect(() => {
    const initScrollTrigger = async () => {
      if (typeof window !== 'undefined') {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(ScrollTrigger);

        // 延遲一點時間讓組件完全載入
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    initScrollTrigger();
  }, []);

  return (
    <div className="relative w-full">
      {/* 載入畫面 */}
      <LoadingScreen />

      {/* 主要內容 - 6 個 Section */}
      <main className="relative w-full">
        <OpeningSection />
        <ReportsSection />
        <InnovationsSection />
        <ChallengesSection />
        <FeedbacksSection />
        <SupportSection />
      </main>

      {/* UI 組件 */}
      <Navigation />
      <Modal />
      {/* SectionNavigation 永遠顯示，避免狀態依賴問題 */}
      <SectionNavigation />
    </div>
  );
}