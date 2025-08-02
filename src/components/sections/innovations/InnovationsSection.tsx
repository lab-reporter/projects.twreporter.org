'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import SectionHeadings from '@/components/shared/SectionHeadings';
import { CurrentItemDisplay } from '@/components/shared';
import projectsData from '@/app/data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NextSectionButton from '@/components/NextSectionButton';
import InnovationVideoItem from './InnovationVideoItem';
import type { InnovationItem, ItemState } from './types';

// ============================
// 工具函數區塊
// ============================
// 動畫狀態配置：定義不同深度層級的視覺效果參數
const getAnimationStates = (isLowPerformance: boolean) => ({
  // 隱藏狀態：深度最遠，完全透明
  hidden: { depth: -400, opacity: 0, blur: isLowPerformance ? 0 : 0, scale: 1 },
  // 背景狀態：中等深度，半透明並模糊
  background: { depth: -200, opacity: 0.6, blur: isLowPerformance ? 0 : 8, scale: 1 },
  // 活躍狀態：零深度，完全清晰可見
  active: { depth: 0, opacity: 1, blur: 0, scale: 1 },
  // 前景狀態：正深度，透明並模糊
  foreground: { depth: 200, opacity: 0, blur: isLowPerformance ? 0 : 8, scale: 1 }
});

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
  // 快取參考區塊
  // ============================
  // 預先快取 DOM 元素引用以提升效能
  const elementRefsCache = useRef<Map<string, HTMLDivElement>>(new Map());

  // 儲存每個項目的動畫狀態，避免不必要的重新計算
  const itemStatesRef = useRef<Map<string, {
    x: number;
    y: number;
    z: number;
    opacity: number;
    blur: number;
    scale: number;
    visibility: string;
  }>>(new Map());

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

  // ============================
  // 事件處理函數
  // ============================
  // 處理項目點擊：開啟詳細資訊 Modal
  const handleItemClick = (item: InnovationItem) => {
    openModal(item.id, item);
  };

  // ============================
  // 計算函數區塊
  // ============================
  // 根據深度值計算項目的視覺狀態（透明度、模糊度等）
  const calculateOptimizedState = useCallback((currentDepth: number): ItemState => {
    const states = getAnimationStates(isLowPerformance);

    // 深度分層邏輯：根據不同深度範圍返回相應的視覺效果
    if (currentDepth < -300) {
      // 極深層：完全隱藏
      return states.hidden;
    } else if (currentDepth < -25) {
      // 背景層到活躍層的過渡：漸進式顯示
      const progress = (currentDepth + 300) / 275;
      return {
        depth: currentDepth,
        opacity: 0.6 + (progress * 0.4),
        blur: isLowPerformance ? 0 : 8 - (progress * 8),
        scale: 1
      };
    } else if (currentDepth < 25) {
      // 活躍層：完全清晰可見
      return {
        depth: currentDepth,
        opacity: 1,
        blur: 0,
        scale: 1
      };
    } else if (currentDepth < 50) {
      // 活躍層到前景層的過渡：漸進式隱藏
      const progress = (currentDepth - 25) / 25;
      return {
        depth: currentDepth,
        opacity: 1 - progress,
        blur: isLowPerformance ? 0 : progress * 8,
        scale: 1
      };
    } else {
      // 前景層：透明並模糊
      return {
        depth: currentDepth,
        opacity: 0,
        blur: isLowPerformance ? 0 : 8,
        scale: 1
      };
    }
  }, [isLowPerformance]);

  // 計算項目的錯位佈局位置（創造散落效果）
  const getOffsetPosition = (index: number) => {
    // 使用模數運算創造網格式錯位
    const offsetX = (index % 5 - 2) * 72;
    const offsetY = (Math.floor(index / 5) % 3 - 1) * 108;
    return { x: offsetX, y: offsetY };
  };

  // ============================
  // Effects 區塊 - ScrollTrigger 動畫
  // ============================
  // 設定 GSAP ScrollTrigger 來控制 3D 空間滾動動畫
  useEffect(() => {
    // 確保必要元素和狀態都已就緒
    if (!sectionRef.current || !containerRef.current || !animationsEnabled) return;

    // 註冊 ScrollTrigger 插件
    gsap.registerPlugin(ScrollTrigger);

    // 建立或更新 DOM 元素快取
    if (elementRefsCache.current.size !== innovationItems.length) {
      elementRefsCache.current.clear();
      innovationItems.forEach((item) => {
        const element = document.getElementById(`innovation-item-${item.id}`) as HTMLDivElement;
        if (element) {
          elementRefsCache.current.set(item.id, element);
        }
      });
    }

    // 取得所有快取的元素
    const elements = Array.from(elementRefsCache.current.values());

    // 批次設定所有項目的初始狀態
    elements.forEach((element, index) => {
      // 計算初始深度（項目間隔分佈）
      const initialDepth = -50 - (index * 100);
      // 取得錯位位置
      const offset = getOffsetPosition(index);
      // 判斷是否為第一個項目
      const isFirstItem = index === 0;
      const itemId = innovationItems[index]?.id;

      // 定義初始狀態物件
      const initialState = {
        x: isFirstItem ? 0 : offset.x,
        y: isFirstItem ? 0 : offset.y,
        z: initialDepth,
        scale: 1,
        opacity: initialDepth < -300 ? 0 : (isFirstItem ? 1 : 0.6),
        blur: 0,
        visibility: 'visible'
      };

      // 儲存初始狀態供後續動畫參考
      if (itemId) {
        itemStatesRef.current.set(itemId, initialState);
      }

      // 使用 GSAP 設定初始樣式
      gsap.set(element, {
        // 位置：第一個項目置中，其他項目根據錯位計算
        x: `${initialState.x}vw`,
        y: `${initialState.y}vh`,
        z: `${initialState.z}vw`,
        scale: initialState.scale,
        opacity: initialState.opacity,
        filter: isLowPerformance ? 'none' : `blur(${initialState.blur}px)`,
        rotationX: 0,
        rotationY: 0,
        transformOrigin: 'center center',
        willChange: 'transform, opacity'
      });
    });

    // 創建 ScrollTrigger 實例來控制滾動動畫
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      // 提前觸發以確保平滑過渡
      start: 'top-=200px top',
      end: 'bottom bottom',
      // 滾動平滑度設定
      scrub: isLowPerformance ? 1 : 2,
      onUpdate: (self) => {
        const progress = self.progress;
        const itemCount = elements.length;
        // 計算總移動距離，確保最後項目能停在活躍位置
        const totalDistance = (itemCount - 1) * 100 + 50;
        const currentOffset = progress * totalDistance;
        let activeIndex = -1;

        // 遍歷所有元素並更新其狀態
        elements.forEach((element, index) => {
          if (!element) return;

          const itemId = innovationItems[index]?.id;
          if (!itemId) return;

          // 取得上一次的狀態
          const prevState = itemStatesRef.current.get(itemId);
          if (!prevState) return;

          // 計算當前深度位置
          const isLastItem = index === elements.length - 1;
          let currentDepth = (-50 - index * 100) + currentOffset;

          // 特殊處理：最後項目鎖定在活躍狀態
          if (isLastItem && currentDepth > 0) {
            currentDepth = 0;
          }

          // 計算視覺狀態
          const state = calculateOptimizedState(currentDepth);

          // 判斷活躍項目
          if (currentDepth >= -25 && currentDepth <= 25) {
            activeIndex = index;
          }

          // 計算位置偏移
          const offset = getOffsetPosition(index);
          const isFirstItem = index === 0;
          let offsetFactor = 1;

          // 位置過渡邏輯：從錯位到集中
          if (isFirstItem) {
            // 第一個項目始終在中央
            offsetFactor = 0;
          } else {
            // 其他項目根據深度漸進過渡
            if (currentDepth >= -300 && currentDepth <= -25) {
              const transitionProgress = (currentDepth + 300) / 275;
              offsetFactor = 1 - transitionProgress;
            } else if (currentDepth > -25) {
              offsetFactor = 0;
            }
          }

          // 計算目標位置
          const targetX = offset.x * offsetFactor;
          const targetY = offset.y * offsetFactor;
          const targetZ = currentDepth;

          // 效能優化：使用閾值檢查避免不必要的更新
          const positionChanged =
            Math.abs(prevState.x - targetX) > 0.1 ||
            Math.abs(prevState.y - targetY) > 0.1 ||
            Math.abs(prevState.z - targetZ) > 1;

          const opacityChanged = Math.abs(prevState.opacity - state.opacity) > 0.01;
          const scaleChanged = Math.abs(prevState.scale - state.scale) > 0.01;
          const blurChanged = Math.abs(prevState.blur - state.blur) > 0.5;

          // 批次更新變化的屬性
          if (positionChanged || opacityChanged || scaleChanged || blurChanged) {
            const updateObj: gsap.TweenVars = {};

            // 更新位置
            if (positionChanged) {
              updateObj.x = `${targetX}vw`;
              updateObj.y = `${targetY}vh`;
              updateObj.z = `${targetZ}vw`;
              prevState.x = targetX;
              prevState.y = targetY;
              prevState.z = targetZ;
            }

            // 更新透明度
            if (opacityChanged) {
              updateObj.opacity = state.opacity;
              prevState.opacity = state.opacity;
            }

            // 更新縮放
            if (scaleChanged) {
              updateObj.scale = state.scale;
              prevState.scale = state.scale;
            }

            // 更新模糊效果（使用較長過渡時間）
            if (blurChanged && !isLowPerformance) {
              updateObj.filter = `blur(${state.blur}px)`;
              prevState.blur = state.blur;
              updateObj.duration = 0.6;
            } else if (Object.keys(updateObj).length > 0) {
              updateObj.duration = 0.3;
            }

            // 執行動畫更新
            if (Object.keys(updateObj).length > 0) {
              updateObj.ease = "power2.out";
              updateObj.overwrite = 'auto';
              gsap.to(element, updateObj);
            }
          }

          // 可見性最佳化：隱藏完全透明的元素
          const newVisibility = state.opacity < 0.05 ? 'hidden' : 'visible';
          if (prevState.visibility !== newVisibility) {
            gsap.set(element, {
              visibility: newVisibility,
              pointerEvents: newVisibility === 'hidden' ? 'none' : 'auto'
            });
            prevState.visibility = newVisibility;
          }
        });

        // 更新當前活躍項目索引
        if (activeIndex >= 0) {
          setCurrentItemIndex(activeIndex);
        }
      },
    });

    // 保存快取引用供清理使用
    const cacheRef = elementRefsCache.current;

    // 清理函數：移除 ScrollTrigger 並清空快取
    return () => {
      scrollTrigger.kill();
      cacheRef.clear();
    };
  }, [innovationItems, animationsEnabled, calculateOptimizedState, isLowPerformance]);

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
      <div ref={headingRef}>
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
          {/* 下一章節按鈕 */}
          <NextSectionButton />
        </div>
      </div>
    </div>
  );
}