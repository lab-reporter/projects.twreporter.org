import React, { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/stores';

// ============================
// 型別定義
// ============================
interface UseReportsScrollAnimationOptions {
    // DOM 參考
    sliderWrapperRef: RefObject<HTMLDivElement | null>;
    currentItemDisplayRef: RefObject<HTMLDivElement | null>;
    zoomOutTweenRef: React.MutableRefObject<gsap.core.Tween | null>;
    // 狀態
    isClient: boolean;
    isOpeningComplete: boolean;
    // 滑鼠追蹤範圍相關
    setMouseRangeMin?: (value: number) => void;
    setMouseRangeMax?: (value: number) => void;
    // 動畫完成的回調
    onAnimationComplete?: () => void;
    // 動畫反向完成的回調
    onAnimationReverseComplete?: () => void;
}

// ============================
// 自訂 Hook 主體
// ============================
export function useReportsScrollAnimation({
    sliderWrapperRef,
    currentItemDisplayRef,
    zoomOutTweenRef,
    isClient,
    isOpeningComplete,
    setMouseRangeMin,
    setMouseRangeMax,
    onAnimationComplete,
    onAnimationReverseComplete
}: UseReportsScrollAnimationOptions) {
    // 取得導航欄控制函數
    const { setNavigationVisible, setSectionNavigationVisible } = useStore();
    // ============================
    // ScrollTrigger 動畫設定
    // ============================
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient) return;

        // 註冊 ScrollTrigger 插件
        gsap.registerPlugin(ScrollTrigger);

        const sliderWrapper = sliderWrapperRef.current;
        const currentItemDisplay = currentItemDisplayRef.current;
        const sectionHeading = document.querySelector('#reports-section-heading');
        const section = document.querySelector('#section-reports');

        if (!sliderWrapper || !sectionHeading || !currentItemDisplay || !section) return;

        // 設定初始狀態
        gsap.set(currentItemDisplay, {
            opacity: 0
        });

        // 創建時間軸動畫（在 ScrollTrigger 外部，以便重複使用）
        const tl = gsap.timeline({ paused: true });

        // 設定動畫內容 - 支援雙向播放
        tl.to(sliderWrapper, {
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
            duration: 1,
            ease: "power2.out",
            onStart: () => {
                // 動畫開始時，停止 zoom out 動畫（如果還在進行中）
                if (zoomOutTweenRef.current && zoomOutTweenRef.current.isActive()) {
                    zoomOutTweenRef.current.kill();
                }
            }
        }, 0)
            .to(sectionHeading, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
            }, 0)
            .to(currentItemDisplay, {
                opacity: 1,
                duration: 0.5,
                delay: 0.5,
                ease: "power2.in"
            }, 0);

        // 追蹤狀態的變量
        let navShown = false;
        let interactionEnabled = false;

        // 建立 ScrollTrigger 動畫 - 使用 scrub 綁定到滾動進度
        const scrollTrigger = ScrollTrigger.create({
            trigger: section, // 使用整個 section 作為觸發器
            start: 'top top', // section 頂部碰到視窗頂部時開始
            end: '+=300', // 滾動 300px 的距離來完成動畫
            scrub: 1, // 平滑跟隨滾動，1 秒的延遲
            markers: true,
            animation: tl,
            onUpdate: (self) => {
                // 根據進度更新狀態
                const progress = self.progress;

                // 在 50% 進度時顯示/隱藏導航
                if (progress > 0.5 && !navShown) {
                    navShown = true;
                    setNavigationVisible(true);
                    setSectionNavigationVisible(true);
                } else if (progress <= 0.5 && navShown) {
                    navShown = false;
                    setNavigationVisible(false);
                    setSectionNavigationVisible(false);
                }

                // 動態調整滑鼠追蹤範圍
                if (setMouseRangeMin && setMouseRangeMax) {
                    const minRange = 30 + (46 - 30) * progress;
                    const maxRange = 70 - (70 - 54) * progress;
                    setMouseRangeMin(minRange);
                    setMouseRangeMax(maxRange);
                }

                // 在 80% 進度時啟用/禁用互動
                if (progress > 0.8 && !interactionEnabled) {
                    interactionEnabled = true;
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                } else if (progress <= 0.8 && interactionEnabled) {
                    interactionEnabled = false;
                    if (onAnimationReverseComplete) {
                        onAnimationReverseComplete();
                    }
                }
            }
        });

        // 清理函數
        return () => {
            tl.kill();
            scrollTrigger.kill();
        };
    }, [isClient, isOpeningComplete, sliderWrapperRef, currentItemDisplayRef, zoomOutTweenRef, setMouseRangeMin, setMouseRangeMax, setNavigationVisible, setSectionNavigationVisible, onAnimationComplete, onAnimationReverseComplete]);
}