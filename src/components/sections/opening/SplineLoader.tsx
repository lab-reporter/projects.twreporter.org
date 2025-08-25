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
}

/**
 * SplineLoader 組件
 * 
 * 負責：
 * 1. 載入 Spline 3D 場景
 * 2. 顯示載入進度條（反映實際載入進度）
 * 3. 提供 fallback 機制（載入畫面）
 */
export default function SplineLoader({
    onLoaded
}: SplineLoaderProps) {
    // 載入狀態管理
    const [isSplineLoaded, setIsSplineLoaded] = useState(false);
    const [showSpline, setShowSpline] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // 開始載入時的時間戳記
        const startTime = Date.now();
        let progressTimer: NodeJS.Timeout;

        // 動態載入 Spline viewer 腳本
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
            import('https://unpkg.com/@splinetool/viewer/build/spline-viewer.js').then(() => {
                window.splineLoaded = true;
            });
        `;
        document.head.appendChild(script);

        // 模擬載入進度（在實際載入完成前提供視覺反饋）
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            // 使用對數函數模擬載入進度，永遠不會到達100%
            const simulatedProgress = Math.min(85, (Math.log(elapsed / 100 + 1) / Math.log(50)) * 85);
            setLoadingProgress(simulatedProgress);

            if (!isSplineLoaded) {
                progressTimer = setTimeout(updateProgress, 50);
            }
        };

        // 開始進度模擬
        updateProgress();

        // 輪詢檢查 Spline 是否載入完成
        const checkLoaded = setInterval(() => {
            if ((window as unknown as { splineLoaded?: boolean }).splineLoaded) {
                setIsSplineLoaded(true);
                // 載入完成時將進度條快速推到100%
                setLoadingProgress(100);
                clearInterval(checkLoaded);
                // 短暫延遲後顯示 Spline（讓用戶看到100%完成）
                setTimeout(() => {
                    setShowSpline(true);
                    onLoaded();
                }, 300);
            }
        }, 100);

        // 清理函數
        return () => {
            clearInterval(checkLoaded);
            clearTimeout(progressTimer);
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, [isSplineLoaded, onLoaded]);



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
        // url: "https://prod.spline.design/r238ZLkUTwD7XGEN/scene.splinecode",
        url: "/scene.splinecode",
        style: { width: '100%', height: '100%' }
    });
}