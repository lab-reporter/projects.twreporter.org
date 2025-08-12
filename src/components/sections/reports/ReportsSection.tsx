'use client';

import { useEffect, useRef } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';
import { useStore } from '@/stores';
import gsap from 'gsap';

// 影響力報導章節主組件
export default function ReportsSection() {
  const sectionHeadingRef = useRef<HTMLDivElement>(null);
  const isOpeningComplete = useStore((state) => state.isOpeningComplete);

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

  // 開場動畫完成後的淡入效果
  useEffect(() => {
    if (!isOpeningComplete || !sectionHeadingRef.current) return;

    // 設定初始狀態
    gsap.set(sectionHeadingRef.current, {
      opacity: 0,
      y: '20%'
    });

    // 動畫到最終狀態
    gsap.to(sectionHeadingRef.current, {
      opacity: 1,
      y: '0%',
      duration: 2,
      ease: 'power4.Out'
    });
  }, [isOpeningComplete]);

  return (
    // 主要報導章節區塊
    <section
      // 頁面錨點 ID
      id="section-reports"
      className="relative w-full h-auto text-black flex flex-col items-center justify-center"
    >
      {/* 章節標題區域 */}
      <div
        ref={sectionHeadingRef}
        id="reports-section-heading"
        className="sticky top-0 left-0 w-full h-screen"
        style={{
          opacity: isOpeningComplete ? undefined : 0,
          transform: isOpeningComplete ? undefined : 'translateY(100%)'
        }}
      >
        <SectionHeadings
          titleEn="IMPACT"
          titleZh="深度報導・影響力"
        >
          <p>
            「深度報導並不朝生暮死，它們帶著應該被聽見的聲音，持續發聲。」<br />
            《報導者》許多報導因為讀者的迴響，具體改變了政策與受訪者處境。
            點開報導，你將看見這些改變如何發生。
          </p>
          <div className="flex flex-col items-center justify-center mt-4 gap-2 mx-auto">
            <div className="w-[1px] h-16 bg-gray-600"></div>
            <h6 className="text-base text-gray-600 inline-block rounded-sm">
              Scroll to Explore
            </h6>
          </div>
        </SectionHeadings>
      </div>

      {/* 報導輪播區域：展示各篇影響力報導 */}
      <div className="mt-[-100vh] w-full relative h-[calc(100vh+400px)]">
        <div className="sticky top-0 left-0 w-full h-screen">
          <ReportsSwiper />
        </div>
      </div>
    </section>
  );
}