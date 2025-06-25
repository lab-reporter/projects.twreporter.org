'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import LoadingScreen from '@/components/LoadingScreen';
import SectionTriggers from '@/components/SectionTriggers';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';

// 動態載入 3D 組件以避免 SSR 問題
const UnifiedScene = dynamic(() => import('@/components/UnifiedScene'), {
  ssr: false,
  loading: () => null // Canvas 內不能有 DOM 元素
});

export default function Home() {
  console.log('📱 主頁面渲染中，直接顯示主要內容');

  return (
    <div className="relative w-full">
      {/* 載入畫面 */}
      <LoadingScreen />

      {/* 主要內容容器 - 基於原始Combined3DScene架構 */}
      <div className="relative w-full">
        <SectionTriggers />
      </div>

      {/* UI 組件 */}
      <Modal />
      <SectionNavigation />
    </div>
  );
}
