import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ============================
// 型別定義
// ============================
interface UseReportsZoomAnimationOptions {
    // DOM 參考
    sliderWrapperRef: RefObject<HTMLDivElement>;
    zoomOutTweenRef: RefObject<gsap.core.Tween | null>;
    // 狀態
    isClient: boolean;
    isOpeningComplete: boolean;
}

// ============================
// 自訂 Hook 主體
// ============================
export function useReportsZoomAnimation({
    sliderWrapperRef,
    zoomOutTweenRef,
    isClient,
    isOpeningComplete
}: UseReportsZoomAnimationOptions) {
    // ============================
    // 開場後的 Zoom Out 動畫
    // ============================
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient || !isOpeningComplete) return;

        const sliderWrapper = sliderWrapperRef.current;
        const sectionHeading = document.querySelector('#reports-section-heading');
        if (!sliderWrapper) return;

        // 設定初始狀態（40vw）
        gsap.set(sliderWrapper, {
            translateZ: '40vw'
        });

        // 立即鎖定滾動
        document.body.style.overflow = 'hidden';

        // 取得所有報導項目元素
        const reportItems = sliderWrapper.querySelectorAll('[data-report-item]');

        // 建立時間軸來同步所有動畫
        const tl = gsap.timeline();

        // 主要的 zoom out 動畫
        tl.to(sliderWrapper, {
            translateZ: '10vw',
            duration: 3,
            ease: 'power4.out'
        }, 0);

        // 自訂動畫順序（修改這個陣列來改變順序）
        // 範例 1 - 從後往前：[11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        // 範例 2 - 從中間往外：[6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11, 0]
        // 範例 3 - 交錯效果：[0, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6]
        // 範例 4 - 隨機順序：[3, 7, 1, 9, 5, 11, 2, 8, 0, 10, 4, 6]
        // 範例 5 - 自訂順序：[6, 1, 9, 3, 5, 11, 0, 2, 4, 7, 8, 10]
        const animationOrder = [3, 7, 1, 9, 5, 11, 2, 8, 0, 10, 4, 6];

        // 如果項目數量與預設順序不符，自動生成倒序
        const actualOrder = reportItems.length === animationOrder.length
            ? animationOrder
            : Array.from({ length: reportItems.length }, (_, i) => reportItems.length - 1 - i);

        // 為每個項目創建動畫
        actualOrder.forEach((itemIndex, orderIndex) => {
            const item = reportItems[itemIndex];
            if (!item) return; // 防止超出範圍

            const delay = orderIndex * 0.1; // 根據順序位置計算延遲

            tl.to(item, {
                y: 0, // 從 calc(index * 100px) 動畫到 0
                duration: 1.5,
                ease: 'power4.out'
            }, delay);
        });

        // 將 timeline 的第一個 tween 賦值給 ref（修復 TypeScript 錯誤）
        zoomOutTweenRef.current = tl.getChildren()[0] as gsap.core.Tween;

        // 監聽滾動意圖
        let hasTriggeredAnimation = false;
        const handleScrollIntent = () => {
            if (!hasTriggeredAnimation && sectionHeading) {
                hasTriggeredAnimation = true;

                // 手動觸發 ScrollTrigger 的 onEnter 事件
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.trigger === sectionHeading && trigger.vars.onEnter) {
                        trigger.vars.onEnter(trigger);
                    }
                });

                // 移除監聽器
                window.removeEventListener('wheel', handleScrollIntent);
            }
        };

        // 添加滾輪監聽器
        window.addEventListener('wheel', handleScrollIntent, { passive: true });

        // 清理函數
        return () => {
            if (zoomOutTweenRef.current) {
                zoomOutTweenRef.current.kill();
            }
            window.removeEventListener('wheel', handleScrollIntent);
            // 確保清理時解鎖滾動
            document.body.style.overflow = '';
        };
    }, [isClient, isOpeningComplete, sliderWrapperRef, zoomOutTweenRef]);
}