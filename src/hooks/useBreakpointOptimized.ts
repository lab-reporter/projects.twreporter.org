'use client';

import { useState, useEffect } from 'react';

// ============================
// 優化的斷點檢測 Hook
// ============================
// 專門為 Reports Section 設計的效能優化 Hook
// 使用 CSS media query 而非 JavaScript 計算，確保最佳效能

interface UseBreakpointOptimizedReturn {
    // 是否為桌面版（lg 以上）
    isDesktop: boolean;
    // 是否為手機版（lg 以下）
    isMobile: boolean;
    // 是否已完成客戶端初始化
    isClient: boolean;
}

export function useBreakpointOptimized(): UseBreakpointOptimizedReturn {
    // 初始狀態設為 desktop，避免 SSR/CSR 不匹配
    const [isDesktop, setIsDesktop] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // 標記客戶端已初始化
        setIsClient(true);

        // 使用 CSS media query 來檢測斷點，效能最佳
        const mediaQuery = window.matchMedia('(min-width: 1024px)'); // lg 斷點
        
        // 設定初始狀態
        setIsDesktop(mediaQuery.matches);

        // 監聽斷點變化
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDesktop(e.matches);
        };

        // 註冊監聽器
        mediaQuery.addEventListener('change', handleChange);

        // 清理函數
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return {
        isDesktop,
        isMobile: !isDesktop,
        isClient
    };
}
