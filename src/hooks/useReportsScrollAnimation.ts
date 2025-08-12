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
    onAnimationComplete
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

        if (!sliderWrapper || !sectionHeading || !currentItemDisplay) return;

        // 設定初始狀態
        gsap.set(currentItemDisplay, {
            opacity: 0
        });

        // 創建時間軸動畫（在 ScrollTrigger 外部，以便重複使用）
        const tl = gsap.timeline({ paused: true });

        // 設定動畫內容 - 只往前播放，不需要反向
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

                // 顯示導航欄和章節導航
                setNavigationVisible(true);
                setSectionNavigationVisible(true);

                // 立即開始動畫化滑鼠追蹤範圍
                if (setMouseRangeMin && setMouseRangeMax) {
                    const animationValues = { min: 30, max: 70 };
                    gsap.to(animationValues, {
                        min: 46,
                        max: 54,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onUpdate: () => {
                            setMouseRangeMin(animationValues.min);
                            setMouseRangeMax(animationValues.max);
                        }
                    });
                }

                // 動畫完成後直接啟用互動
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            },
            onComplete: () => {
                // 所有動畫完成後，延遲 0.5 秒解鎖滾動
                setTimeout(() => {
                    // 解鎖滾動（因為 useReportsZoomAnimation 鎖定了滾動）
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.top = '';
                    document.body.style.left = '';
                }, 500);
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

        // 建立 ScrollTrigger 動畫
        const scrollTrigger = ScrollTrigger.create({
            trigger: sectionHeading,
            start: 'top top',
            toggleActions: "none", // 禁用自動觸發
            onEnter: () => {
                // 向下滾動進入時，正向播放
                tl.play();

                // 如果動畫被中斷，確保 opacity 最終到達正確狀態
                gsap.to(sectionHeading, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                gsap.to(currentItemDisplay, {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.5,
                    ease: "power2.in",
                    overwrite: "auto"
                });
            }
            // 移除所有反向播放相關的事件
        });

        // 清理函數
        return () => {
            tl.kill();
            scrollTrigger.kill();
        };
    }, [isClient, isOpeningComplete, sliderWrapperRef, currentItemDisplayRef, zoomOutTweenRef, setMouseRangeMin, setMouseRangeMax, setNavigationVisible, setSectionNavigationVisible, onAnimationComplete]);
}