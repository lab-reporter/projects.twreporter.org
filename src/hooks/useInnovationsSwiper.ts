import { useEffect, useRef, RefObject, useCallback } from 'react';
import gsap from 'gsap';
import type { InnovationItem } from '@/components/sections/innovations/types';
import { getOffsetPosition } from '@/components/sections/innovations/utils';

// ============================
// Hook 參數型別定義
// ============================
interface UseInnovationsSwiperParams {
  // DOM 元素參考
  containerRef: RefObject<HTMLDivElement>;
  // 項目資料
  innovationItems: InnovationItem[];
  // 動畫是否啟用
  animationsEnabled: boolean;
  // 效能模式
  isLowPerformance: boolean;
  // 當前活躍項目
  currentIndex: number;
  // 當前活躍項目更新回調
  onActiveIndexChange: (index: number) => void;
}

// ============================
// 常數定義
// ============================
const Z_SPACING = 100; // z軸間距
const BLUR_BASE = 8; // 基礎模糊值

// ============================
// 自訂 Hook：創新區塊 Swiper 動畫
// ============================
export function useInnovationsSwiper({
  containerRef,
  innovationItems,
  animationsEnabled,
  isLowPerformance,
  currentIndex,
  onActiveIndexChange
}: UseInnovationsSwiperParams) {
  // ============================
  // 快取參考區塊
  // ============================
  // 預先快取 DOM 元素引用以提升效能
  const elementRefsCache = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // 儲存每個項目的當前狀態
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
  // 計算項目位置的輔助函數
  // ============================
  const getItemPosition = useCallback((itemIndex: number, centerIndex: number, totalItems: number) => {
    // 計算相對於當前中心的位置
    let relativePos = itemIndex - centerIndex;
    
    // 處理循環邏輯
    if (relativePos > totalItems / 2) {
      relativePos -= totalItems;
    } else if (relativePos < -totalItems / 2) {
      relativePos += totalItems;
    }
    
    return relativePos;
  }, []);

  // ============================
  // 計算項目狀態的函數
  // ============================
  const calculateItemState = useCallback((relativePosition: number, isLowPerformance: boolean) => {
    // 當前項目（位置 0）
    if (relativePosition === 0) {
      return {
        z: 0,
        opacity: 1,
        blur: 0,
        scale: 1,
        visibility: 'visible' as const
      };
    }
    
    // 背景項目（位置 1-4）
    if (relativePosition > 0 && relativePosition <= 4) {
      return {
        z: -relativePosition * Z_SPACING, // -100, -200, -300, -400
        opacity: 1 - (relativePosition * 0.15), // 保持較高透明度
        blur: isLowPerformance ? 0 : relativePosition * BLUR_BASE, // 8, 16, 24, 32
        scale: 1 - (relativePosition * 0.02), // 更細微的縮放
        visibility: 'visible' as const
      };
    }
    
    // 剛切換走的項目（位置 -1）
    if (relativePosition === -1) {
      return {
        z: 200,
        opacity: 0,
        blur: 0,
        scale: 1,
        visibility: 'hidden' as const
      };
    }
    
    // 其他不可見項目
    return {
      z: -500,
      opacity: 0,
      blur: 0,
      scale: 0.8,
      visibility: 'hidden' as const
    };
  }, []);

  // ============================
  // 切換動畫函數
  // ============================
  const animateToIndex = useCallback((targetIndex: number) => {
    if (!animationsEnabled || elementRefsCache.current.size === 0) return;
    
    const totalItems = innovationItems.length;
    
    // 更新所有項目的狀態
    innovationItems.forEach((item, index) => {
      const element = elementRefsCache.current.get(item.id);
      if (!element) return;
      
      // 計算相對位置
      const relativePos = getItemPosition(index, targetIndex, totalItems);
      
      // 計算目標狀態
      const state = calculateItemState(relativePos, isLowPerformance);
      
      // 取得前一個狀態
      const prevState = itemStatesRef.current.get(item.id);
      
      // 取得位置偏移（只有背景項目需要偏移）
      const offset = getOffsetPosition(index);
      const needsOffset = relativePos > 0 && relativePos <= 4;
      
      // 目標位置
      const targetX = needsOffset ? offset.x * 0.5 : 0; // 背景項目輕微偏移
      const targetY = needsOffset ? offset.y * 0.5 : 0;
      
      // 判斷是否需要特殊過渡效果
      const isMovingToFront = relativePos === 0 && prevState && prevState.z < 0;
      const isMovingToBack = relativePos === -1;
      
      // 執行動畫
      const animationConfig: gsap.TweenVars = {
        x: `${targetX}vw`,
        y: `${targetY}vh`,
        z: `${state.z}vw`,
        opacity: state.opacity,
        scale: state.scale,
        filter: isLowPerformance ? 'none' : `blur(${state.blur}px)`,
        duration: isMovingToBack ? 0.6 : 0.8,
        ease: isMovingToFront ? "power3.out" : "power2.inOut",
        transformOrigin: 'center center',
        rotationY: 0,
        rotationX: 0,
        onComplete: () => {
          // 動畫完成後設定可見性
          if (state.visibility === 'hidden') {
            gsap.set(element, { visibility: 'hidden', pointerEvents: 'none' });
          }
        },
        onStart: () => {
          // 動畫開始時確保元素可見
          if (state.visibility === 'visible') {
            gsap.set(element, { visibility: 'visible', pointerEvents: 'auto' });
          }
        }
      };
      
      // 如果是移動到背後，添加淡出效果
      if (isMovingToBack) {
        animationConfig.delay = 0;
        animationConfig.ease = "power2.in";
      }
      
      gsap.to(element, animationConfig);
      
      // 更新狀態快取
      itemStatesRef.current.set(item.id, {
        x: targetX,
        y: targetY,
        z: state.z,
        opacity: state.opacity,
        blur: state.blur,
        scale: state.scale,
        visibility: state.visibility
      });
    });
  }, [animationsEnabled, innovationItems, getItemPosition, calculateItemState, isLowPerformance]);

  // ============================
  // 初始化和快取管理
  // ============================
  useEffect(() => {
    if (!containerRef.current || !animationsEnabled) return;
    
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
    
    // 初始化所有項目的位置
    animateToIndex(currentIndex);
    
  }, [containerRef, animationsEnabled, innovationItems, currentIndex, animateToIndex]);

  // ============================
  // 公開的方法
  // ============================
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % innovationItems.length;
    onActiveIndexChange(nextIndex);
  }, [currentIndex, innovationItems.length, onActiveIndexChange]);
  
  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? innovationItems.length - 1 : currentIndex - 1;
    onActiveIndexChange(prevIndex);
  }, [currentIndex, innovationItems.length, onActiveIndexChange]);
  
  return {
    goToNext,
    goToPrevious
  };
}