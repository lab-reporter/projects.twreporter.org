import { useEffect, useState, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface UseOptimizedMouseTrackingOptions {
  // 是否啟用滑鼠追蹤
  enabled?: boolean;
  // 節流間隔（毫秒）
  throttleMs?: number;
  // 滑鼠位置映射範圍
  rangeMin?: number;
  rangeMax?: number;
}

// 優化的滑鼠追蹤 Hook，使用 RAF 節流
export function useOptimizedMouseTracking(
  options: UseOptimizedMouseTrackingOptions = {}
) {
  const {
    enabled = true,
    throttleMs = 16, // 約 60fps
    rangeMin = 40,
    rangeMax = 60
  } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // 使用 useCallback 避免重複創建函數
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    const now = performance.now();
    
    // 節流控制：確保不會過於頻繁更新
    if (now - lastUpdateRef.current < throttleMs) return;

    // 取消之前的 RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // 使用 RAF 確保在下一個渲染幀更新
    rafRef.current = requestAnimationFrame(() => {
      // 計算滑鼠位置的百分比 (0-100)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // 將範圍映射到指定區間
      const range = rangeMax - rangeMin;
      const mappedX = rangeMin + (x / 100) * range;
      const mappedY = rangeMin + (y / 100) * range;
      
      setMousePosition({ x: mappedX, y: mappedY });
      lastUpdateRef.current = now;
    });
  }, [enabled, throttleMs, rangeMin, rangeMax]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, enabled]);

  return mousePosition;
}