'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMediaPreloader, LoadPriority } from './useMediaPreloader';
import { useNetworkStatus } from './useNetworkStatus';

interface InnovationItem {
  id: string;
  src: string;
  title: string;
  [key: string]: unknown;
}

interface UseInnovationsPreloaderOptions {
  items: InnovationItem[];
  isVisible: boolean;
  is3DEnabled: boolean;
  enabled?: boolean;
}

export function useInnovationsPreloader({
  items,
  isVisible,
  is3DEnabled,
  enabled = true
}: UseInnovationsPreloaderOptions) {
  const { preloadMedia, isLoaded, getStats } = useMediaPreloader({
    maxConcurrent: 4,
    enableLogging: process.env.NODE_ENV === 'development'
  });
  
  const { preloadConfig, isSlowConnection, isLowEndDevice } = useNetworkStatus();
  const loadedItemsRef = useRef<Set<number>>(new Set([0])); // 預設載入第一個
  const phaseRef = useRef<'initial' | 'core' | 'complete'>('initial');

  // 分階段載入策略
  const performPhaseLoadStrategy = useCallback(() => {
    if (!enabled || !isVisible) return;
    
    const currentPhase = phaseRef.current;
    console.log(`[InnovationsPreloader] 當前載入階段: ${currentPhase}`);
    
    if (currentPhase === 'initial' && is3DEnabled) {
      // 第一階段：載入核心項目（前 3 個）
      const coreItems = items.slice(0, 3).map(item => ({
        url: item.src,
        type: 'video' as const,
        priority: LoadPriority.CRITICAL,
        preloadType: isSlowConnection() ? 'metadata' as const : 'auto' as const
      }));
      
      preloadMedia(coreItems);
      loadedItemsRef.current = new Set([0, 1, 2]);
      phaseRef.current = 'core';
      
      // 延遲載入第二階段
      setTimeout(() => {
        performPhaseLoadStrategy();
      }, 2000);
      
    } else if (currentPhase === 'core') {
      // 第二階段：載入中間項目（4-6）
      const middleItems = items.slice(3, 6).map(item => ({
        url: item.src,
        type: 'video' as const,
        priority: LoadPriority.HIGH,
        preloadType: ('metadata' as const)
      }));
      
      preloadMedia(middleItems);
      loadedItemsRef.current = new Set([0, 1, 2, 3, 4, 5]);
      phaseRef.current = 'complete';
      
      // 延遲載入第三階段
      setTimeout(() => {
        performPhaseLoadStrategy();
      }, 3000);
      
    } else if (currentPhase === 'complete') {
      // 第三階段：載入剩餘項目
      const remainingItems = items.slice(6).map(item => ({
        url: item.src,
        type: 'video' as const,
        priority: LoadPriority.MEDIUM,
        preloadType: ('metadata' as const)
      }));
      
      if (!isLowEndDevice()) {
        preloadMedia(remainingItems);
        const allIndices = Array.from({ length: items.length }, (_, i) => i);
        loadedItemsRef.current = new Set(allIndices);
      }
    }
  }, [enabled, isVisible, is3DEnabled, items, isSlowConnection, isLowEndDevice, preloadMedia]);

  // 預載特定項目的詳細內容（hover 時觸發）
  const preloadItemDetails = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    console.log(`[InnovationsPreloader] 預載項目詳細內容: ${item.title}`);
    
    // 改變預載類型為 auto，載入完整影片
    preloadMedia([{
      url: item.src,
      type: 'video',
      priority: LoadPriority.HIGH,
      preloadType: 'auto' as const
    }]);
  }, [items, preloadMedia]);

  // 根據滑鼠位置預載可能被點擊的項目
  const preloadByProximity = useCallback((nearbyItemIds: string[]) => {
    if (!enabled || isSlowConnection()) return;
    
    const itemsToPreload = nearbyItemIds
      .map(id => items.find(item => item.id === id))
      .filter(Boolean)
      .slice(0, 2) // 最多預載 2 個
      .map(item => ({
        url: item!.src,
        type: 'video' as const,
        priority: LoadPriority.MEDIUM,
        preloadType: 'metadata' as 'metadata'
      }));
    
    if (itemsToPreload.length > 0) {
      preloadMedia(itemsToPreload);
    }
  }, [enabled, items, isSlowConnection, preloadMedia]);

  // 初始載入
  useEffect(() => {
    if (enabled && isVisible) {
      performPhaseLoadStrategy();
    }
  }, [enabled, isVisible, performPhaseLoadStrategy]);

  // 3D 啟用時的載入
  useEffect(() => {
    if (is3DEnabled && phaseRef.current === 'initial') {
      performPhaseLoadStrategy();
    }
  }, [is3DEnabled, performPhaseLoadStrategy]);

  // 提供載入狀態檢查
  const checkItemLoaded = useCallback((src: string): boolean => {
    return isLoaded(src);
  }, [isLoaded]);

  // 取得載入進度
  const getLoadProgress = useCallback((): number => {
    const stats = getStats();
    const total = items.length;
    const loaded = stats.loaded;
    return Math.min((loaded / total) * 100, 100);
  }, [getStats, items.length]);

  // 開發環境日誌
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const stats = getStats();
      const progress = getLoadProgress();
      console.log(`[InnovationsPreloader] 載入進度: ${progress.toFixed(1)}%`, stats);
    }
  }, [getStats, getLoadProgress, is3DEnabled]);

  return {
    preloadItemDetails,
    preloadByProximity,
    checkItemLoaded,
    getLoadProgress,
    loadedItems: loadedItemsRef.current,
    stats: getStats()
  };
}