import { useEffect, useRef, useState } from 'react';

// 效能監控 Hook
export const usePerformanceMonitor = (enabled = true) => {
    const [stats, setStats] = useState({
        fps: 0,
        memory: 0,
        drawCalls: 0
    });

    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const fpsArray = useRef([]);

    useEffect(() => {
        if (!enabled) return;

        const monitor = () => {
            const now = performance.now();
            const delta = now - lastTime.current;

            frameCount.current++;

            // 每秒更新一次統計
            if (delta >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / delta);

                // 計算平均 FPS（過去 5 秒）
                fpsArray.current.push(fps);
                if (fpsArray.current.length > 5) {
                    fpsArray.current.shift();
                }

                const avgFps = fpsArray.current.reduce((a, b) => a + b, 0) / fpsArray.current.length;

                setStats(prev => ({
                    ...prev,
                    fps: Math.round(avgFps)
                }));

                frameCount.current = 0;
                lastTime.current = now;

                // 記憶體監控（如果支援）
                if (performance.memory) {
                    setStats(prev => ({
                        ...prev,
                        memory: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
                    }));
                }
            }

            requestAnimationFrame(monitor);
        };

        monitor();
    }, [enabled]);

    return stats;
};

// 自適應品質管理
export const useAdaptiveQuality = (initialQuality = 'high') => {
    const [quality, setQuality] = useState(initialQuality);
    const performanceHistory = useRef([]);

    const stats = usePerformanceMonitor();

    useEffect(() => {
        performanceHistory.current.push(stats.fps);

        // 保持最近 10 個 FPS 記錄
        if (performanceHistory.current.length > 10) {
            performanceHistory.current.shift();
        }

        // 如果有足夠的數據進行判斷
        if (performanceHistory.current.length >= 5) {
            const avgFps = performanceHistory.current.reduce((a, b) => a + b, 0) / performanceHistory.current.length;

            // 自動調整品質
            if (avgFps < 30 && quality !== 'low') {
                setQuality('low');
                console.log('🔧 效能偵測：降低至低品質模式');
            } else if (avgFps > 50 && quality !== 'high') {
                setQuality('high');
                console.log('🔧 效能偵測：提升至高品質模式');
            } else if (avgFps >= 30 && avgFps <= 50 && quality !== 'medium') {
                setQuality('medium');
                console.log('🔧 效能偵測：調整至中品質模式');
            }
        }
    }, [stats.fps, quality]);

    // 根據品質等級返回設定
    const getQualitySettings = () => {
        switch (quality) {
            case 'low':
                return {
                    pixelRatio: 1,
                    antialias: false,
                    shadows: false,
                    particleCount: 1000,
                    animationFPS: 30
                };
            case 'medium':
                return {
                    pixelRatio: 1.5,
                    antialias: true,
                    shadows: true,
                    particleCount: 2000,
                    animationFPS: 45
                };
            case 'high':
            default:
                return {
                    pixelRatio: Math.min(window.devicePixelRatio, 2),
                    antialias: true,
                    shadows: true,
                    particleCount: 4000,
                    animationFPS: 60
                };
        }
    };

    return {
        quality,
        settings: getQualitySettings(),
        stats,
        setQuality
    };
}; 