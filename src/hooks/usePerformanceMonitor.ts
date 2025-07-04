import { useEffect, useState, useRef } from 'react';

interface PerformanceStats {
  fps: number;
  memoryUsage?: number; // MB
  isLowPerformance: boolean;
}

interface UsePerformanceMonitorOptions {
  // FPS 監控間隔（毫秒）
  monitorInterval?: number;
  // 低效能閾值（FPS）
  lowPerformanceThreshold?: number;
  // 是否啟用監控
  enabled?: boolean;
}

// 效能監控 Hook
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
) {
  const {
    monitorInterval = 1000,
    lowPerformanceThreshold = 30,
    enabled = true
  } = options;

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    isLowPerformance: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();

  // FPS 計算函數
  const calculateFPS = () => {
    frameCountRef.current++;
    
    rafRef.current = requestAnimationFrame(() => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      // 每隔指定時間更新一次 FPS
      if (delta >= monitorInterval) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        const isLowPerformance = fps < lowPerformanceThreshold;
        
        // 取得記憶體使用情況（如果瀏覽器支援）
        let memoryUsage: number | undefined;
        if ('memory' in performance) {
          const memory = (performance as { memory: { usedJSHeapSize: number } }).memory;
          memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        }
        
        setStats({
          fps,
          memoryUsage,
          isLowPerformance
        });
        
        // 重設計數器
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      if (enabled) {
        calculateFPS();
      }
    });
  };

  useEffect(() => {
    if (!enabled) return;

    calculateFPS();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, monitorInterval, lowPerformanceThreshold, calculateFPS]);

  return stats;
}