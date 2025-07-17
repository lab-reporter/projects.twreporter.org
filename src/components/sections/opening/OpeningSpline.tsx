'use client';

import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline/next';

export default function OpeningSpline() {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // 處理 skip 按鈕點擊
    const handleSkip = () => {
        setIsVisible(false);
    };

    // Spline 載入完成後的處理
    const handleSplineLoad = () => {
        setIsLoaded(true);
    };

    // 設定自動隱藏計時器
    useEffect(() => {
        if (isLoaded) {
            // 設定 15 秒後自動隱藏
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 15000);

            // 清理計時器
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    // 如果不可見，直接返回 null
    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="fixed top-0 left-0 w-full h-screen z-50 bg-white overflow-hidden"
        >
            <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
                <Spline
                    scene="https://prod.spline.design/r238ZLkUTwD7XGEN/scene.splinecode"
                    onLoad={handleSplineLoad}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <button
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                onClick={handleSkip}
            >
                skip
            </button>
        </div>
    );
}
