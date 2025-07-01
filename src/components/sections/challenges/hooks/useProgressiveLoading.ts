import { useState, useEffect, useCallback } from 'react';
import { PhotoPosition } from '../challenges.config';

interface UseProgressiveLoadingProps {
    photoCount: number;
    positions: PhotoPosition[];
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useProgressiveLoading = ({
    photoCount,
    positions,
    containerRef
}: UseProgressiveLoadingProps) => {
    const [loadedPhotos, setLoadedPhotos] = useState<Set<number>>(new Set());

    // 檢查照片是否應該載入
    const shouldLoadPhoto = useCallback((index: number): boolean => {
        return loadedPhotos.has(index);
    }, [loadedPhotos]);

    // 計算應該載入的照片
    const updateLoadedPhotos = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 擴大載入區域：視窗 + 緩衝區
        const bufferZone = {
            left: -viewportWidth * 0.5,
            right: viewportWidth * 1.5,
            top: -viewportHeight * 0.5,
            bottom: viewportHeight * 1.5
        };

        setLoadedPhotos(prevLoadedPhotos => {
            const newLoadedPhotos = new Set(prevLoadedPhotos);

            // 檢查每張照片是否在載入區域內
            for (let i = 0; i < photoCount; i++) {
                const positionIndex = i % positions.length;
                const position = positions[positionIndex];

                // 計算照片在容器中的實際位置
                const photoLeft = parseFloat(position.left) / 100 * containerRect.width;
                const photoTop = parseFloat(position.top) / 100 * containerRect.height;

                // 轉換為相對於視窗的位置
                const photoX = photoLeft + containerRect.left;
                const photoY = photoTop + containerRect.top;

                // 檢查是否在載入區域內
                const isInLoadZone = (
                    photoX >= bufferZone.left &&
                    photoX <= bufferZone.right &&
                    photoY >= bufferZone.top &&
                    photoY <= bufferZone.bottom
                );

                if (isInLoadZone) {
                    newLoadedPhotos.add(i);
                }
            }

            // 漸進式載入策略：根據時間逐步載入
            const currentTime = Date.now();
            const startTime = window.challengesStartTime || currentTime;
            window.challengesStartTime = startTime;

            const elapsedTime = currentTime - startTime;
            const loadInterval = 100; // 每100ms載入一批
            const batchSize = 3; // 每批載入3張

            const maxLoadsByTime = Math.floor(elapsedTime / loadInterval) * batchSize;
            const currentLoads = Array.from(newLoadedPhotos).slice(0, Math.min(maxLoadsByTime, photoCount));

            return new Set(currentLoads);
        });
    }, [photoCount, positions, containerRef]); // 移除 loadedPhotos 依賴

    // 監聽滾動和視窗調整大小
    useEffect(() => {
        const handleScroll = () => {
            // 使用 requestAnimationFrame 節流
            requestAnimationFrame(updateLoadedPhotos);
        };

        const handleResize = () => {
            updateLoadedPhotos();
        };

        // 初始載入
        updateLoadedPhotos();

        // 事件監聽
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [updateLoadedPhotos]);

    // 強制載入前幾張照片
    useEffect(() => {
        const priorityPhotos = new Set([0, 1, 2]); // 前3張優先載入
        setLoadedPhotos(prev => new Set([...prev, ...priorityPhotos]));
    }, []);

    return {
        shouldLoadPhoto,
        loadedPhotosCount: loadedPhotos.size,
        totalPhotos: photoCount
    };
};

// 全域變數聲明（用於時間計算）
declare global {
    interface Window {
        challengesStartTime?: number;
    }
} 