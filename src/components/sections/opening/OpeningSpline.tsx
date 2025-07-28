'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/stores';

// TypeScript 宣告 spline-viewer 元素
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                url?: string;
            }, HTMLElement>;
        }
    }
}

interface SplineWrapperProps {
    onLoaded: () => void;
}

function SplineWrapper({ onLoaded }: SplineWrapperProps) {
    const [isSplineLoaded, setIsSplineLoaded] = useState(false);
    const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
    const [showSpline, setShowSpline] = useState(false);

    useEffect(() => {
        // 設定最小顯示時間計時器（1.5秒）
        const minTimeTimer = setTimeout(() => {
            setIsMinTimeElapsed(true);
        }, 1500);

        // 載入 Spline
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
            import('https://unpkg.com/@splinetool/viewer/build/spline-viewer.js').then(() => {
                window.splineLoaded = true;
            });
        `;
        document.head.appendChild(script);

        const checkLoaded = setInterval(() => {
            if ((window as any).splineLoaded) {
                setIsSplineLoaded(true);
                clearInterval(checkLoaded);
            }
        }, 100);

        return () => {
            clearTimeout(minTimeTimer);
            clearInterval(checkLoaded);
            document.head.removeChild(script);
        };
    }, []);

    // 當兩個條件都滿足時，顯示 Spline 並觸發 onLoaded
    useEffect(() => {
        if (isSplineLoaded && isMinTimeElapsed && !showSpline) {
            setShowSpline(true);
            onLoaded();
        }
    }, [isSplineLoaded, isMinTimeElapsed, showSpline, onLoaded]);

    if (!showSpline) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
                <h4>報導者十週年</h4>
                <h5>深度求真　眾聲同行</h5>
            </div>
        );
    }

    return (
        <spline-viewer
            url="/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
        />
    );
}

export default function OpeningSpline() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();
    const fadeTimerRef = useRef<NodeJS.Timeout>();
    const setOpeningComplete = useStore((state) => state.setOpeningComplete);

    useEffect(() => {
        setIsMounted(true);

        // 清理計時器
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (fadeTimerRef.current) {
                clearTimeout(fadeTimerRef.current);
            }
        };
    }, []);

    // 管理 body 滾動鎖定
    useEffect(() => {
        if (isVisible) {
            // 鎖定滾動
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            // 解鎖滾動
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        // 清理時確保恢復滾動
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isVisible]);

    // Spline 載入完成後啟動 12 秒計時器
    const handleSplineLoaded = () => {
        timerRef.current = setTimeout(() => {
            // 開始淡出動畫
            setIsFading(true);
            // 1 秒後完全隱藏
            fadeTimerRef.current = setTimeout(() => {
                setIsVisible(false);
                setOpeningComplete(true);
            }, 1000);
        }, 12000); // 12 秒後開始淡出
    };

    // 手動點擊 SKIP
    const handleSkip = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current);
        }
        // 立即開始淡出
        setIsFading(true);
        setTimeout(() => {
            setIsVisible(false);
            setOpeningComplete(true);
        }, 300); // 快速淡出
    };

    if (!isVisible) return null;

    if (!isMounted) {
        return (
            <div className="w-full h-screen fixed z-[99999] flex items-center justify-center bg-black text-white">
                <h4>報導者十週年</h4>
                <h5>深度求真　眾聲同行</h5>
            </div>
        );
    }

    return (
        <div
            className={`w-full h-screen fixed z-[99999] overflow-hidden m-0 bg-black transition-opacity ${isFading ? 'opacity-0 duration-1000' : 'opacity-100'
                }`}
        >
            <div className="w-full h-full overflow-hidden m-0">
                <SplineWrapper onLoaded={handleSplineLoaded} />
            </div>
            <button
                onClick={handleSkip}
                className="absolute leading-none bottom-4 right-4 z-[99999] bg-[rgba(0,0,0,0.5)] backdrop-blur-lg text-gray-200 px-2 py-2 text-sm hover:bg-gray-800 hover:text-white transition-colors"
            >
                SKIP
            </button>
        </div>
    );
}
