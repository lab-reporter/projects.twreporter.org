'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMediaPreloader, LoadPriority } from './useMediaPreloader';
import { useNetworkStatus } from './useNetworkStatus';

interface ReportItem {
  id: string;
  path: string;
  title: string;
  [key: string]: unknown;
}

interface UseReportsPreloaderOptions {
  currentIndex: number;
  items: ReportItem[];
  isVisible: boolean;
  enabled?: boolean;
}

export function useReportsPreloader({
  currentIndex,
  items,
  isVisible,
  enabled = true
}: UseReportsPreloaderOptions) {
  const { preloadMedia, isLoaded, getStats } = useMediaPreloader({
    maxConcurrent: 3,
    enableLogging: process.env.NODE_ENV === 'development'
  });
  
  const { preloadConfig, isSlowConnection } = useNetworkStatus();
  const lastPreloadedIndexRef = useRef<number>(-1);
  const initialPreloadDoneRef = useRef(false);

  // 判斷媒體類型
  const getMediaType = useCallback((path: string): 'video' | 'image' => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => path.toLowerCase().includes(ext)) ? 'video' : 'image';
  }, []);

  // 取得應該預載的項目範圍
  const getPreloadRange = useCallback((index: number): number[] => {
    const range = preloadConfig.preloadRange;
    const indices: number[] = [];
    
    // 當前項目
    indices.push(index);
    
    // 前後項目（循環處理）
    for (let i = 1; i <= range; i++) {
      // 下一個項目
      indices.push((index + i) % items.length);
      // 上一個項目
      indices.push((index - i + items.length) % items.length);
    }
    
    return [...new Set(indices)]; // 去重
  }, [preloadConfig.preloadRange, items.length]);

  // 初始預載（頁面載入時）
  const performInitialPreload = useCallback(() => {
    if (!enabled || initialPreloadDoneRef.current) return;
    
    console.log('[ReportsPreloader] 執行初始預載');
    
    // 預載前 3 個項目（Critical 優先級）
    const initialItems = items.slice(0, 3).map(item => ({
      url: item.path,
      type: getMediaType(item.path),
      priority: LoadPriority.CRITICAL,
      preloadType: 'metadata' as const
    }));
    
    // 預載接下來的 3 個項目（High 優先級）
    const nextItems = items.slice(3, 6).map(item => ({
      url: item.path,
      type: getMediaType(item.path),
      priority: LoadPriority.HIGH,
      preloadType: 'metadata' as const
    }));
    
    preloadMedia([...initialItems, ...nextItems]);
    initialPreloadDoneRef.current = true;
  }, [enabled, items, getMediaType, preloadMedia]);

  // 動態預載（根據當前索引）
  const performDynamicPreload = useCallback(() => {
    if (!enabled || !isVisible) return;
    
    // 避免重複預載相同範圍
    if (currentIndex === lastPreloadedIndexRef.current) return;
    
    const indices = getPreloadRange(currentIndex);
    console.log(`[ReportsPreloader] 預載範圍: ${indices.join(', ')}`);
    
    const itemsToPreload = indices.map((idx, i) => {
      const item = items[idx];
      const mediaType = getMediaType(item.path);
      
      // 根據距離當前項目的遠近設定優先級
      let priority: LoadPriority;
      if (i === 0) {
        priority = LoadPriority.CRITICAL; // 當前項目
      } else if (i <= 2) {
        priority = LoadPriority.HIGH;     // 相鄰項目
      } else {
        priority = LoadPriority.MEDIUM;   // 較遠項目
      }
      
      return {
        url: item.path,
        type: mediaType,
        priority,
        preloadType: mediaType === 'video' 
          ? (isSlowConnection() ? 'metadata' as const : preloadConfig.videoPreload as 'auto' | 'metadata' | 'none')
          : undefined
      };
    });
    
    preloadMedia(itemsToPreload);
    lastPreloadedIndexRef.current = currentIndex;
  }, [
    enabled,
    isVisible,
    currentIndex,
    items,
    getPreloadRange,
    getMediaType,
    isSlowConnection,
    preloadConfig.videoPreload,
    preloadMedia
  ]);

  // 預載 Modal 內容（hover 時觸發）
  const preloadModalContent = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // 這裡可以預載 Modal 相關的額外資源
    // 例如：高解析度圖片、詳細內容等
    console.log(`[ReportsPreloader] 預載 Modal 內容: ${item.title}`);
    
    // 假設 Modal 有額外的高品質媒體
    const modalMediaUrl = item.path.replace(/\.(webm|mp4|webp|jpg)$/, '-hd.$1');
    
    preloadMedia([{
      url: modalMediaUrl,
      type: getMediaType(modalMediaUrl),
      priority: LoadPriority.MEDIUM,
      preloadType: 'metadata'
    }]);
  }, [items, getMediaType, preloadMedia]);

  // 初始載入
  useEffect(() => {
    performInitialPreload();
  }, [performInitialPreload]);

  // 索引變化時的動態載入
  useEffect(() => {
    performDynamicPreload();
  }, [performDynamicPreload]);

  // 可見性變化時的載入
  useEffect(() => {
    if (isVisible && !initialPreloadDoneRef.current) {
      performInitialPreload();
    }
  }, [isVisible, performInitialPreload]);

  // 提供狀態查詢
  const checkLoadStatus = useCallback((path: string): boolean => {
    return isLoaded(path);
  }, [isLoaded]);

  // 開發環境日誌
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const stats = getStats();
      console.log('[ReportsPreloader] 載入統計:', stats);
    }
  }, [currentIndex, getStats]);

  return {
    preloadModalContent,
    checkLoadStatus,
    stats: getStats()
  };
}