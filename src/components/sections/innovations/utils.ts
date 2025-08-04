import type { ItemState } from './types';

// ============================
// 動畫狀態配置
// ============================
// 動畫狀態配置：定義不同深度層級的視覺效果參數
export const getAnimationStates = (isLowPerformance: boolean) => ({
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
// 位置計算函數
// ============================
// 計算項目的錯位佈局位置（創造散落效果）
export const getOffsetPosition = (index: number) => {
  // 使用模數運算創造網格式錯位
  const offsetX = (index % 5 - 2) * 36;
  const offsetY = (Math.floor(index / 5) % 3 - 1) * 54;
  return { x: offsetX, y: offsetY };
};

// ============================
// 動畫狀態計算
// ============================
// 根據深度值計算項目的視覺狀態（透明度、模糊度等）
export const calculateOptimizedState = (currentDepth: number, isLowPerformance: boolean): ItemState => {

  // 深度分層邏輯：根據不同深度範圍返回相應的視覺效果
  if (currentDepth < -300) {
    // 極深層：完全隱藏
    return {
      depth: currentDepth,
      opacity: 0,
      blur: isLowPerformance ? 0 : 32,
      scale: 1
    };
  } else if (currentDepth < -25) {
    // 背景層到活躍層的過渡：漸進式顯示
    const progress = (currentDepth + 300) / 275;
    return {
      depth: currentDepth,
      opacity: 0.6 + (progress * 0.4),
      blur: isLowPerformance ? 0 : 32 - (progress * 32),
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
      blur: isLowPerformance ? 0 : progress * 32,
      scale: 1
    };
  } else {
    // 前景層：透明並模糊
    return {
      depth: currentDepth,
      opacity: 0,
      blur: isLowPerformance ? 0 : 32,
      scale: 1
    };
  }
};