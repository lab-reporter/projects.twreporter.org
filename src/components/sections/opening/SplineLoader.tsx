'use client';

import React, { useState, useEffect } from 'react';
import KeyVisual from '@/components/KeyVisual';

// TypeScript 宣告 spline-viewer 元素
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                url?: string;
            }, HTMLElement>;
        }
    }
}

interface SplineLoaderProps {
    onLoaded: () => void;
    minLoadingTime?: number; // 可自訂最小載入時間，預設 5000ms
}

/**
 * SplineLoader 組件
 * 
 * 負責：
 * 1. 載入 Spline 3D 場景
 * 2. 顯示載入進度條（ease-out 動畫）
 * 3. 提供 fallback 機制（KeyVisual）
 * 4. 確保最小載入時間避免閃爍
 */
export default function SplineLoader({ 
    onLoaded, 
    minLoadingTime = 5000 
}: SplineLoaderProps) {
    // 載入狀態管理
    const [isSplineLoaded, setIsSplineLoaded] = useState(false);
    const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
    const [showSpline, setShowSpline] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // 設定最小顯示時間計時器
        const minTimeTimer = setTimeout(() => {
            setIsMinTimeElapsed(true);
        }, minLoadingTime);

        // 更新進度條（使用 ease-out 曲線）
        const startTime = Date.now();
        const duration = minLoadingTime;
        
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // ease-out 函數：1 - (1 - t)^3
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            setLoadingProgress(easedProgress * 100);
            
            if (progress >= 1) {
                clearInterval(progressInterval);
            }
        }, 16); // 約60fps更新

        // 動態載入 Spline viewer 腳本
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
            import('https://unpkg.com/@splinetool/viewer/build/spline-viewer.js').then(() => {
                window.splineLoaded = true;
            });
        `;
        document.head.appendChild(script);

        // 輪詢檢查 Spline 是否載入完成
        const checkLoaded = setInterval(() => {
            if ((window as unknown as { splineLoaded?: boolean }).splineLoaded) {
                setIsSplineLoaded(true);
                clearInterval(checkLoaded);
            }
        }, 100);

        // 清理函數
        return () => {
            clearTimeout(minTimeTimer);
            clearInterval(checkLoaded);
            clearInterval(progressInterval);
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, [minLoadingTime]);

    // 監控載入條件，當兩個條件都滿足時切換到 Spline
    useEffect(() => {
        if (isSplineLoaded && isMinTimeElapsed && !showSpline) {
            setShowSpline(true);
            onLoaded();
        }
    }, [isSplineLoaded, isMinTimeElapsed, showSpline, onLoaded]);

    // 載入階段：顯示 KeyVisual 和進度條
    if (!showSpline) {
        return (
            <>
                <KeyVisual />
                {/* 載入進度條 */}
                <div className="fixed bottom-0 left-0 w-full h-1 bg-transparent z-[100000]">
                    <div
                        className="h-full bg-red-700 transition-all duration-100 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                    />
                </div>
            </>
        );
    }

    // 載入完成：顯示 Spline 3D 場景
    return React.createElement('spline-viewer', {
        url: "/scene.splinecode",
        style: { width: '100%', height: '100%' }
    });
}