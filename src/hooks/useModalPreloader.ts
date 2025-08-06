'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useMediaPreloader, LoadPriority } from './useMediaPreloader';
import { useNetworkStatus } from './useNetworkStatus';

interface ModalMediaItem {
  src: string;
  type: 'image' | 'video' | 'iframe';
  alt?: string;
}

interface UseModalPreloaderOptions {
  projectId?: string;
  mediaItems?: ModalMediaItem[];
  isOpen: boolean;
  enabled?: boolean;
}

export function useModalPreloader({
  projectId,
  mediaItems = [],
  isOpen,
  enabled = true
}: UseModalPreloaderOptions) {
  const { preloadMedia, isLoaded, getStats } = useMediaPreloader({
    maxConcurrent: 2,
    enableLogging: process.env.NODE_ENV === 'development'
  });
  
  const { isSlowConnection, preloadConfig } = useNetworkStatus();
  const hasPreloadedRef = useRef(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 預載 Modal 媒體內容
  const preloadModalMedia = useCallback(() => {
    if (!enabled || hasPreloadedRef.current || mediaItems.length === 0) return;
    
    console.log(`[ModalPreloader] 預載 Modal 媒體: ${projectId}`);
    
    // 根據網路狀況決定預載數量
    const itemsToPreload = isSlowConnection() 
      ? mediaItems.slice(0, 1)  // 慢速網路只載入第一個
      : mediaItems.slice(0, 3); // 快速網路載入前三個
    
    const preloadItems = itemsToPreload
      .filter(item => item.type !== 'iframe') // 不預載 iframe
      .map((item, index) => ({
        url: item.src,
        type: item.type as 'image' | 'video',
        priority: index === 0 ? LoadPriority.HIGH : LoadPriority.MEDIUM,
        preloadType: item.type === 'video' 
          ? (isSlowConnection() ? 'metadata' as const : preloadConfig.videoPreload as 'auto' | 'metadata' | 'none')
          : undefined
      }));
    
    preloadMedia(preloadItems);
    hasPreloadedRef.current = true;
  }, [enabled, projectId, mediaItems, isSlowConnection, preloadConfig.videoPreload, preloadMedia]);

  // Hover 預載（延遲觸發避免過度預載）
  const preloadOnHover = useCallback(() => {
    if (!enabled || isOpen || hasPreloadedRef.current) return;
    
    // 清除之前的計時器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // 延遲 300ms 後開始預載（避免快速滑過）
    hoverTimerRef.current = setTimeout(() => {
      preloadModalMedia();
    }, 300);
  }, [enabled, isOpen, preloadModalMedia]);

  // 取消 Hover 預載
  const cancelHoverPreload = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // 預載剩餘內容（Modal 開啟後）
  const preloadRemainingContent = useCallback(() => {
    if (!enabled || mediaItems.length <= 3) return;
    
    console.log(`[ModalPreloader] 預載剩餘內容: ${projectId}`);
    
    const remainingItems = mediaItems.slice(3)
      .filter(item => item.type !== 'iframe')
      .map(item => ({
        url: item.src,
        type: item.type as 'image' | 'video',
        priority: LoadPriority.LOW,
        preloadType: item.type === 'video' ? 'metadata' as const : undefined
      }));
    
    // 延遲載入剩餘內容
    setTimeout(() => {
      preloadMedia(remainingItems);
    }, 1000);
  }, [enabled, projectId, mediaItems, preloadMedia]);

  // Modal 開啟時的處理
  useEffect(() => {
    if (isOpen && enabled) {
      // 立即預載核心內容
      if (!hasPreloadedRef.current) {
        preloadModalMedia();
      }
      
      // 延遲預載剩餘內容
      preloadRemainingContent();
    }
  }, [isOpen, enabled, preloadModalMedia, preloadRemainingContent]);

  // 清理計時器
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // 檢查特定媒體是否已載入
  const checkMediaLoaded = useCallback((src: string): boolean => {
    return isLoaded(src);
  }, [isLoaded]);

  // 取得載入進度
  const getLoadProgress = useCallback((): number => {
    if (mediaItems.length === 0) return 100;
    
    const loadedCount = mediaItems.filter(item => 
      item.type === 'iframe' || isLoaded(item.src)
    ).length;
    
    return (loadedCount / mediaItems.length) * 100;
  }, [mediaItems, isLoaded]);

  return {
    preloadOnHover,
    cancelHoverPreload,
    checkMediaLoaded,
    getLoadProgress,
    stats: getStats()
  };
}