'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { openingPhotosRef, facesPhotosData } from '@/components/sections/opening/OpeningSection';


// 面的類型定義
type FaceType = 'left' | 'right' | 'top' | 'bottom';

// 照片動畫配置
interface PhotoAnimationConfig {
    // 入場動畫配置
    entrance: {
        left: { initialRight: string; targetAttribute: 'right' };
        right: { initialRight: string; targetAttribute: 'right' };
        top: { initialTop: string; targetAttribute: 'top' };
        bottom: { initialTop: string; targetAttribute: 'top' };
    };
    // 離場動畫配置
    exit: {
        left: { targetRight: number };
        right: { targetRight: number };
        top: { targetTop: number };
        bottom: { targetTop: number };
    };
}

// 動畫配置常數
const ANIMATION_CONFIG: PhotoAnimationConfig = {
    entrance: {
        left: { initialRight: '150%', targetAttribute: 'right' },
        right: { initialRight: '-50%', targetAttribute: 'right' },
        top: { initialTop: '-50%', targetAttribute: 'top' },
        bottom: { initialTop: '150%', targetAttribute: 'top' }
    },
    exit: {
        left: { targetRight: -100 },
        right: { targetRight: 150 },
        top: { targetTop: 150 },
        bottom: { targetTop: -100 }
    }
};

