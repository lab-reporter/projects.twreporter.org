'use client';

import { useRef, useEffect, useState } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useInnovationsSwiper } from '@/hooks/useInnovationsSwiper';
import { useBreakpointOptimized } from '@/hooks/useBreakpointOptimized';
import SectionHeadings from '@/components/shared/SectionHeadings';
import { ItemDisplayWithNavigation } from '@/components/shared';
import projectsData from '@/app/data/projects.json';
import InnovationVideoItem from './InnovationVideoItem';
import InnovationsSwiperMobile from './InnovationsSwiperMobile';
import { getOffsetPosition } from './utils';
import type { InnovationItem } from './types';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// ============================
// 主要組件
// ============================
// 創新展示區組件：實現 3D 空間滾動效果
export default function InnovationsSection() {
  // ============================
  // 全域狀態區塊
  // ============================
  // 從 store 取得開啟 Modal 的函數
  const { openModal } = useStore();

  // ============================
  // 響應式斷點檢測
  // ============================
  const { isDesktop, isMobile, isClient } = useBreakpointOptimized();

  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：3D 場景容器
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================
  // 本地狀態區塊
  // ============================
  // 狀態變數：當前活躍的項目索引
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  // 狀態變數：是否啟用 3D 透視效果
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  // 狀態變數：是否啟用切換動畫
  const [animationsEnabled, setAnimationsEnabled] = useState(false);


  // ============================
  // 效能配置
  // ============================
  // 效能監控標記：低效能模式會停用部分視覺效果
  const isLowPerformance = false;

  // ============================
  // 自訂 Hooks 區塊
  // ============================
  // 標題區塊可見性偵測：提前觸發載入以避免延遲
  const { elementRef: headingRef, isVisible: headingVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px' // 提前觸發範圍
  });

  // 整體章節可見性偵測：控制 3D 效果啟用
  const { elementRef: observerRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // 滑鼠追蹤 3D 透視效果：動態調整透視原點（只在桌面版啟用）
  useMouseTracking3D({
    // 啟用條件：桌面版且 3D 已啟用、章節可見且非低效能模式
    enabled: isDesktop && is3DEnabled && isVisible && !isLowPerformance,
    isLowPerformance,
    targetRef: containerRef,
    cssProperty: 'perspectiveOrigin',
    rangeMin: 30,
    rangeMax: 70,
    useLerp: true,
    lerpFactor: 0.1
  });

  // 章節滾動觸發器：管理章節的活躍狀態
  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations',
    // 觸發時機：章節頂部到達視窗中央時開始
    start: "top 50%",
    // 結束時機：章節底部離開視窗上方時結束
    end: "bottom 20%",
    delay: 200
  });

  // ============================
  // 資料處理區塊
  // ============================
  // 從專案資料中篩選並排序創新項目
  const innovationItems = (projectsData as unknown as InnovationItem[])
    .filter((p: InnovationItem) => p.section && (Array.isArray(p.section) ? p.section.includes('innovation') : p.section === 'innovation'))
    .sort((a: InnovationItem, b: InnovationItem) => {
      const numA = parseInt(a.id.split('-')[1]);
      const numB = parseInt(b.id.split('-')[1]);
      return numA - numB;
    });

  // ============================
  // Effects 區塊 - 漸進式載入（只在桌面版啟用）
  // ============================
  // 分層載入策略：先啟用 3D，再啟用動畫
  useEffect(() => {
    if (!headingVisible || !isDesktop) return;

    // 階段一：標題可見時立即啟用 3D 透視（只在桌面版）
    setIs3DEnabled(true);

    // 階段二：延遲啟用滾動動畫，確保流暢過渡
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, isLowPerformance ? 300 : 150);

    return () => {
      clearTimeout(timer);
    };
  }, [headingVisible, isLowPerformance, isDesktop]);

  // 標題淡出動畫（只在桌面版啟用）
  useEffect(() => {
    if (!headingRef.current || !containerRef.current || !isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    // 創建標題淡出動畫
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%', // 當容器頂部觸及視窗 80% 位置開始
      end: 'top 25%', // 當容器頂部到達視窗 10% 位置結束
      scrub: 1, // 平滑過渡
      onUpdate: (self) => {
        // 根據滾動進度計算透明度（1 -> 0）
        const opacity = 1 - self.progress;
        gsap.set(headingRef.current, { opacity });
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [headingRef, containerRef, isDesktop]);

  // ============================
  // 事件處理函數
  // ============================
  // 處理項目點擊：開啟詳細資訊 Modal
  const handleItemClick = (item: InnovationItem) => {
    openModal(item.id, item);
  };

  // ============================
  // 動畫 Hook
  // ============================
  // 使用自訂 Hook 管理切換動畫（只在桌面版啟用）
  const { goToNext, goToPrevious } = useInnovationsSwiper({
    containerRef,
    innovationItems,
    animationsEnabled: animationsEnabled && isDesktop, // 只在桌面版啟用動畫
    isLowPerformance,
    currentIndex: currentItemIndex,
    onActiveIndexChange: setCurrentItemIndex
  });


  // ============================
  // 計算值區塊
  // ============================
  // 取得當前活躍的項目資料
  const currentItem = currentItemIndex >= 0 ? innovationItems[currentItemIndex] : null;




  // ============================
  // 渲染區塊
  // ============================
  return (
    // 主容器：設定章節 ID 供偵測使用
    <div ref={observerRef} id="section-innovations" className="relative py-40 lg:py-80">
      {/* 章節標題區域 */}
      <div ref={headingRef} className="relative py-12 z-10 flex flex-col justify-center items-center">
        <SectionHeadings titleEn="Innovation" titleZh="開放新聞室・創新">
          <p className="leading-relaxed">
            《報導者》與時俱進，不斷創新說故事方式、突破敘事框架、翻新內容形式，讓文字、聲音、影像在開放協作中碰撞出新的可能。
            點點物件，看10年來的新嘗試，你參與了多少呢？
          </p>
        </SectionHeadings>
      </div>

      {/* 桌面版：使用 3D 創新展示 */}
      {isClient && isDesktop && (
        <div className="relative w-full">
          {/* Swiper 容器 */}
          <div className="sticky z-[100] top-0 w-full mx-auto h-auto overflow-x-hidden">

            {/* 3D 場景容器 */}
            <div
              ref={containerRef}
              className="w-full max-w-[40rem] mx-auto aspect-[4/3] lg:h-full relative"
              style={{
                // 動態設定透視距離
                perspective: is3DEnabled && isVisible ? "500px" : "none",
                // perspectiveOrigin 由 useMouseTracking3D Hook 動態管理
              }}
            >
              {/* 3D 元素容器 */}
              <div
                className="absolute bottom-0 inset-0 h-[100%]"
                style={{
                  // 啟用 3D 變換樣式
                  transformStyle:
                    is3DEnabled && isVisible ? "preserve-3d" : "flat",
                }}
              >
                {/* 渲染所有創新項目 */}
                {innovationItems.map((item, index) => {
                  // 預先計算每個項目的屬性
                  const offset = getOffsetPosition(index);
                  const initialDepth = -50 - index * 100;

                  return (
                    <InnovationVideoItem
                      key={item.id}
                      item={item}
                      index={index}
                      isVisible={isVisible}
                      is3DEnabled={is3DEnabled}
                      animationsEnabled={animationsEnabled}
                      offset={offset}
                      initialDepth={initialDepth}
                      onItemClick={handleItemClick}
                    />
                  );
                })}
              </div>
            </div>

            {/* 當前項目資訊展示區 */}
            <div className="z-[100] mt-8 w-full flex justify-center items-center">
              <ItemDisplayWithNavigation
                title={currentItem?.title}
                subtitle={currentItem?.subtitle}
                onPrevious={goToPrevious}
                onNext={goToNext}
                previousLabel="上一個創新項目"
                nextLabel="下一個創新項目"
                currentItem={currentItem || undefined}
                onTitleClick={(item) => {
                  openModal(item.id as string, item);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 手機版：使用 Swiper.js 輪播 */}
      {isClient && isMobile && (
        <div className="w-full py-16">
          <InnovationsSwiperMobile />
        </div>
      )}

      {/* 載入中狀態：避免 SSR/CSR 不匹配 */}
      {!isClient && (
        <div className="relative w-full py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">載入中...</div>
          </div>
        </div>
      )}
    </div>
  );
}