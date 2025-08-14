'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// 媒體載入優先級
export enum LoadPriority {
  CRITICAL = 'critical',  // 立即載入（首屏必需）
  HIGH = 'high',         // 高優先級（即將可見）
  MEDIUM = 'medium',     // 中優先級（預期瀏覽）
  LOW = 'low'           // 低優先級（按需載入）
}

// 媒體項目介面
interface MediaItem {
  url: string;
  type: 'image' | 'video';
  priority: LoadPriority;
  preloadType?: 'metadata' | 'auto' | 'none';
}

// 載入狀態
interface LoadingState {
  loaded: Set<string>;
  loading: Set<string>;
  failed: Set<string>;
}

// Hook 配置選項
interface UseMediaPreloaderOptions {
  maxConcurrent?: number;      // 最大同時載入數
  retryAttempts?: number;      // 重試次數
  retryDelay?: number;         // 重試延遲（毫秒）
  enableLogging?: boolean;     // 啟用日誌
}

export function useMediaPreloader(options: UseMediaPreloaderOptions = {}) {
  const {
    maxConcurrent = 3,
    retryAttempts = 2,
    retryDelay = 1000,
    enableLogging = process.env.NODE_ENV === 'development'
  } = options;

  // 載入狀態
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loaded: new Set(),
    loading: new Set(),
    failed: new Set()
  });

  // 載入佇列
  const loadQueueRef = useRef<MediaItem[]>([]);
  const activeLoadsRef = useRef(0);
  const retryCountRef = useRef<Map<string, number>>(new Map());

  // 日誌輸出
  const log = useCallback((message: string, ...args: unknown[]) => {
    if (enableLogging) {
      console.log(`[MediaPreloader] ${message}`, ...args);
    }
  }, [enableLogging]);

  // 預載圖片
  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      
      img.onload = () => {
        log(`✅ Image loaded: ${url}`);
        resolve();
      };
      
      img.onerror = () => {
        log(`❌ Image failed: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }, [log]);

  // 預載影片
  const preloadVideo = useCallback((url: string, preloadType: 'metadata' | 'auto' | 'none' = 'metadata'): Promise<void> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      video.preload = preloadType;
      
      // 根據預載類型決定何時視為載入完成
      const eventName = preloadType === 'metadata' ? 'loadedmetadata' : 'canplaythrough';
      
      video.addEventListener(eventName, () => {
        log(`✅ Video loaded (${preloadType}): ${url}`);
        resolve();
      });
      
      video.addEventListener('error', () => {
        log(`❌ Video failed: ${url}`);
        reject(new Error(`Failed to load video: ${url}`));
      });
      
      video.src = url;
      
      // 強制開始載入
      if (preloadType === 'auto') {
        video.load();
      }
    });
  }, [log]);

  // 處理載入佇列的引用，避免循環依賴
  const processQueueRef = useRef<() => void>();

  // 載入單個媒體項目
  const loadMediaItem = useCallback(async (item: MediaItem): Promise<void> => {
    const { url, type, preloadType } = item;
    
    // 檢查是否已載入或正在載入
    if (loadingState.loaded.has(url) || loadingState.loading.has(url)) {
      return;
    }
    
    // 更新載入狀態
    setLoadingState(prev => ({
      ...prev,
      loading: new Set([...prev.loading, url])
    }));
    
    activeLoadsRef.current++;
    
    try {
      // 根據類型載入媒體
      if (type === 'video') {
        await preloadVideo(url, preloadType || 'metadata');
      } else {
        await preloadImage(url);
      }
      
      // 載入成功
      setLoadingState(prev => {
        const newLoading = new Set(prev.loading);
        newLoading.delete(url);
        return {
          ...prev,
          loaded: new Set([...prev.loaded, url]),
          loading: newLoading
        };
      });
      
      retryCountRef.current.delete(url);
      
    } catch {
      // 載入失敗，檢查是否需要重試
      const retryCount = retryCountRef.current.get(url) || 0;
      
      if (retryCount < retryAttempts) {
        log(`🔄 Retrying ${url} (attempt ${retryCount + 1}/${retryAttempts})`);
        retryCountRef.current.set(url, retryCount + 1);
        
        // 延遲後重試
        setTimeout(() => {
          loadQueueRef.current.unshift(item);
          processQueueRef.current?.();
        }, retryDelay * (retryCount + 1));
        
      } else {
        // 超過重試次數，標記為失敗
        setLoadingState(prev => {
          const newLoading = new Set(prev.loading);
          newLoading.delete(url);
          return {
            ...prev,
            loading: newLoading,
            failed: new Set([...prev.failed, url])
          };
        });
        
        log(`❌ Failed after ${retryAttempts} attempts: ${url}`);
      }
    } finally {
      activeLoadsRef.current--;
      processQueueRef.current?.();
    }
  }, [loadingState, preloadImage, preloadVideo, retryAttempts, retryDelay, log]);

  // 處理載入佇列
  const processQueue = useCallback(() => {
    while (activeLoadsRef.current < maxConcurrent && loadQueueRef.current.length > 0) {
      const item = loadQueueRef.current.shift();
      if (item) {
        loadMediaItem(item);
      }
    }
  }, [maxConcurrent, loadMediaItem]);

  // 將 processQueue 設定到 ref 中
  processQueueRef.current = processQueue;

  // 預載媒體（主要介面）
  const preloadMedia = useCallback((items: MediaItem[]) => {
    // 按優先級排序
    const sortedItems = [...items].sort((a, b) => {
      const priorityOrder = {
        [LoadPriority.CRITICAL]: 0,
        [LoadPriority.HIGH]: 1,
        [LoadPriority.MEDIUM]: 2,
        [LoadPriority.LOW]: 3
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // 分離關鍵資源和其他資源
    const criticalItems = sortedItems.filter(item => item.priority === LoadPriority.CRITICAL);
    const otherItems = sortedItems.filter(item => item.priority !== LoadPriority.CRITICAL);
    
    // 立即載入關鍵資源
    criticalItems.forEach(item => {
      loadMediaItem(item);
    });
    
    // 其他資源加入佇列
    loadQueueRef.current.push(...otherItems);
    processQueue();
    
    log(`📦 Queued ${items.length} items for preloading`);
  }, [loadMediaItem, processQueue, log]);

  // 預載單個 URL（簡化介面）
  const preloadUrl = useCallback((url: string, type: 'image' | 'video' = 'image', priority: LoadPriority = LoadPriority.MEDIUM) => {
    preloadMedia([{ url, type, priority }]);
  }, [preloadMedia]);

  // 檢查 URL 是否已載入
  const isLoaded = useCallback((url: string): boolean => {
    return loadingState.loaded.has(url);
  }, [loadingState.loaded]);

  // 檢查 URL 是否正在載入
  const isLoading = useCallback((url: string): boolean => {
    return loadingState.loading.has(url);
  }, [loadingState.loading]);

  // 檢查 URL 是否載入失敗
  const hasFailed = useCallback((url: string): boolean => {
    return loadingState.failed.has(url);
  }, [loadingState.failed]);

  // 清理特定 URL 的狀態
  const clearUrl = useCallback((url: string) => {
    setLoadingState(prev => {
      const newLoaded = new Set(prev.loaded);
      const newLoading = new Set(prev.loading);
      const newFailed = new Set(prev.failed);
      
      newLoaded.delete(url);
      newLoading.delete(url);
      newFailed.delete(url);
      
      return {
        loaded: newLoaded,
        loading: newLoading,
        failed: newFailed
      };
    });
    
    retryCountRef.current.delete(url);
  }, []);

  // 清理所有狀態
  const clearAll = useCallback(() => {
    setLoadingState({
      loaded: new Set(),
      loading: new Set(),
      failed: new Set()
    });
    loadQueueRef.current = [];
    retryCountRef.current.clear();
    activeLoadsRef.current = 0;
    
    log('🧹 Cleared all preloading state');
  }, [log]);

  // 取得載入統計
  const getStats = useCallback(() => {
    return {
      loaded: loadingState.loaded.size,
      loading: loadingState.loading.size,
      failed: loadingState.failed.size,
      queued: loadQueueRef.current.length,
      active: activeLoadsRef.current
    };
  }, [loadingState]);

  // 組件卸載時清理
  useEffect(() => {
    return () => {
      loadQueueRef.current = [];
      activeLoadsRef.current = 0;
    };
  }, []);

  return {
    preloadMedia,
    preloadUrl,
    isLoaded,
    isLoading,
    hasFailed,
    clearUrl,
    clearAll,
    getStats,
    loadingState
  };
}