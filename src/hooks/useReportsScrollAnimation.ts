import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ============================
// 型別定義
// ============================
interface UseReportsScrollAnimationOptions {
    // DOM 參考
    sliderWrapperRef: RefObject<HTMLDivElement>;
    currentItemDisplayRef: RefObject<HTMLDivElement>;
    zoomOutTweenRef: RefObject<gsap.core.Tween | null>;
    // 狀態
    isClient: boolean;
    isOpeningComplete: boolean;
    // 模糊背景相關
    hasShownBlurOverlayRef: RefObject<boolean>;
    setShowBlurOverlay: (show: boolean) => void;
    setBlurOverlayOpacity: (opacity: number) => void;
    // 滑鼠追蹤範圍相關
    setMouseRangeMin?: (value: number) => void;
    setMouseRangeMax?: (value: number) => void;
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
    hasShownBlurOverlayRef,
    setShowBlurOverlay,
    setBlurOverlayOpacity,
    setMouseRangeMin,
    setMouseRangeMax
}: UseReportsScrollAnimationOptions) {
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

                // 同步顯示模糊背景
                if (!hasShownBlurOverlayRef.current) {
                    hasShownBlurOverlayRef.current = true;
                    setShowBlurOverlay(true);
                    // 鎖定滾動
                    document.body.style.overflow = 'hidden';

                    // 0.5秒淡入
                    setTimeout(() => {
                        setBlurOverlayOpacity(1);
                    }, 50);

                    // 2.5秒後開始淡出
                    setTimeout(() => {
                        setBlurOverlayOpacity(0);
                    }, 2500);

                    // 3秒後完全隱藏並解鎖滾動
                    setTimeout(() => {
                        setShowBlurOverlay(false);
                        // 解鎖滾動
                        document.body.style.overflow = '';
                    }, 3000);
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
    }, [isClient, isOpeningComplete, hasShownBlurOverlayRef, setShowBlurOverlay, setBlurOverlayOpacity, sliderWrapperRef, currentItemDisplayRef, zoomOutTweenRef, setMouseRangeMin, setMouseRangeMax]);
}