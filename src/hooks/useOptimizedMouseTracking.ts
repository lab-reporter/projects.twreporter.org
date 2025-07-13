import { useEffect, useState, useCallback, useRef, MutableRefObject } from 'react';

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
  // 使用 lerp 平滑動畫（新增）
  useLerp?: boolean;
  // lerp 插值系數（0-1，越大越快）
  lerpFactor?: number;
  // 直接操作 DOM 元素（新增）
  targetRef?: MutableRefObject<HTMLElement | null>;
  // DOM 模式時要更新的 CSS 屬性
  cssProperty?: string;
}

// Linear interpolation helper
const lerp = (start: number, end: number, amount: number) => {
  return start + (end - start) * amount;
};

// 動畫 frame hook
const useAnimationFrame = (callback: (deltaTime: number) => void, enabled: boolean) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, enabled]);
};

// 優化的滑鼠追蹤 Hook，支援 lerp 平滑和 DOM 直接操作
export function useOptimizedMouseTracking(
  options: UseOptimizedMouseTrackingOptions = {}
) {
  const {
    enabled = true,
    throttleMs = 16, // 約 60fps
    rangeMin = 40,
    rangeMax = 60,
    useLerp = true,  // 預設啟用 lerp 平滑效果
    lerpFactor = 0.15,  // 0.15 提供良好的平滑度和響應性平衡
    targetRef,
    cssProperty = 'perspectiveOrigin'
  } = options;

  // State 模式的位置（用於返回值）
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  
  // 原始滑鼠位置（目標位置）
  const targetPosition = useRef({ x: 50, y: 50 });
  // 當前插值位置（平滑後的位置）
  const currentPosition = useRef({ x: 50, y: 50 });
  
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // 使用 lerp 的動畫循環
  useAnimationFrame(() => {
    if (!useLerp) return;

    // 使用 lerp 平滑插值
    currentPosition.current.x = lerp(
      currentPosition.current.x,
      targetPosition.current.x,
      lerpFactor
    );
    currentPosition.current.y = lerp(
      currentPosition.current.y,
      targetPosition.current.y,
      lerpFactor
    );

    // DOM 模式：直接更新元素樣式
    if (targetRef?.current) {
      if (cssProperty === 'perspectiveOrigin') {
        targetRef.current.style.perspectiveOrigin = 
          `${currentPosition.current.x}% ${currentPosition.current.y}%`;
      } else {
        targetRef.current.style.setProperty(cssProperty, 
          `${currentPosition.current.x}% ${currentPosition.current.y}%`);
      }
    } else {
      // State 模式：更新 state（但使用 RAF 限制頻率）
      const now = performance.now();
      if (now - lastUpdateRef.current > throttleMs) {
        setMousePosition({ 
          x: currentPosition.current.x, 
          y: currentPosition.current.y 
        });
        lastUpdateRef.current = now;
      }
    }
  }, enabled && useLerp);

  // 處理滑鼠移動
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    // 計算滑鼠位置的百分比 (0-100)
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    // 將範圍映射到指定區間
    const range = rangeMax - rangeMin;
    const mappedX = rangeMin + (x / 100) * range;
    const mappedY = rangeMin + (y / 100) * range;

    if (useLerp) {
      // Lerp 模式：只更新目標位置
      targetPosition.current = { x: mappedX, y: mappedY };
    } else {
      // 原始模式：使用節流直接更新
      const now = performance.now();
      
      if (now - lastUpdateRef.current < throttleMs) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        // DOM 模式
        if (targetRef?.current) {
          if (cssProperty === 'perspectiveOrigin') {
            targetRef.current.style.perspectiveOrigin = `${mappedX}% ${mappedY}%`;
          } else {
            targetRef.current.style.setProperty(cssProperty, `${mappedX}% ${mappedY}%`);
          }
        } else {
          // State 模式
          setMousePosition({ x: mappedX, y: mappedY });
        }
        
        lastUpdateRef.current = now;
        
        // DEBUG: 追蹤滑鼠位置更新
        if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
          console.log('📍 滑鼠位置更新:', {
            x: mappedX.toFixed(2),
            y: mappedY.toFixed(2),
            mode: targetRef ? 'DOM' : 'State',
            lerp: useLerp
          });
        }
      });
    }
  }, [enabled, throttleMs, rangeMin, rangeMax, useLerp, targetRef, cssProperty]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 useOptimizedMouseTracking 初始化:', {
        enabled,
        mode: targetRef ? 'DOM' : 'State',
        lerp: useLerp,
        lerpFactor
      });
    }

    if (!enabled) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, enabled, targetRef, useLerp, lerpFactor]);

  return mousePosition;
}