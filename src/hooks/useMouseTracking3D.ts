import { useOptimizedMouseTracking } from './useOptimizedMouseTracking';
import { MutableRefObject } from 'react';

interface Use3DMouseTrackingOptions {
  enabled: boolean;
  isLowPerformance?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  // 新增 lerp 支援
  useLerp?: boolean;
  lerpFactor?: number;
  // DOM 模式支援
  targetRef?: MutableRefObject<HTMLElement | null>;
  cssProperty?: string;
}

// 共用的 3D 滑鼠追蹤 Hook
export function useMouseTracking3D({ 
  enabled, 
  isLowPerformance = false, 
  rangeMin = 49, 
  rangeMax = 51,
  useLerp = true,  // 預設啟用 lerp
  lerpFactor = 0.15,  // 稍微提高預設值，在平滑和響應性之間取得平衡
  targetRef,
  cssProperty = 'perspectiveOrigin'
}: Use3DMouseTrackingOptions) {
  // 使用統一的配置參數
  return useOptimizedMouseTracking({
    enabled,
    throttleMs: isLowPerformance ? 32 : 16,
    rangeMin,
    rangeMax,
    useLerp,
    lerpFactor,
    targetRef,
    cssProperty
  });
}