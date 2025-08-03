import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { InnovationItem } from '@/components/sections/innovations/types';
import { calculateOptimizedState, getOffsetPosition } from '@/components/sections/innovations/utils';

// ============================
// Hook 參數型別定義
// ============================
interface UseInnovationsAnimationParams {
  // DOM 元素參考
  sectionRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  // 項目資料
  innovationItems: InnovationItem[];
  // 動畫是否啟用
  animationsEnabled: boolean;
  // 效能模式
  isLowPerformance: boolean;
  // 當前活躍項目更新回調
  onActiveIndexChange: (index: number) => void;
}

// ============================
// 自訂 Hook：創新區塊滾動動畫
// ============================
// 管理創新區塊的 3D 空間滾動動畫效果
export function useInnovationsAnimation({
  sectionRef,
  containerRef,
  innovationItems,
  animationsEnabled,
  isLowPerformance,
  onActiveIndexChange
}: UseInnovationsAnimationParams) {
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
  // ScrollTrigger 動畫設定
  // ============================
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
          const state = calculateOptimizedState(currentDepth, isLowPerformance);

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
          onActiveIndexChange(activeIndex);
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
  }, [innovationItems, animationsEnabled, isLowPerformance, onActiveIndexChange, sectionRef, containerRef]);
}