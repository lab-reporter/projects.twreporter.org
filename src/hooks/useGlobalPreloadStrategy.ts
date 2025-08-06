'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useMediaPreloader, LoadPriority } from './useMediaPreloader';
import { useNetworkStatus } from './useNetworkStatus';
import { useStore } from '@/stores';

// 預載優先級配置
const PRELOAD_PRIORITIES = {
  // 關鍵資源（立即載入）
  critical: [
    '/assets/KV/motion4K.webm',
    '/assets/KV/KV-Waves.webp',
    '/assets/KV/KV-Logotype.svg',
    '/assets/KV/KV-Slogan.svg'
  ],
  // 高優先級（1-3秒內載入）
  high: [
    '/assets/reports/reports-1.webp',
    '/assets/reports/reports-2.webm',
    '/assets/reports/reports-3.webm'
  ],
  // 中優先級（3-5秒內載入）
  medium: [
    '/assets/innovations/innovation-1.webm',
    '/assets/challenges/challenge-1/challenge-1-1.jpg',
    '/assets/challenges/challenge-1/challenge-1-2.jpg'
  ],
  // 低優先級（5秒後載入）
  low: [
    '/assets/gift.png',
    '/assets/event_exhibition.jpg',
    '/assets/event_party.jpg'
  ]
};

