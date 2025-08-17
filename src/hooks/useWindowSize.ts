'use client';

import { useState, useEffect } from 'react';

// 視窗尺寸型別定義
interface WindowSize {
    width: number;
    height: number;
}

/**
 * 自訂 Hook：監聽視窗尺寸變化
 * 替代 @uidotdev/usehooks 的 useWindowSize
 * @returns {{ width: number, height: number }} 目前視窗尺寸
 */
export function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // 處理視窗大小變化的函數
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // 初始化設定
        handleResize();

        // 添加事件監聽器
        window.addEventListener('resize', handleResize);

        // 清理函數
        return () => window.removeEventListener('resize', handleResize);
    }, []); // 空依賴陣列，只在組件載入時執行

    return windowSize;
}