// 主動畫時間軸 Hook
export const useMainTimeline = () => {
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const isAnimationStartedRef = useRef(false);
    const retryCountRef = useRef(0);

    // 重置照片到入場前狀態
    const resetPhotosToInitialState = () => {
        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            const faceType = face as FaceType;
            const config = ANIMATION_CONFIG.entrance[faceType];

            photos.forEach((photo, index) => {
                if (photo && facesPhotosData[faceType][index]) {
                    const photoData = facesPhotosData[faceType][index];
                    const initialState: any = {
                        opacity: 0,
                        visibility: 'hidden',
                        pointerEvents: 'none'
                    };

                    // 設定初始位置：從外圍開始
                    if ('initialRight' in config) {
                        initialState.right = config.initialRight;
                        initialState.top = photoData.top; // 保持原有的 top 位置
                    } else if ('initialTop' in config) {
                        initialState.top = config.initialTop;
                        initialState.right = photoData.right; // 保持原有的 right 位置
                    }

                    gsap.set(photo, initialState);
                }
            });
        });
    };

    // 照片入場動畫
    const addPhotosEntranceAnimation = (timeline: gsap.core.Timeline, startTime: number = 0) => {
        // 收集所有面的照片元素
        const allPhotoElements: { element: HTMLImageElement; face: FaceType; index: number }[] = [];

        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            photos.forEach((photo, index) => {
                if (photo) {
                    allPhotoElements.push({
                        element: photo,
                        face: face as FaceType,
                        index
                    });
                }
            });
        });

        if (allPhotoElements.length === 0) return;

        // 為每個照片添加入場動畫
        allPhotoElements.forEach(({ element, face, index }) => {
            const photoData = facesPhotosData[face][index];
            if (photoData) {
                const config = ANIMATION_CONFIG.entrance[face];
                const delay = index * 0.1 + (['right', 'top', 'bottom'].indexOf(face) + 1) * 0.2;

                const animationProps: any = {
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    onStart: () => {
                        gsap.set(element, { visibility: 'visible', pointerEvents: 'auto' });
                    }
                };

                // 根據面的類型設定動畫目標位置
                if (config.targetAttribute === 'right') {
                    animationProps.right = photoData.right;
                } else if (config.targetAttribute === 'top') {
                    animationProps.top = photoData.top;
                }

                // 🎯 動畫時序: PHOTOS_ENTRANCE_START + delay
                timeline.to(element, animationProps, startTime + delay);
            }
        });
    };

    // 照片離場動畫
    const addPhotosExitAnimation = (timeline: gsap.core.Timeline, startTime: number = 0) => {
        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            const faceType = face as FaceType;
            const facePhotos = photos.filter(Boolean);

            facePhotos.forEach((photo, index) => {
                if (photo && facesPhotosData[faceType][index]) {
                    const photoData = facesPhotosData[faceType][index];
                    const exitConfig = ANIMATION_CONFIG.exit[faceType];

                    let animationProps: any = {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => {
                            gsap.set(photo, { visibility: 'hidden', pointerEvents: 'none' });
                        }
                    };

                    // 根據面的類型計算離場位置
                    if ('targetRight' in exitConfig) {
                        animationProps.right = `${exitConfig.targetRight}%`;
                    } else if ('targetTop' in exitConfig) {
                        animationProps.top = `${exitConfig.targetTop}%`;
                    }

                    // 🎯 動畫時序: PHOTOS_EXIT_START
                    timeline.to(photo, animationProps, startTime);
                }
            });
        });
    };

    // 導航動畫
    const addNavigationAnimation = (timeline: gsap.core.Timeline, startTime: number = 0) => {
        const nav = document.querySelector('#main-navigation');
        if (nav) {
            // 設定初始位置（使用 transform 正中央且放大）
            gsap.set(nav, {
                top: '50vh',
                transform: 'translateY(-50%) scale(1.5)'
            });

            // 然後執行動畫到最終位置（頂部且正常大小）
            // 🎯 動畫時序: PHOTOS_EXIT_START - 與照片離場同時進行
            timeline.to(nav,
                {
                    top: '3rem',
                    transform: 'translateY(0) scale(1)',
                    duration: 0.5,
                    ease: 'power3.out'
                },
                startTime
            );
        }
    };

    // Reports 標題淡入動畫
    const addReportsHeadingAnimation = (timeline: gsap.core.Timeline, startTime: number = 0) => {
        const reportsHeading = document.querySelector('#reports-section-heading');
        if (reportsHeading) {
            // 確保初始狀態是隱藏的
            gsap.set(reportsHeading, {
                opacity: 0,
                scale: 0
            });

            // 🎯 動畫時序: REPORTS_HEADING_START - 延遲0.5s後開始
            timeline.to(reportsHeading,
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                },
                startTime
            );
        }
    };

    // 檢查所有必要的 DOM 元素是否存在
    const checkDOMElements = () => {
        const nav = document.querySelector('#main-navigation');
        const reportsHeading = document.querySelector('#reports-section-heading');
        const openingSection = document.querySelector('#section-opening');

        // 檢查照片元素是否存在
        const hasPhotoElements = Object.values(openingPhotosRef.current).some(photos =>
            photos.some(photo => photo !== null)
        );

        return nav && reportsHeading && openingSection && hasPhotoElements;
    };

    // 啟動主動畫時間軸
    const startMainTimeline = () => {
        if (isAnimationStartedRef.current) {
            return;
        }

        // 檢查 DOM 元素是否準備好
        if (!checkDOMElements()) {
            retryCountRef.current++;
            if (retryCountRef.current < 10) { // 最多重試 10 次
                setTimeout(startMainTimeline, 200);
            }
            return;
        }

        // 重置照片狀態
        resetPhotosToInitialState();

        // 創建主時間軸
        const tl = gsap.timeline();

        const TIMELINE_CONFIG = {
            PHOTOS_ENTRANCE_START: 0,    // 照片入場開始時間
            PHOTOS_EXIT_START: 3.0,      // 照片離場開始時間  
            REPORTS_HEADING_START: 3.5,  // Reports標題淡入開始時間
            ANIMATION_END: 4.5           // 動畫結束時間
        };

        // 📸 階段1: 照片入場動畫 (0.0s 開始)
        addPhotosEntranceAnimation(tl, TIMELINE_CONFIG.PHOTOS_ENTRANCE_START);

        // 🚀 階段2: 照片離場 + Nav上移 (3.0s 開始)
        // 注意：移除了 addOpeningSectionFadeOut，保持 3D 立方體容器可見
        addPhotosExitAnimation(tl, TIMELINE_CONFIG.PHOTOS_EXIT_START);     // 照片離場動畫
        addNavigationAnimation(tl, TIMELINE_CONFIG.PHOTOS_EXIT_START);     // Navigation 往上移動

        // 📝 階段3: Reports標題淡入 (3.5s 開始，延遲0.5s)
        addReportsHeadingAnimation(tl, TIMELINE_CONFIG.REPORTS_HEADING_START); // Reports 標題淡入

        timelineRef.current = tl;
        isAnimationStartedRef.current = true;
    };

    // 清理函數
    const cleanup = () => {
        if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
        }
        isAnimationStartedRef.current = false;
    };

    return {
        startMainTimeline,
        cleanup,
        isAnimationStarted: isAnimationStartedRef.current
    };
}; 