import type { BreakpointWithBase } from '@/hooks/useBreakpoint';

// 響應式值類型定義
export type ResponsiveValue<T> = T | Partial<Record<BreakpointWithBase, T>>;

// 響應式配置介面
export interface ResponsiveConfig<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

/**
 * 根據當前斷點取得對應的響應式值
 * @param value 響應式值（可以是單一值或包含多個斷點的物件）
 * @param breakpoint 當前斷點
 * @returns 當前斷點對應的值
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: BreakpointWithBase
): T {
  // 如果是單一值（非物件），直接返回
  if (value === null || value === undefined || typeof value !== 'object') {
    return value as T;
  }

  // 類型守衛：檢查是否為響應式配置物件
  const isResponsiveConfig = (v: unknown): v is ResponsiveConfig<T> => {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
  };

  if (!isResponsiveConfig(value)) {
    return value as T;
  }

  // 斷點優先順序（從小到大）
  const breakpointOrder: BreakpointWithBase[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  // 從當前斷點往下找，找到第一個有定義的值
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in value && value[bp] !== undefined) {
      return value[bp] as T;
    }
  }

  // 如果都沒有找到，返回第一個有定義的值
  const firstDefinedValue = breakpointOrder
    .map(bp => value[bp])
    .find(val => val !== undefined);
  
  return firstDefinedValue as T;
}

/**
 * 檢查某個值是否為響應式配置
 */
export function isResponsiveValue<T>(value: unknown): value is ResponsiveConfig<T> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  const validKeys = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  const keys = Object.keys(value as Record<string, unknown>);
  
  return keys.length > 0 && keys.every(key => validKeys.includes(key));
}