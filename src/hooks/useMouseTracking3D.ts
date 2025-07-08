import { useOptimizedMouseTracking } from './useOptimizedMouseTracking';

interface Use3DMouseTrackingOptions {
  enabled: boolean;
  isLowPerformance?: boolean;
}

// 共用的 3D 滑鼠追蹤 Hook
export function useMouseTracking3D({ enabled, isLowPerformance = false }: Use3DMouseTrackingOptions) {
  // 使用統一的配置參數
  return useOptimizedMouseTracking({
    enabled,
    throttleMs: isLowPerformance ? 32 : 16,
    rangeMin: 47.5,
    rangeMax: 52.5
  });
}