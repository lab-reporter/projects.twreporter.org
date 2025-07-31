'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import Image from 'next/image';

// ============================
// 型別定義區塊
// ============================
interface NotFoundImageItem {
    path: string;
    title: string;
    bgColor?: string;
}

// ============================
// NotFoundItem 組件 (類似 ReportsSwiperItem)
// ============================
interface NotFoundItemProps {
    path: string;
    title: string;
    bgColor?: string;
    shouldPlay?: boolean;
}

function NotFoundItem({
    path,
    title,
    bgColor,
    shouldPlay = false
}: NotFoundItemProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isVideo = path.endsWith('.mp4') || path.endsWith('.webm');

    useEffect(() => {
        setIsLoading(true);
    }, [path]);


    const handleMediaLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isVideo && videoRef.current && !isLoading) {
            const video = videoRef.current;
            video.muted = true;
            video.loop = true;

            if (shouldPlay) {
                const startPlayback = () => {
                    video.play().catch(() => { });
                };

                if (video.readyState >= 2) {
                    startPlayback();
                } else {
                    video.addEventListener('canplay', startPlayback, { once: true });
                }
            } else {
                video.pause();
                video.currentTime = 0;
            }
        }
    }, [isVideo, isLoading, shouldPlay]);


    return (
        <div
            className="relative w-full h-full rounded-sm overflow-hidden group bg-gray-100 select-none"
            style={{
                backgroundColor: bgColor || '#F1F1F1',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            <div className="w-full h-full overflow-hidden relative bg-white select-none" style={{ cursor: 'none', userSelect: 'none' }}>
                {isVideo ? (
                    <video
                        ref={videoRef}
                        src={path}
                        className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out select-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        style={{ cursor: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={handleMediaLoad}
                        draggable={false}
                    />
                ) : (
                    <Image
                        src={path}
                        alt={title}
                        width={500}
                        height={500}
                        quality={75}
                        className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out select-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        style={{ cursor: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                        onLoad={handleMediaLoad}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        draggable={false}
                    />
                )}
            </div>
        </div>
    );
}


// ============================
// 主要 NotFound 組件
// ============================
// 固定的圖片路徑陣列
const imageData: NotFoundImageItem[] = [
    { path: '/assets/reports/reports-1.webp', title: '綁債．黑工．留學陷阱', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-2.webm', title: '山頭上的掐奪', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-3.webm', title: '造假．剝削．血淚漁場', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-4.webp', title: '廢墟裡的少年', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-5.webp', title: '六輕營運20年', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-6.webp', title: '死嬰百場', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-7.webm', title: '移工：我不回去了', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-8.webm', title: '軍秘帽', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-9.webp', title: '資安風暴', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-10.webp', title: '少子化海嘯', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-11.webp', title: '戒嚴時代', bgColor: '#F1F1F1' },
    { path: '/assets/reports/reports-12.webm', title: '清官難為', bgColor: '#F1F1F1' }
];

export default function NotFound() {
    // ============================
    // DOM 參考區塊
    // ============================
    const sliderWrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    // ============================
    // 本地狀態區塊
    // ============================
    const [isClient, setIsClient] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1024);

    // ============================
    // 自訂 Hooks 區塊
    // ============================
    const { elementRef: observerRef, isVisible } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '100px'
    });

    const mousePosition = useMouseTracking3D({
        enabled: isClient && isVisible,
        rangeMin: 30,  // 固定值，zoom 後的狀態
        rangeMax: 70,  // 固定值，zoom 後的狀態
        useLerp: true,
        lerpFactor: 0.1
    });

    // ============================
    // 工具函數區塊
    // ============================
    const getResponsiveValues = (width: number) => {
        if (width < 640) {
            return { sliderSize: 10.5 };
        } else if (width < 768) {
            return { sliderSize: 9 };
        } else if (width < 1024) {
            return { sliderSize: 8 };
        } else if (width < 1280) {
            return { sliderSize: 7 };
        } else if (width < 1536) {
            return { sliderSize: 5 };
        } else {
            return { sliderSize: 4 };
        }
    };

    const shouldPlayVideo = (_index: number) => {
        // 在 404 頁面中，所有影片都應該播放
        return true;
    };

    // ============================
    // 計算值區塊
    // ============================
    const { sliderSize } = getResponsiveValues(isClient ? windowWidth : 1024);


    // 404 頁面專屬的 zoom 動畫
    useEffect(() => {
        if (typeof window === 'undefined' || !isClient) return;

        const sliderWrapper = sliderWrapperRef.current;
        if (!sliderWrapper) return;

        // 設定初始狀態（40vw）
        gsap.set(sliderWrapper, {
            translateZ: '40vw'
        });

        // 取得所有報導項目元素
        const reportItems = sliderWrapper.querySelectorAll('[data-report-item]');

        // 建立時間軸來同步所有動畫
        const tl = gsap.timeline({ delay: 0.5 }); // 延遲 0.5 秒開始

        // 主要的 zoom out 動畫
        tl.to(sliderWrapper, {
            translateZ: '5vw',
            duration: 3,
            ease: 'power4.out'
        }, 0);

        // 自訂動畫順序
        const animationOrder = [3, 7, 1, 9, 5, 11, 2, 8, 0, 10, 4, 6];

        // 如果項目數量與預設順序不符，自動生成倒序
        const actualOrder = reportItems.length === animationOrder.length
            ? animationOrder
            : Array.from({ length: reportItems.length }, (_, i) => reportItems.length - 1 - i);

        // 為每個項目創建動畫
        actualOrder.forEach((itemIndex, orderIndex) => {
            const item = reportItems[itemIndex];
            if (!item) return;

            const delay = orderIndex * 0.1; // 根據順序位置計算延遲

            tl.to(item, {
                y: 0, // 從 calc(index * 100px) 動畫到 0
                duration: 1.5,
                ease: 'power4.out'
            }, delay);
        });

        // 清理函數
        return () => {
            tl.kill();
        };
    }, [isClient]);

    // ============================
    // Effects 區塊
    // ============================
    useEffect(() => {
        setIsClient(true);

        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }

        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setWindowWidth(window.innerWidth);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !isClient) return;

        const sliderWrapper = sliderWrapperRef.current;
        const section = sectionRef.current;
        const sliderContainer = sliderContainerRef.current;

        if (!section || !sliderWrapper || !sliderContainer) return;

        gsap.set(sliderContainer, {
            opacity: 1,
            scale: 1
        });

        gsap.set(sliderWrapper, {
            rotateY: 0
        });
    }, [isClient]);

    // ============================
    // 渲染區塊
    // ============================
    return (
        <div ref={(el) => {
            if (sectionRef) (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            if (observerRef) (observerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }} className="relative h-screen overflow-visible bg-black">
            <div className="sticky top-0 w-full h-screen">
                <div
                    ref={sliderContainerRef}
                    className="absolute w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                    style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    }}
                >
                    <div className="w-full h-screen text-center overflow-hidden"
                        style={{
                            transform: 'translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
                            transformStyle: 'preserve-3d',
                            perspective: `${sliderSize * 9}vw`,
                            perspectiveOrigin: isClient && isVisible
                                ? `${mousePosition.x}% ${mousePosition.y}%`
                                : 'center center'
                        }}
                    >
                        <div
                            ref={sliderWrapperRef}
                            className="absolute z-10"
                            style={{
                                top: `calc(50% - ${sliderSize * 1}vw)`,
                                left: `calc(50% - ${sliderSize * 1.5}vw)`,
                                width: `${sliderSize * 3}vw`,
                                height: `${sliderSize * 2}vw`,
                                transformStyle: 'preserve-3d',
                                transform: `translateZ(5vw) rotateX(90deg) rotateY(0deg) rotateZ(0deg)`
                            }}
                        >
                            {imageData.map((item, index) => (
                                <div
                                    key={index}
                                    data-report-item
                                    className="absolute inset-0"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: `translateY(calc(${index} * 100px)) rotateY(calc(${index} * (360 / ${imageData.length}) * 1deg)) rotateZ(0deg) translateZ(${sliderSize * 6}vw)`,
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <NotFoundItem
                                        path={item.path}
                                        title={item.title}
                                        bgColor={item.bgColor}
                                        shouldPlay={shouldPlayVideo(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 404 資訊和返回按鈕 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="text-center pointer-events-auto bg-black/50 backdrop-blur-sm p-12 rounded-2xl">
                        <h1 className="text-8xl font-bold mb-4 text-white">404</h1>
                        <p className="text-2xl mb-8 text-white/80">頁面不存在</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 font-medium text-lg shadow-lg"
                        >
                            返回首頁
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}