import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';


// ============================
// 型別定義
// ============================
interface UseDragSwiperOptions {
    // 總項目數量
    totalItems: number;
    // 每個項目的角度
    anglePerItem: number;
    // 觸發切換的最小拖曳距離
    dragThreshold?: number;
    // 輪播容器的 DOM 參考
    sliderWrapper: HTMLDivElement | null;
    // 輪播展示容器的 DOM 參考
    sliderContainer: HTMLDivElement | null;
    // 當前的輪播索引
    currentSlide: number;
    // 設定當前輪播索引的函數
    setCurrentSlide: (index: number) => void;
    // 是否已啟用（客戶端初始化）
    enabled: boolean;
}

interface DragState {
    // 是否正在拖曳
    isDragging: boolean;
    // 拖曳開始的 X 座標
    startX: number;
    startY: number;
    // 拖曳的距離
    dragDelta: number;
    // 預覽時的項目索引
    previewSlide: number;
}

// ============================
// 自訂 Hook 主體
// ============================
export function useDragSwiper({
    totalItems,
    anglePerItem,
    dragThreshold = 50,
    sliderWrapper,
    sliderContainer,
    currentSlide,
    setCurrentSlide,
    enabled
}: UseDragSwiperOptions) {
    // ============================
    // 狀態管理
    // ============================
    // 拖曳相關狀態
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        dragDelta: 0,
        previewSlide: currentSlide
    });

    // ============================
    // Refs 用於效能優化
    // ============================
    // 使用 ref 來存儲不需要觸發重新渲染的值
    const currentSlideRef = useRef(currentSlide);
    const dragStateRef = useRef(dragState);

    // 更新 refs
    useEffect(() => {
        currentSlideRef.current = currentSlide;
    }, [currentSlide]);

    useEffect(() => {
        dragStateRef.current = dragState;
    }, [dragState]);

    // ============================
    // 輔助函數
    // ============================
    // 切換到指定索引的函數（支援最短路徑旋轉）
    const goToSlide = useCallback((index: number, preferredDirection?: 'left' | 'right') => {
        if (!sliderWrapper) return;

        // 確保索引在有效範圍內
        const validIndex = ((index % totalItems) + totalItems) % totalItems;

        // 計算當前角度和目標角度
        const currentRotation = -(currentSlideRef.current * anglePerItem);
        const targetRotation = -validIndex * anglePerItem;

        // 計算最短路徑
        let rotationDiff = targetRotation - currentRotation;

        // 調試信息
        if (process.env.NODE_ENV === 'development') {
            const forwardSteps = (validIndex - currentSlideRef.current + totalItems) % totalItems;
            const backwardSteps = (currentSlideRef.current - validIndex + totalItems) % totalItems;

            console.log(`🔄 旋轉路徑計算: ${currentSlideRef.current}→${validIndex}`, {
                正向步數: forwardSteps,
                反向步數: backwardSteps,
                當前角度: `${currentRotation}°`,
                偏好方向: preferredDirection || '最短路徑'
            });
        }

        // 如果有偏好方向，確保按照該方向旋轉
        if (preferredDirection === 'left') {
            // 向左拖曳，逆時針旋轉（負方向）
            if (rotationDiff > 0) {
                rotationDiff -= 360;
            }
        } else if (preferredDirection === 'right') {
            // 向右拖曳，順時針旋轉（正方向）
            if (rotationDiff < 0) {
                rotationDiff += 360;
            }
        } else {
            // 沒有偏好方向時，選擇最短路徑
            // 修正：基於視覺上的最短距離
            // 計算正向和反向的步數
            const forwardSteps = (validIndex - currentSlideRef.current + totalItems) % totalItems;
            const backwardSteps = (currentSlideRef.current - validIndex + totalItems) % totalItems;

            // 選擇步數較少的方向
            if (forwardSteps === 0) {
                // 已經在目標位置
                rotationDiff = 0;
            } else if (forwardSteps <= backwardSteps) {
                // 正向步數較少或相等，向左旋轉輪播容器（負角度）
                rotationDiff = -(forwardSteps * anglePerItem);
            } else {
                // 反向步數較少，向右旋轉輪播容器（正角度）  
                rotationDiff = backwardSteps * anglePerItem;
            }
        }

        // 計算最終的旋轉角度
        const finalRotation = currentRotation + rotationDiff;

        // 調試信息
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 最終旋轉: ${rotationDiff > 0 ? '順時針' : '逆時針'} ${Math.abs(rotationDiff)}°`, {
                修正後差異: `${rotationDiff}°`,
                最終角度: `${finalRotation}°`,
                duration: '0.6s'
            });
        }

        gsap.to(sliderWrapper, {
            rotateY: finalRotation,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "rotateY", // 只覆蓋 rotateY 屬性，保留其他變換（如 rotateX, translateZ）
            onStart: () => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('🚀 動畫開始:', `${currentRotation}° → ${finalRotation}°`);
                }
                // 動畫期間添加一個標記，防止意外的頁面跳轉
                document.body.setAttribute('data-swiper-animating', 'true');


            },
            onComplete: () => {
                // 動畫完成後，標準化角度（只設定 rotateY，保留其他變換）
                gsap.set(sliderWrapper, {
                    rotateY: targetRotation
                });
                // 移除動畫標記
                document.body.removeAttribute('data-swiper-animating');



                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ 動畫完成:', `標準化到 ${targetRotation}°`);
                }
            }
        });

        setCurrentSlide(validIndex);
    }, [sliderWrapper, totalItems, anglePerItem, setCurrentSlide]);

    // ============================
    // 事件處理函數
    // ============================
    // 滑鼠/觸控開始事件處理
    const handleStart = useCallback((clientX: number, clientY: number) => {
        setDragState(prev => ({
            ...prev,
            isDragging: true,
            startX: clientX,
            startY: clientY,
            dragDelta: 0,
            previewSlide: currentSlideRef.current
        }));
    }, []);

    // 滑鼠/觸控移動事件處理
    const handleMove = useCallback((clientX: number) => {
        const state = dragStateRef.current;
        if (!state.isDragging || !sliderWrapper) return;

        const delta = clientX - state.startX;

        // 使用視窗寬度的 20% 作為一個項目的拖曳距離
        const vwToPixels = window.innerWidth * 0.2; // 20vw

        // 計算預覽的項目索引（最多 5 個）
        let itemsDelta = Math.round(delta / vwToPixels);
        itemsDelta = Math.max(-5, Math.min(5, itemsDelta)); // 限制在 -5 到 5 之間

        let tempIndex = currentSlideRef.current - itemsDelta; // 向右為正，所以要減

        // 確保索引在有效範圍內（支援循環）
        tempIndex = ((tempIndex % totalItems) + totalItems) % totalItems;

        // 即時旋轉預覽（調整係數讓預覽更貼近實際切換效果）
        // 每 20vw 對應一個項目的旋轉角度
        const rotationDelta = (delta / vwToPixels) * anglePerItem;
        const tempRotation = -(currentSlideRef.current * anglePerItem) + rotationDelta;

        gsap.set(sliderWrapper, {
            rotateY: tempRotation,
            overwrite: 'auto'
        });

        setDragState(prev => ({
            ...prev,
            dragDelta: delta,
            previewSlide: tempIndex
        }));
    }, [sliderWrapper, totalItems, anglePerItem]);

    // 滑鼠/觸控結束事件處理
    const handleEnd = useCallback(() => {
        const state = dragStateRef.current;
        if (!state.isDragging) return;

        // 根據拖曳距離計算要切換幾個項目
        const dragDistance = Math.abs(state.dragDelta);

        if (dragDistance > dragThreshold) {
            // 使用視窗寬度的 20% 作為一個項目的拖曳距離
            const vwToPixels = window.innerWidth * 0.2; // 20vw

            // 計算要切換的項目數量（每 20vw 切換一個項目，最多 5 個）
            let itemsToSwitch = Math.floor(dragDistance / vwToPixels) || 1;
            itemsToSwitch = Math.min(5, itemsToSwitch); // 限制最多切換 5 個

            if (state.dragDelta > 0) {
                // 向右滑動，切換到前面的項目，旋轉方向為右
                const newIndex = (currentSlideRef.current - itemsToSwitch + totalItems) % totalItems;
                goToSlide(newIndex, 'right');
            } else {
                // 向左滑動，切換到後面的項目，旋轉方向為左
                const newIndex = (currentSlideRef.current + itemsToSwitch) % totalItems;
                goToSlide(newIndex, 'left');
            }
        } else {
            // 滑動距離不足，回到當前項目
            goToSlide(currentSlideRef.current);
        }

        setDragState(prev => ({
            ...prev,
            isDragging: false,
            dragDelta: 0,
            previewSlide: currentSlideRef.current
        }));
    }, [dragThreshold, totalItems, goToSlide]);

    // ============================
    // 事件綁定 Effect
    // ============================
    useEffect(() => {
        if (!enabled || !sliderContainer) return;

        // 滑鼠事件監聽
        const handleMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const handleMouseUp = () => handleEnd();

        // 觸控事件監聽
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const state = dragStateRef.current;
                const deltaX = touch.clientX - state.startX;
                const deltaY = touch.clientY - state.startY;
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault();
                }
                handleMove(touch.clientX);
            }
        };
        const handleTouchEnd = () => handleEnd();

        // 註冊事件監聽器
        sliderContainer.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // 觸控事件
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        sliderContainer.addEventListener('touchend', handleTouchEnd);

        // 清理函數
        return () => {
            sliderContainer.removeEventListener('mousedown', handleMouseDown);
            sliderContainer.removeEventListener('touchstart', handleTouchStart);
            sliderContainer.removeEventListener('touchmove', handleTouchMove);
            sliderContainer.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [enabled, sliderContainer, handleStart, handleMove, handleEnd]);

    // ============================
    // 返回值
    // ============================
    return {
        // 拖曳狀態
        isDragging: dragState.isDragging,
        dragDelta: dragState.dragDelta,
        previewSlide: dragState.previewSlide,
        // 手動控制函數
        goToSlide
    };
}