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

        // 動畫到最終狀態（10vw）
        zoomOutTweenRef.current = gsap.to(sliderWrapper, {
            translateZ: '10vw',
            duration: 3,
            ease: 'power4.out'
        });

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