'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
 * 3. 提供 fallback 機制（載入畫面）
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

    // 載入階段：顯示載入畫面和進度條
    if (!showSpline) {
        return (
            <>
                <style jsx>{`
                    @keyframes wavePulse {
                        0% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: translate(-50%, -50%) scale(1.125);
                            opacity: 0.8;
                        }
                        100% {
                            transform: translate(-50%, -50%) scale(1.25);
                            opacity: 0;
                        }
                    }
                    
                    .wave-animation {
                        animation: wavePulse 1s linear infinite;
                    }
                `}</style>

                <div className="bg-black w-full h-screen flex flex-row justify-center items-center relative ">
                    {/* 寶石 */}
                    {/* <div className="w-[50%] h-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <video
                            src="/assets/KV/motion4K.webm"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-contain w-full h-full"
                        />
                    </div> */}
                    {/* Waves小 */}
                    <div className="w-[30%] h-full absolute z-10 top-[55%] left-1/2 wave-animation">
                        <Image
                            src="/assets/KV/KV-Waves.webp"
                            alt="KV聲波"
                            fill
                            sizes="100vw"
                            priority
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Waves中 */}
                    <div className="w-[40%] h-full absolute z-10 top-[60%] left-1/2 wave-animation">
                        <Image
                            src="/assets/KV/KV-Waves.webp"
                            alt="KV聲波"
                            fill
                            sizes="100vw"
                            priority
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Waves大 */}
                    <div className="w-[50%] h-full absolute z-10 top-[65%] left-1/2 wave-animation">
                        <Image
                            src="/assets/KV/KV-Waves.webp"
                            alt="KV聲波"
                            fill
                            sizes="100vw"
                            priority
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Logo */}
                    <div className="w-[25%] h-24 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10">
                        <Image
                            src="/assets/KV/KV-Logotype.svg"
                            alt="報導者 Logo"
                            fill
                            sizes="30vw"
                            priority
                            className="object-contain object-left"
                        />
                    </div>
                    {/* 標語 */}
                    {/* <div className="w-[25%] h-24 absolute bottom-16 right-16 z-10">
                        <Image
                            src="/assets/KV/KV-Slogan.svg"
                            alt="報導者標語"
                            fill
                            sizes="30vw"
                            priority
                            className="object-contain object-right"
                        />
                    </div> */}
                </div>
                
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