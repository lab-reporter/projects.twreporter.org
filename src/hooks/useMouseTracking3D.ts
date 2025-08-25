import { useBreakpoint } from './useBreakpoint';
import { MutableRefObject, useEffect, useRef, useCallback } from 'react';

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

  // 滑鼠位置狀態
  const mouseRef = useRef({ x: 50, y: 50 });
  const targetRef2 = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number>(0);

  // 節流的滑鼠移動處理函數
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!shouldEnable || !targetRef?.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 限制在指定範圍內
    mouseRef.current.x = Math.max(rangeMin, Math.min(rangeMax, x));
    mouseRef.current.y = Math.max(rangeMin, Math.min(rangeMax, y));
  }, [shouldEnable, rangeMin, rangeMax, targetRef]);

  // 動畫循環
  const animate = useCallback(() => {
    if (!shouldEnable || !targetRef?.current) return;

    if (useLerp) {
      // 使用 lerp 進行平滑過渡
      targetRef2.current.x += (mouseRef.current.x - targetRef2.current.x) * lerpFactor;
      targetRef2.current.y += (mouseRef.current.y - targetRef2.current.y) * lerpFactor;
    } else {
      targetRef2.current.x = mouseRef.current.x;
      targetRef2.current.y = mouseRef.current.y;
    }

    // 更新 CSS 屬性
    if (targetRef.current) {
      (targetRef.current.style as unknown as Record<string, string>)[cssProperty] = `${targetRef2.current.x}% ${targetRef2.current.y}%`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [shouldEnable, useLerp, lerpFactor, cssProperty, targetRef]);

  useEffect(() => {
    if (!shouldEnable) return;

    // DEBUG: 在開發環境中輸出裝置檢測結果
    if (process.env.NODE_ENV === 'development') {
      const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';
      console.log(`🎯 MouseTracking3D [${deviceType}]: ✅ 啟用`);
    }

    // 添加事件監聽器
    const throttleMs = isLowPerformance ? 32 : 16;
    let lastTime = 0;

    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= throttleMs) {
        handleMouseMove(e);
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);

    // 開始動畫循環
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldEnable, handleMouseMove, animate, isLowPerformance, isMobile, isTablet]);

  // 回傳滑鼠位置（兼容性）
  return {
    x: targetRef2.current.x,
    y: targetRef2.current.y
  };
}