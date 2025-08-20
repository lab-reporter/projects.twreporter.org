import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/stores';

// ============================
// 型別定義
// ============================
interface UseReportsAnimationOptions {
    // DOM 參考
    sliderWrapperRef: RefObject<HTMLDivElement | null>;
    currentItemDisplayRef: RefObject<HTMLDivElement | null>;
    // 狀態
    isClient: boolean;
    isOpeningComplete: boolean;
    // 新增：是否為桌面版，只有桌面版才執行動畫
    isDesktop: boolean;
    // 滑鼠追蹤範圍相關
    setMouseRangeMin?: (value: number) => void;
    setMouseRangeMax?: (value: number) => void;
    // 動畫完成的回調
    onAnimationComplete?: () => void;
    // 動畫反向完成的回調
    onAnimationReverseComplete?: () => void;
}

// ============================
// 自訂 Hook 主體 - 整合 Zoom 和 Scroll 動畫
// ============================
export function useReportsAnimation({
    sliderWrapperRef,
    currentItemDisplayRef,
    isClient,
    isOpeningComplete,
    isDesktop,
    setMouseRangeMin,
    setMouseRangeMax,
    onAnimationComplete,
    onAnimationReverseComplete
}: UseReportsAnimationOptions) {
    // 取得導航欄控制函數
    const { setNavigationVisible, setSectionNavigationVisible } = useStore();

    // ============================
    // 整合的 ScrollTrigger 動畫設定
    // ============================
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        // 重要：只有在桌面版才執行動畫，手機版跳過以節省效能
        if (typeof window === 'undefined' || !isClient || !isOpeningComplete || !isDesktop) return;

        // 註冊 ScrollTrigger 插件
        gsap.registerPlugin(ScrollTrigger);

        // 取得所需的 DOM 元素
        const sliderWrapper = sliderWrapperRef.current;
        const currentItemDisplay = currentItemDisplayRef.current;
        const sectionHeading = document.querySelector('#reports-section-heading');
        const section = document.querySelector('#section-reports');

        if (!sliderWrapper || !currentItemDisplay || !sectionHeading || !section) return;

        // ============================
        // 設定初始狀態
        // ============================

        // 設定 sliderWrapper 初始狀態（最遠位置，保持現有的 rotateY 值）
        gsap.set(sliderWrapper, {
            translateZ: '40vw',
            rotateX: 90
            // 不設定 rotateY，保持用戶當前的 swiper 狀態
        });

        // 設定當前項目顯示區初始狀態
        gsap.set(currentItemDisplay, {
            opacity: 0
        });

        // 設定章節標題初始狀態（初始為透明）
        gsap.set(sectionHeading, {
            opacity: 0
        });

        // 取得所有報導項目元素
        const reportItems = sliderWrapper.querySelectorAll('[data-report-item]');

        // 設定每個項目的初始位置（Y 軸偏移）
        reportItems.forEach((item, index) => {
            gsap.set(item, {
                y: index * 100 // 每個項目向下偏移 100px
            });
        });

        // ============================
        // 創建統一的 Timeline 管理所有動畫
        // ============================
        const masterTimeline = gsap.timeline({ paused: true });

        // 自訂動畫順序
        const animationOrder = [3, 7, 1, 9, 5, 11, 2, 8, 0, 10, 4, 6];
        const actualOrder = reportItems.length === animationOrder.length
            ? animationOrder
            : Array.from({ length: reportItems.length }, (_, i) => reportItems.length - 1 - i);

        // ============================
        // 階段 0（0-0.25）：章節標題淡入
        // ============================

        // sectionHeading 淡入
        masterTimeline.to(sectionHeading, {
            opacity: 1,
            duration: 0.25,
            ease: 'power4.out'
        }, 0);

        // ============================
        // 階段 1（0-0.5）：Zoom Out 動畫
        // ============================

        // sliderWrapper 從 40vw zoom 到 10vw（保持 rotateX: 90）
        masterTimeline.to(sliderWrapper, {
            translateZ: '10vw',
            duration: 0.5,
            ease: 'none'
        }, 0);

        // 各個項目依序從下方滑入
        actualOrder.forEach((itemIndex, orderIndex) => {
            const item = reportItems[itemIndex];
            if (!item) return;

            const startTime = orderIndex * 0.025; // 在前 0.5 秒內完成所有項目動畫

            masterTimeline.to(item, {
                y: 0,
                duration: 0.25,
                ease: 'none'
            }, startTime);
        });

        // ============================
        // 階段 2（0.5-1.0）：Rotation 動畫
        // ============================

        // sliderWrapper 旋轉並最終 zoom 到 0（不控制 rotateY，讓 swiper 邏輯處理）
        masterTimeline.to(sliderWrapper, {
            rotateX: 0,
            translateZ: 0,
            duration: 0.5,
            ease: 'none'
        }, 0.5); // 從 0.5 秒開始

        // 章節標題淡出（在旋轉開始時淡出）
        masterTimeline.to(sectionHeading, {
            opacity: 0,
            duration: 0.25,
            ease: 'none'
        }, 0.5);

        // 當前項目資訊淡入
        masterTimeline.to(currentItemDisplay, {
            opacity: 1,
            duration: 0.25,
            ease: 'none'
        }, 0.75);

        // 追蹤狀態的變量
        let navShown = false;
        let interactionEnabled = false;

        // ============================
        // 創建單一的 ScrollTrigger 控制整個動畫
        // ============================
        const scrollTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=300', // 總共 600px 完成所有動畫
            scrub: 0.5,
            animation: masterTimeline,
            // markers: true,
            onUpdate: (self) => {
                const progress = self.progress;

                // 在 75% 進度時（對應第二階段中間）顯示/隱藏導航
                if (progress > 0.75 && !navShown) {
                    navShown = true;
                    setNavigationVisible(true);
                    setSectionNavigationVisible(true);
                } else if (progress <= 0.75 && navShown) {
                    navShown = false;
                    setNavigationVisible(false);
                    setSectionNavigationVisible(false);
                }

                // 動態調整滑鼠追蹤範圍（在第二階段進行）
                if (setMouseRangeMin && setMouseRangeMax) {
                    if (progress > 0.5) {
                        // 只在第二階段（0.5-1.0）調整
                        const secondPhaseProgress = (progress - 0.5) * 2; // 將 0.5-1.0 映射到 0-1
                        const minRange = 30 + (46 - 30) * secondPhaseProgress;
                        const maxRange = 70 - (70 - 54) * secondPhaseProgress;
                        setMouseRangeMin(minRange);
                        setMouseRangeMax(maxRange);
                    } else {
                        // 第一階段保持初始值
                        setMouseRangeMin(30);
                        setMouseRangeMax(70);
                    }
                }

                // 在 90% 進度時啟用/禁用互動
                if (progress > 0.9 && !interactionEnabled) {
                    interactionEnabled = true;
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                } else if (progress <= 0.9 && interactionEnabled) {
                    interactionEnabled = false;
                    if (onAnimationReverseComplete) {
                        onAnimationReverseComplete();
                    }
                }
            }
        });

        // ============================
        // 清理函數
        // ============================
        return () => {
            scrollTrigger.kill();
            masterTimeline.kill();
        };
    }, [
        isClient,
        isOpeningComplete,
        isDesktop,
        sliderWrapperRef,
        currentItemDisplayRef,
        setMouseRangeMin,
        setMouseRangeMax,
        setNavigationVisible,
        setSectionNavigationVisible,
        onAnimationComplete,
        onAnimationReverseComplete
    ]);
}