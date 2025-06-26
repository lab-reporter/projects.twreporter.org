'use client';

import LoadingScreen from '@/components/LoadingScreen';
import SectionTriggers from '@/components/SectionTriggers';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';

export default function Home() {


  return (
    <div className="relative w-full">
      {/* 載入畫面 */}
      <LoadingScreen />

      {/* 主要內容容器 - 基於原始Combined3DScene架構 */}
      <div className="relative w-full">
        <SectionTriggers />
      </div>

      {/* UI 組件 */}
      <Navigation />
      <Modal />
      <SectionNavigation />
    </div>
  );
}
