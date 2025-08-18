import { useOptimizedMouseTracking } from './useOptimizedMouseTracking';
import { useBreakpoint } from './useBreakpoint';
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
  // 行動裝置控制選項（新增）
  disableOnMobile?: boolean;
  disableOnTablet?: boolean;
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
  cssProperty = 'perspectiveOrigin',
  disableOnMobile = true,   // 預設在手機上停用
  disableOnTablet = true    // 預設在平板上停用
}: Use3DMouseTrackingOptions) {
  // 獲取當前斷點來判斷裝置類型
  const breakpoint = useBreakpoint();

  // 判斷是否為行動裝置或平板
  const isMobile = breakpoint === 'base' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';

  // 根據裝置類型決定是否真正啟用
  const shouldEnable = enabled &&
    !(disableOnMobile && isMobile) &&
    !(disableOnTablet && isTablet);

  // DEBUG: 在開發環境中輸出裝置檢測結果
  if (process.env.NODE_ENV === 'development' && enabled) {
    const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';
    const statusText = shouldEnable ? '✅ 啟用' : '❌ 停用';
    console.log(`🎯 MouseTracking3D [${deviceType}]: ${statusText} (原始enabled: ${enabled})`);
  }

  // 使用統一的配置參數
  return useOptimizedMouseTracking({
    enabled: shouldEnable,
    throttleMs: isLowPerformance ? 32 : 16,
    rangeMin,
    rangeMax,
    useLerp,
    lerpFactor,
    targetRef,
    cssProperty
  });
}