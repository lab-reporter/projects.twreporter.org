'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useInnovationsAnimation } from '@/hooks/useInnovationsAnimation';
import SectionHeadings from '@/components/shared/SectionHeadings';
import { CurrentItemDisplay } from '@/components/shared';
import projectsData from '@/app/data/projects.json';
import InnovationVideoItem from './InnovationVideoItem';
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
  const { openModal, setNextSectionButtonVisible } = useStore();

  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：整個章節容器
  const sectionRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：3D 場景容器
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================
  // 本地狀態區塊
  // ============================
  // 狀態變數：當前活躍的項目索引
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  // 狀態變數：是否啟用 3D 透視效果
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  // 狀態變數：是否啟用滾動動畫
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

  // 滑鼠追蹤 3D 透視效果：動態調整透視原點
  useMouseTracking3D({
    // 啟用條件：3D 已啟用、章節可見且非低效能模式
    enabled: is3DEnabled && isVisible && !isLowPerformance,
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
  // Effects 區塊 - 漸進式載入
  // ============================
  // 分層載入策略：先啟用 3D，再啟用動畫
  useEffect(() => {
    if (!headingVisible) return;

    // 階段一：標題可見時立即啟用 3D 透視
    setIs3DEnabled(true);

    // 階段二：延遲啟用滾動動畫，確保流暢過渡
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, isLowPerformance ? 300 : 150);

    return () => {
      clearTimeout(timer);
    };
  }, [headingVisible, isLowPerformance]);

  // 標題淡出動畫
  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // 創建標題淡出動畫
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom', // 當滾動區域頂部觸及視窗底部開始
      end: 'top 20%', // 當滾動區域頂部到達視窗 20% 位置結束
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
  }, [headingRef]);

  // NextSectionButton 顯示控制
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // 創建 ScrollTrigger 來控制 NextSectionButton
    // 使用整個 500vh 的容器作為 trigger
    const buttonScrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom', // 當容器頂部進入視窗底部
      end: 'bottom 90%', // 當容器底部離開視窗頂部
      markers: true,
      onEnter: () => {
        // 進入 innovations 區域時顯示按鈕
        setNextSectionButtonVisible(true);
      },
      onLeave: () => {
        // 離開 innovations 區域時隱藏按鈕
        setNextSectionButtonVisible(false);
      },
      onEnterBack: () => {
        // 從下方回滾時重新顯示
        setNextSectionButtonVisible(true);
      },
      onLeaveBack: () => {
        // 向上滾動離開時隱藏
        setNextSectionButtonVisible(false);
      }
    });

    return () => {
      buttonScrollTrigger.kill();
    };
  }, [setNextSectionButtonVisible]);

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
  // 使用自訂 Hook 管理滾動動畫
  const handleActiveIndexChange = useCallback((index: number) => {
    setCurrentItemIndex(index);
  }, []);

  useInnovationsAnimation({
    sectionRef,
    containerRef,
    innovationItems,
    animationsEnabled,
    isLowPerformance,
    onActiveIndexChange: handleActiveIndexChange
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
    // 主容器：設定章節 ID 供滾動偵測使用
    <div ref={observerRef} id="section-innovations">
      {/* 章節標題區域：使用獨立 ref 提前觸發載入 */}
      <div ref={headingRef} className="sticky top-0 z-10">
        <SectionHeadings
          titleEn="INNOVATION"
          titleZh="開放新聞室・創新"
        >
          <p>
            《報導者》與時俱進，不斷創新說故事方式、突破敘事框架、翻新內容形式，讓文字、聲音、影像在開放協作中碰撞出新的可能。<br />
            點點物件，看10年來的新嘗試，你參與了多少呢？
          </p>
        </SectionHeadings>
      </div>

      {/* 滾動區域：設定足夠高度以提供滾動空間 */}
      <div ref={sectionRef} className="relative w-full h-[500vh]">
        {/* 黏性容器：在滾動時保持在視窗頂部 */}
        <div className="w-full h-screen sticky top-0">
          {/* 3D 場景容器：設定透視效果 */}
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              // 動態設定透視距離
              perspective: is3DEnabled && isVisible ? '1000px' : 'none'
              // perspectiveOrigin 由 useMouseTracking3D Hook 動態管理
            }}
          >
            {/* 3D 元素容器：保持 3D 轉換空間 */}
            <div
              className="absolute inset-0"
              style={{
                // 啟用 3D 變換樣式
                transformStyle: is3DEnabled && isVisible ? 'preserve-3d' : 'flat'
              }}
            >
              {/* 渲染所有創新項目 */}
              {innovationItems.map((item, index) => {
                // 預先計算每個項目的屬性
                const offset = getOffsetPosition(index);
                const initialDepth = -50 - (index * 100);

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

            {/* 當前項目資訊展示區：顯示活躍項目的標題資訊 */}
            <div className="absolute bottom-20 w-full">
              <CurrentItemDisplay
                title={currentItem?.title}
                subtitle={currentItem?.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}