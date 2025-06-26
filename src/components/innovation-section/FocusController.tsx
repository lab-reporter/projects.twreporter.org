/**
 * 聚焦邏輯控制系統
 * 
 * 根據滾動進度計算當前聚焦的 3D 模型
 */

'use client';

import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import type { ModelData, FocusConfig } from './types';
import { getAnimationConfig } from './ModelAnimator';

/**
 * 聚焦控制 Hook
 * 
 * @param visible Section 是否可見
 * @param progress 滾動進度 (0-1)
 * @param projects 項目列表
 * @param onFocusChange 聚焦變更回調
 * @param onProjectChange 項目變更回調
 * @returns 當前聚焦的項目
 */
export function useFocusController(
  visible: boolean,
  progress: number,
  projects: ModelData[],
  onFocusChange?: (item: ModelData | null) => void,
  onProjectChange?: (project: any) => void
) {
  const [focusedItem, setFocusedItem] = useState<ModelData | null>(null);
  const config = getAnimationConfig();

  useFrame(() => {
    if (!visible || projects.length === 0) return;

    const currentItem = calculateFocusedItem(progress, projects, config);
    
    if (currentItem && currentItem.id !== focusedItem?.id) {
      setFocusedItem(currentItem);
      onFocusChange?.(currentItem);
      onProjectChange?.(currentItem);
    } else if (!currentItem && focusedItem) {
      setFocusedItem(null);
      onFocusChange?.(null);
      onProjectChange?.(null);
    }
  });

  return focusedItem;
}

/**
 * 計算當前應該聚焦的項目
 * 
 * @param progress 滾動進度 (0-1)
 * @param projects 項目列表
 * @param config 聚焦配置
 * @returns 當前聚焦的項目，如果無則返回 null
 */
function calculateFocusedItem(
  progress: number,
  projects: ModelData[],
  config: FocusConfig
): ModelData | null {
  const { bufferStart, bufferEnd } = config;
  
  // 檢查是否在有效範圍內
  if (progress < bufferStart || progress > bufferEnd) {
    return null;
  }

  // 計算有效進度
  const effectiveProgress = (progress - bufferStart) / (bufferEnd - bufferStart);
  
  // 計算當前索引
  let currentIndex = Math.floor(effectiveProgress * projects.length);
  currentIndex = Math.min(currentIndex, projects.length - 1);
  
  return projects[currentIndex] || null;
}

/**
 * 檢查項目是否應該聚焦
 * 
 * @param item 項目
 * @param focusedItem 當前聚焦的項目
 * @param hoveredIndex 懸停的索引
 * @param itemIndex 項目索引
 * @returns 是否聚焦
 */
export function shouldItemBeFocused(
  item: ModelData,
  focusedItem: ModelData | null,
  hoveredIndex: number | null,
  itemIndex: number
): boolean {
  return focusedItem?.id === item.id || hoveredIndex === itemIndex;
} 