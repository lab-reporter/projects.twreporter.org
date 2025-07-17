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
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        setIsMounted(true);

        // 清理計時器
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Spline 載入完成後啟動 15 秒計時器
    const handleSplineLoaded = () => {
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 12000); // 15 秒後自動隱藏
    };

    // 手動點擊 SKIP
    const handleSkip = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsVisible(false);
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
        <div className="w-full h-screen fixed z-[99999] overflow-hidden m-0 bg-black">
            <div className="w-full h-full overflow-hidden m-0">
                <SplineWrapper onLoaded={handleSplineLoaded} />
            </div>
            <button
                onClick={handleSkip}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-black text-white px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
                SKIP
            </button>
        </div>
    );
}
