'use client';

import { useState, useEffect, useRef } from 'react';

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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
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
                setIsLoaded(true);
                clearInterval(checkLoaded);
                onLoaded();
            }
        }, 100);

        return () => {
            clearInterval(checkLoaded);
            document.head.removeChild(script);
        };
    }, [onLoaded]);

    if (!isLoaded) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black text-white">
                Loading...
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

    // Spline 載入完成後啟動 12 秒計時器
    const handleSplineLoaded = () => {
        timerRef.current = setTimeout(() => {
            // 開始淡出動畫
            setIsFading(true);
            // 1 秒後完全隱藏
            fadeTimerRef.current = setTimeout(() => {
                setIsVisible(false);
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
        }, 300); // 快速淡出
    };

    if (!isVisible) return null;

    if (!isMounted) {
        return (
            <div className="w-full h-screen fixed z-[99999] flex items-center justify-center bg-black text-white">
                Loading...
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
