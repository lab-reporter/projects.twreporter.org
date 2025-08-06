'use client';

import { useEffect, useState, useCallback } from 'react';

// 網路連線類型
export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'ethernet' | 'unknown';

// 網路狀態介面
export interface NetworkStatus {
  online: boolean;
  effectiveType: ConnectionType;
  downlink: number;           // 下載速度 (Mbps)
  rtt: number;                // 往返時間 (ms)
  saveData: boolean;          // 是否啟用省流量模式
  deviceMemory?: number;      // 裝置記憶體 (GB)
  hardwareConcurrency?: number; // CPU 核心數
}

// 載入策略
export type LoadStrategy = 'aggressive' | 'balanced' | 'conservative';

// 擴展 Navigator 介面
interface NavigatorConnection extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

interface ExtendedNavigator extends Navigator {
  connection?: NavigatorConnection;
  mozConnection?: NavigatorConnection;
  webkitConnection?: NavigatorConnection;
  deviceMemory?: number;
}

export function useNetworkStatus() {
  // 初始網路狀態
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: typeof window !== 'undefined' ? navigator.onLine : true,
    effectiveType: 'unknown',
    downlink: 10,
    rtt: 100,
    saveData: false
  });

  // 根據網路狀態決定載入策略
  const getLoadStrategy = useCallback((): LoadStrategy => {
    const { effectiveType, saveData, deviceMemory } = networkStatus;
    
    // 省流量模式或低記憶體，使用保守策略
    if (saveData || (deviceMemory && deviceMemory < 2)) {
      return 'conservative';
    }
    
    // 根據連線類型決定策略
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'conservative';
      case '3g':
        return 'balanced';
      case '4g':
      case 'wifi':
      case 'ethernet':
        return 'aggressive';
      default:
        return 'balanced';
    }
  }, [networkStatus]);

  // 根據策略取得預載配置
  const getPreloadConfig = useCallback(() => {
    const strategy = getLoadStrategy();
    
    switch (strategy) {
      case 'aggressive':
        return {
          maxConcurrent: 6,      // 最大同時載入數
          preloadRange: 3,       // 預載範圍（前後各幾個項目）
          videoPreload: 'auto',  // 影片預載類型
          imageQuality: 90,      // 圖片品質
          enablePrefetch: true,  // 啟用預取
          cacheStrategy: 'all'   // 快取策略
        };
      
      case 'balanced':
        return {
          maxConcurrent: 3,
          preloadRange: 2,
          videoPreload: 'metadata',
          imageQuality: 85,
          enablePrefetch: true,
          cacheStrategy: 'essential'
        };
      
      case 'conservative':
        return {
          maxConcurrent: 1,
          preloadRange: 1,
          videoPreload: 'none',
          imageQuality: 75,
          enablePrefetch: false,
          cacheStrategy: 'minimal'
        };
    }
  }, [getLoadStrategy]);

  // 檢查是否為慢速連線
  const isSlowConnection = useCallback((): boolean => {
    const slowTypes: ConnectionType[] = ['slow-2g', '2g', '3g'];
    return slowTypes.includes(networkStatus.effectiveType) || 
           networkStatus.downlink < 1 || 
           networkStatus.rtt > 300;
  }, [networkStatus]);

  // 檢查是否為高速連線
  const isFastConnection = useCallback((): boolean => {
    const fastTypes: ConnectionType[] = ['4g', 'wifi', 'ethernet'];
    return fastTypes.includes(networkStatus.effectiveType) && 
           networkStatus.downlink > 5 && 
           networkStatus.rtt < 100;
  }, [networkStatus]);

  // 檢查是否為低階裝置
  const isLowEndDevice = useCallback((): boolean => {
    const { deviceMemory, hardwareConcurrency } = networkStatus;
    return (deviceMemory !== undefined && deviceMemory < 4) || 
           (hardwareConcurrency !== undefined && hardwareConcurrency < 4);
  }, [networkStatus]);

  // 取得建議的媒體品質
  const getRecommendedQuality = useCallback(() => {
    if (isSlowConnection() || isLowEndDevice()) {
      return {
        video: '480p',
        image: 'low',
        quality: 70
      };
    }
    
    if (isFastConnection() && !isLowEndDevice()) {
      return {
        video: '1080p',
        image: 'high',
        quality: 90
      };
    }
    
    return {
      video: '720p',
      image: 'medium',
      quality: 85
    };
  }, [isSlowConnection, isFastConnection, isLowEndDevice]);

  // 更新網路狀態
  const updateNetworkStatus = useCallback(() => {
    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (connection) {
      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: (connection.effectiveType as ConnectionType) || 'unknown',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false,
        deviceMemory: nav.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency
      });
    } else {
      // 沒有 Network Information API，使用預設值
      setNetworkStatus(prev => ({
        ...prev,
        online: navigator.onLine,
        deviceMemory: nav.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency
      }));
    }
  }, []);

  // 監聽網路變化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 初始更新
    updateNetworkStatus();
    
    // 監聽線上/離線事件
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, online: true }));
      updateNetworkStatus();
    };
    
    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, online: false }));
    };
    
    // 監聽連線變化
    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }
    
    // 定期檢查（備用方案）
    const intervalId = setInterval(updateNetworkStatus, 30000); // 每 30 秒檢查一次
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
      
      clearInterval(intervalId);
    };
  }, [updateNetworkStatus]);

  return {
    // 狀態
    networkStatus,
    isOnline: networkStatus.online,
    connectionType: networkStatus.effectiveType,
    
    // 策略
    loadStrategy: getLoadStrategy(),
    preloadConfig: getPreloadConfig(),
    
    // 檢查函數
    isSlowConnection,
    isFastConnection,
    isLowEndDevice,
    
    // 建議
    recommendedQuality: getRecommendedQuality(),
    
    // 原始資料
    downlink: networkStatus.downlink,
    rtt: networkStatus.rtt,
    saveData: networkStatus.saveData,
    deviceMemory: networkStatus.deviceMemory,
    hardwareConcurrency: networkStatus.hardwareConcurrency
  };
}