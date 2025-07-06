'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

// 開場照片動畫 Hook
export const useOpeningPhotosAnimation = (is3DEnabled: boolean) => {
    const animationRegisteredRef = useRef(false);
    const entranceAnimationPlayedRef = useRef(false);
    const isExitAnimationActiveRef = useRef(false);

    // 重置照片到入場前狀態
    const resetPhotosToInitialState = () => {
        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            const faceType = face as FaceType;
            const config = ANIMATION_CONFIG.entrance[faceType];

            photos.forEach((photo) => {
                if (photo) {
                    const initialState: any = {
                        willChange: 'transform',
                        opacity: 0,
                        visibility: 'hidden',
                        pointerEvents: 'none'
                    };

                    if ('initialRight' in config) {
                        initialState.right = config.initialRight;
                    } else if ('initialTop' in config) {
                        initialState.top = config.initialTop;
                    }

                    gsap.set(photo, initialState);
                }
            });
        });
    };

    // 重置照片到正常狀態（入場動畫完成後的狀態）
    const resetPhotosToNormalState = () => {
        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            const faceType = face as FaceType;

            photos.forEach((photo, index) => {
                if (photo && facesPhotosData[faceType][index]) {
                    const photoData = facesPhotosData[faceType][index];

                    gsap.set(photo, {
                        top: photoData.top,
                        right: photoData.right,
                        opacity: 1,
                        visibility: 'visible',
                        pointerEvents: 'auto',
                        willChange: 'auto'
                    });
                }
            });
        });
    };

    // 入場動畫
    const triggerEntranceAnimation = () => {
        if (!is3DEnabled || entranceAnimationPlayedRef.current || isExitAnimationActiveRef.current) return;

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

        // 停止所有進行中的動畫
        allPhotoElements.forEach(({ element }) => {
            gsap.killTweensOf(element);
        });

        // 設定初始位置
        allPhotoElements.forEach(({ element, face }) => {
            const config = ANIMATION_CONFIG.entrance[face];
            const initialState: any = {
                willChange: 'transform',
                opacity: 0
            };

            if ('initialRight' in config) {
                initialState.right = config.initialRight;
            } else if ('initialTop' in config) {
                initialState.top = config.initialTop;
            }

            gsap.set(element, initialState);
        });

        // 執行入場動畫
        gsap.delayedCall(0.5, () => {
            allPhotoElements.forEach(({ element, face, index }) => {
                const photoData = facesPhotosData[face][index];
                if (photoData) {
                    const animationProps: any = {
                        opacity: 1,
                        duration: 1,
                        delay: index * 0.1 + (['right', 'top', 'bottom'].indexOf(face) + 1) * 0.2,
                        ease: 'power3.out',
                        onComplete: () => {
                            gsap.set(element, {
                                willChange: 'auto',
                                visibility: 'visible',
                                pointerEvents: 'auto'
                            });
                        }
                    };

                    // 根據面的類型設定動畫目標位置
                    const config = ANIMATION_CONFIG.entrance[face];
                    if (config.targetAttribute === 'right') {
                        animationProps.right = photoData.right;
                    } else if (config.targetAttribute === 'top') {
                        animationProps.top = photoData.top;
                    }

                    gsap.to(element, animationProps);
                }
            });

            entranceAnimationPlayedRef.current = true;
        });
    };

    // 離場動畫處理函數
    const handleExitAnimation = (progress: number) => {
        if (progress < 0 || progress > 1) return;

        isExitAnimationActiveRef.current = progress > 0;

        // 統一處理所有面的照片
        Object.entries(openingPhotosRef.current).forEach(([face, photos]) => {
            const faceType = face as FaceType;
            const facePhotos = photos.filter(Boolean);

            facePhotos.forEach((photo, index) => {
                if (photo && facesPhotosData[faceType][index]) {
                    const photoData = facesPhotosData[faceType][index];
                    const exitConfig = ANIMATION_CONFIG.exit[faceType];

                    let animationProps: any = {
                        opacity: 1 - progress,
                        visibility: progress >= 0.99 ? 'hidden' : 'visible',
                        pointerEvents: progress >= 0.99 ? 'none' : 'auto'
                    };

                    // 根據面的類型計算離場位置
                    if ('targetRight' in exitConfig) {
                        const originalRight = parseFloat(photoData.right.replace('%', ''));
                        const animatedRight = originalRight + (exitConfig.targetRight - originalRight) * progress;
                        animationProps.right = `${animatedRight}%`;
                    } else if ('targetTop' in exitConfig) {
                        const originalTop = parseFloat(photoData.top.replace('%', ''));
                        const animatedTop = originalTop + (exitConfig.targetTop - originalTop) * progress;
                        animationProps.top = `${animatedTop}%`;
                    }

                    gsap.set(photo, animationProps);
                }
            });
        });
    };

    // 註冊滾動觸發的離場動畫
    useEffect(() => {
        if (typeof window === 'undefined' || animationRegisteredRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        // 創建一個節流版本的動畫處理函數
        let lastUpdateTime = 0;
        const throttledHandleExitAnimation = (progress: number) => {
            const now = Date.now();
            if (now - lastUpdateTime > 16) { // 約 60fps
                handleExitAnimation(progress);
                lastUpdateTime = now;
            }
        };

        // 創建專門的 ScrollTrigger 來處理照片離場動畫
        ScrollTrigger.create({
            trigger: '#section-reports',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
            id: 'opening-photos-exit',
            onUpdate: (self) => {
                throttledHandleExitAnimation(self.progress);
            },
            onLeave: () => {
                // 確保離場動畫完成
                handleExitAnimation(1);
            },
            onEnterBack: () => {
                // 回滾時重置到正常狀態
                resetPhotosToNormalState();
                isExitAnimationActiveRef.current = false;
            }
        });

        animationRegisteredRef.current = true;

        return () => {
            ScrollTrigger.getById('opening-photos-exit')?.kill();
            animationRegisteredRef.current = false;
        };
    }, []);

    // 重置動畫狀態的函數
    const resetAnimationState = () => {
        entranceAnimationPlayedRef.current = false;
        isExitAnimationActiveRef.current = false;
        resetPhotosToInitialState();
    };

    return {
        triggerEntranceAnimation,
        handleExitAnimation,
        resetAnimationState,
        resetPhotosToInitialState,
        resetPhotosToNormalState
    };
}; 