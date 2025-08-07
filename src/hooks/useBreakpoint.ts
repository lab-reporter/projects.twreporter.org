'use client';

import { useState, useEffect } from 'react';

// 與 Tailwind 一致的斷點
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointWithBase = Breakpoint | 'base';

/**
 * Hook 用於偵測當前視窗的斷點
 * @returns 當前斷點名稱 ('base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 */
export function useBreakpoint(): BreakpointWithBase {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointWithBase>('base');

  useEffect(() => {
    const getBreakpoint = (): BreakpointWithBase => {
      const width = window.innerWidth;
      
      // 從大到小檢查
      if (width >= BREAKPOINTS['2xl']) return '2xl';
      if (width >= BREAKPOINTS.xl) return 'xl';
      if (width >= BREAKPOINTS.lg) return 'lg';
      if (width >= BREAKPOINTS.md) return 'md';
      if (width >= BREAKPOINTS.sm) return 'sm';
      return 'base';
    };

    const handleResize = () => {
      setCurrentBreakpoint(getBreakpoint());
    };

    // 初始化
    handleResize();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return currentBreakpoint;
}