import { useOptimizedMouseTracking } from './useOptimizedMouseTracking';

interface Use3DMouseTrackingOptions {
  enabled: boolean;
  isLowPerformance?: boolean;
  rangeMin?: number;
  rangeMax?: number;
}

// 共用的 3D 滑鼠追蹤 Hook
export function useMouseTracking3D({ enabled, isLowPerformance = false, rangeMin = 49, rangeMax = 51 }: Use3DMouseTrackingOptions) {
  // 使用統一的配置參數
  return useOptimizedMouseTracking({
    enabled,
    throttleMs: isLowPerformance ? 32 : 16,
    rangeMin,
    rangeMax
  });
}