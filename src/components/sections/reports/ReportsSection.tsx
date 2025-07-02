'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';

// 影響力報導章節主組件
export default function ReportsSection() {
  // DOM 元素參考：用於控制章節標題的動畫效果
  const sectionHeadingRef = useRef<HTMLDivElement>(null);

  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-reports',
    // 頁面名稱識別
    sectionName: 'reports'
  });

  // 副作用：設定章節標題的淡入動畫
  useEffect(() => {
    // 檢查是否在瀏覽器環境中運行
    if (typeof window === 'undefined') return;

    // 註冊 ScrollTrigger 外掛程式
    gsap.registerPlugin(ScrollTrigger);

    // 取得章節標題的 DOM 元素
    const sectionHeading = sectionHeadingRef.current;
    if (!sectionHeading) return;

    // 設定標題淡入動畫：從透明到不透明
    gsap.fromTo(sectionHeading,
      {
        // 起始狀態：完全透明
        opacity: 0
      },
      {
        // 結束狀態：完全不透明
        opacity: 1,
        scrollTrigger: {
          // 觸發元素：章節標題本身
          trigger: sectionHeading,
          // 動畫開始時機：元素頂部到達視窗頂部
          start: 'top 0%',
          // 動畫結束時機：向下滾動一定距離後
          end: '+=100',
          // 開發時顯示標記
          markers: true,
          // 與滾動同步的動畫
          scrub: true,
          // 動畫識別 ID
          id: 'reports-section-heading-fade-in'
        }
      }
    );

    // 清理函數：組件卸載時移除動畫
    return () => {
      ScrollTrigger.getById('reports-section-heading-fade-in')?.kill();
    };
  }, []);

  return (
    // 主要報導章節區塊
    <section
      // 頁面錨點 ID
      id="section-reports"
      className="relative w-full h-auto text-black flex flex-col items-center justify-center"
    >
      {/* 章節標題區域：綁定 ref 用於動畫控制 */}
      <div ref={sectionHeadingRef}>
        <SectionHeadings
          titleEn="IMPACT"
          titleZh="深度報導・影響力"
        >
          <p>
            「深度報導並不朝生暮死，它們帶著應該被聽見的聲音，持續發聲。」<br />
            《報導者》許多報導因為讀者的迴響，具體改變了政策與受訪者處境。
            點開報導，你將看見這些改變如何發生。
          </p>
        </SectionHeadings>
      </div>

      {/* 報導輪播區域：展示各篇影響力報導 */}
      <div className="w-full">
        <ReportsSwiper />
      </div>
    </section>
  );
}