export function useGlobalPreloadStrategy() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('');
  
  const { preloadMedia, clearAll, getStats } = useMediaPreloader({
    maxConcurrent: 4,
    retryAttempts: 2,
    enableLogging: process.env.NODE_ENV === 'development'
  });
  
  const { loadStrategy, isOnline, isSlowConnection } = useNetworkStatus();
  const isOpeningComplete = useStore((state) => state.isOpeningComplete);
  
  const loadPhaseRef = useRef<'critical' | 'high' | 'medium' | 'low' | 'complete'>('critical');
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // 判斷媒體類型
  const getMediaType = useCallback((url: string): 'video' | 'image' => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) ? 'video' : 'image';
  }, []);

  // 執行分階段載入
  const executePhaseLoad = useCallback(() => {
    if (!isOnline || !isInitialized) return;
    
    console.log(`[GlobalPreload] 執行載入階段: ${loadPhaseRef.current}, 策略: ${loadStrategy}`);
    
    // 根據網路策略調整載入
    if (loadStrategy === 'conservative') {
      // 保守策略：只載入關鍵資源
      const criticalItems = PRELOAD_PRIORITIES.critical.map(url => ({
        url,
        type: getMediaType(url),
        priority: LoadPriority.CRITICAL,
        preloadType: getMediaType(url) === 'video' ? 'metadata' as const : undefined
      }));
      
      preloadMedia(criticalItems);
      loadPhaseRef.current = 'complete';
      return;
    }
    
    // 正常載入流程
    const scheduleLoad = (items: string[], priority: LoadPriority, delay: number) => {
      const timer = setTimeout(() => {
        const mediaItems = items.map(url => ({
          url,
          type: getMediaType(url),
          priority,
          preloadType: getMediaType(url) === 'video' 
            ? (isSlowConnection() ? 'metadata' as const : 'auto' as const)
            : undefined
        }));
        
        preloadMedia(mediaItems);
      }, delay);
      
      timersRef.current.push(timer);
    };
    
    // 立即載入關鍵資源
    const criticalItems = PRELOAD_PRIORITIES.critical.map(url => ({
      url,
      type: getMediaType(url),
      priority: LoadPriority.CRITICAL,
      preloadType: getMediaType(url) === 'video' ? 'auto' as const : undefined
    }));
    preloadMedia(criticalItems);
    
    // 根據策略安排後續載入
    if (loadStrategy === 'aggressive') {
      // 積極策略：快速載入所有資源
      scheduleLoad(PRELOAD_PRIORITIES.high, LoadPriority.HIGH, 1000);
      scheduleLoad(PRELOAD_PRIORITIES.medium, LoadPriority.MEDIUM, 2000);
      scheduleLoad(PRELOAD_PRIORITIES.low, LoadPriority.LOW, 3000);
    } else {
      // 平衡策略：漸進式載入
      scheduleLoad(PRELOAD_PRIORITIES.high, LoadPriority.HIGH, 2000);
      scheduleLoad(PRELOAD_PRIORITIES.medium, LoadPriority.MEDIUM, 4000);
      scheduleLoad(PRELOAD_PRIORITIES.low, LoadPriority.LOW, 6000);
    }
    
    loadPhaseRef.current = 'complete';
  }, [isOnline, isInitialized, loadStrategy, isSlowConnection, getMediaType, preloadMedia]);

  // 根據當前區域預載相關資源
  const preloadSectionResources = useCallback((section: string) => {
    if (!isOnline || isSlowConnection()) return;
    
    console.log(`[GlobalPreload] 預載區域資源: ${section}`);
    
    let sectionResources: string[] = [];
    
    switch (section) {
      case 'reports':
        sectionResources = [
          '/assets/reports/reports-4.webp',
          '/assets/reports/reports-5.webp',
          '/assets/reports/reports-6.webp'
        ];
        break;
      case 'innovations':
        sectionResources = [
          '/assets/innovations/innovation-2.webm',
          '/assets/innovations/innovation-3.webm',
          '/assets/innovations/innovation-4.webm'
        ];
        break;
      case 'challenges':
        sectionResources = [
          '/assets/challenges/challenge-2/challenge-2-1.jpg',
          '/assets/challenges/challenge-2/challenge-2-2.jpg',
          '/assets/challenges/challenge-3/challenge-3-1.jpg'
        ];
        break;
      default:
        return;
    }
    
    const mediaItems = sectionResources.map(url => ({
      url,
      type: getMediaType(url),
      priority: LoadPriority.MEDIUM,
      preloadType: getMediaType(url) === 'video' ? 'metadata' as const : undefined
    }));
    
    preloadMedia(mediaItems);
  }, [isOnline, isSlowConnection, getMediaType, preloadMedia]);

  // 初始化預載策略
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      setIsInitialized(true);
      
      // 延遲開始預載，等待頁面基本渲染完成
      const initTimer = setTimeout(() => {
        executePhaseLoad();
      }, 500);
      
      timersRef.current.push(initTimer);
    }
  }, [isInitialized, executePhaseLoad]);

  // 監聽區域變化
  useEffect(() => {
    // 這裡可以連接到你的滾動監控系統
    const handleSectionChange = (section: string) => {
      if (section !== currentSection) {
        setCurrentSection(section);
        preloadSectionResources(section);
      }
    };
    
    // 模擬區域變化（實際應連接到滾動監控）
    if (isOpeningComplete) {
      handleSectionChange('reports');
    }
  }, [currentSection, isOpeningComplete, preloadSectionResources]);

  // 清理計時器
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  // 記憶體管理：當切換區域時清理不需要的資源
  const cleanupUnusedResources = useCallback(() => {
    const stats = getStats();
    
    // 如果載入的資源超過 50 個，清理較舊的資源
    if (stats.loaded > 50) {
      console.log('[GlobalPreload] 清理未使用的資源');
      // 這裡可以實作更智慧的清理邏輯
      // 例如：只保留當前區域和相鄰區域的資源
    }
  }, [getStats]);

  // 定期檢查記憶體使用
  useEffect(() => {
    const checkInterval = setInterval(() => {
      cleanupUnusedResources();
    }, 30000); // 每 30 秒檢查一次
    
    return () => clearInterval(checkInterval);
  }, [cleanupUnusedResources]);

  // 提供預載統計資訊
  const getPreloadStats = useCallback(() => {
    const stats = getStats();
    const progress = ((stats.loaded / (stats.loaded + stats.loading + stats.queued)) * 100) || 0;
    
    return {
      ...stats,
      progress: Math.round(progress),
      strategy: loadStrategy,
      phase: loadPhaseRef.current
    };
  }, [getStats, loadStrategy]);

  return {
    preloadStats: getPreloadStats(),
    currentSection,
    isInitialized,
    resetPreload: clearAll
  };
}