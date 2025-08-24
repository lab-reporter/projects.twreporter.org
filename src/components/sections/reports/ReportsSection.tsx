'use client';

import { useRef } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useBreakpointOptimized } from '@/hooks/useBreakpointOptimized';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';
import ReportsSwiperMobile from './ReportsSwiperMobile';

// 影響力報導章節主組件
export default function ReportsSection() {
  const sectionHeadingRef = useRef<HTMLDivElement>(null);

  // ============================
  // 響應式斷點檢測
  // ============================
  const { isDesktop, isMobile, isClient } = useBreakpointOptimized();

  // 使用滾動觸發器來監控當前頁面位置
  // 調整觸發參數以適應動畫完成後的滾動檢測
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-reports',
    // 頁面名稱識別
    sectionName: 'reports',
    // 當章節頂部進入視窗 90% 位置時觸發（更早觸發）
    start: "top 90%",
    // 當章節底部離開視窗 20% 處時結束（給更多空間避免過早切換）
    end: "bottom 20%",
    // 減少延遲，確保動畫完成後立即生效
    delay: 100
  });

  // 移除自動淡入效果，改由 useReportsAnimation 統一管理
  // 動畫現在完全由滾動控制

  return (
    // 主要報導章節區塊
    <section
      // 頁面錨點 ID
      id="section-reports"
      className="relative py-40 lg:py-0 w-full h-auto text-black flex flex-col items-center justify-center"
    >
      {/* 章節標題區域 */}
      <div
        ref={sectionHeadingRef}
        id="reports-section-heading"
        className="relative py-12 lg:sticky lg:top-0 lg:left-0 w-full"
      >
        <div className="w-full lg:h-screen flex flex-col items-center justify-center">
          <SectionHeadings
            titleEn="Impact"
            titleZh="深度報導・影響力"
          >
            <p className="leading-relaxed">
              「深度報導並不朝生暮死，它們帶著應該被聽見的聲音，持續發聲。」
              《報導者》許多報導因為讀者的迴響，具體改變了政策與受訪者處境。
              點開報導，你將看見這些改變如何發生。
            </p>
          </SectionHeadings>
        </div>
      </div>

      {/* 報導輪播區域：展示各篇影響力報導 */}
      {/* 桌面版：使用 3D 輪播 */}
      {isClient && isDesktop && (
        <div className="mt-[-100vh] w-full relative h-[calc(100vh+400px)]">
          <div className="sticky top-0 left-0 w-full h-screen">
            <ReportsSwiper />
          </div>
        </div>
      )}

      {/* 手機版：使用 Swiper.js 卡片輪播 */}
      {isClient && isMobile && (
        <ReportsSwiperMobile />
      )}

      {/* 載入中狀態：避免 SSR/CSR 不匹配 */}
      {/* {!isClient && (
        <div className="mt-[-100vh] w-full relative h-[calc(100vh+400px)]">
          <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
            <div className="text-gray-500">載入中...</div>
          </div>
        </div>
      )} */}
    </section>
  );
}