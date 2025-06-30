'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '@/app/data/projects.json';

interface ReportItem {
    id: string;
    path: string;
    title: string;
    subtitle: string;
    section: string[];
    bgColor?: string;
}

export default function ReportsSwiper() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderWrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    // 響應式 slider 尺寸變數
    const sliderSize = windowWidth < 768 ? 6 : 4;

    // 響應式 translateZ 倍數
    const translateZMultiplier = windowWidth < 768 ? 6 : 6;

    // 過濾出 reports section 的項目
    const reportsData: ReportItem[] = projectsData.filter((item: any) =>
        item.section.includes('reports')
    );

    // 監聽視窗大小變化
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const slider = sliderRef.current;
        const sliderWrapper = sliderWrapperRef.current;
        const section = sectionRef.current;
        const sliderContainer = sliderContainerRef.current;

        if (!slider || !section || !sliderWrapper || !sliderContainer) return;

        // 設定初始狀態
        gsap.set(sliderContainer, {
            opacity: 1,
            scale: 1
        });

        // 清除先前可能存在的項目
        while (slider.firstChild) {
            slider.removeChild(slider.firstChild);
        }

        // 創建項目
        reportsData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'absolute inset-0 cursor-pointer';
            itemElement.style.transformStyle = 'preserve-3d';
            itemElement.style.transform = `rotateY(calc(${index} * (360 / ${reportsData.length}) * 1deg)) translateZ(${sliderSize * translateZMultiplier}vw)`;
            itemElement.style.width = '100%';
            itemElement.style.height = '100%';

            // 檢查是否為影片
            const isVideo = item.path.endsWith('.mp4');
            let mediaElement: HTMLElement;

            if (isVideo) {
                const video = document.createElement('video');
                video.src = item.path;
                video.className = 'w-full h-full object-cover';
                video.autoplay = false;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.controls = false;

                video.addEventListener('loadeddata', () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ 影片載入完成: ${item.title}`);
                    }
                });

                video.addEventListener('error', (e) => {
                    console.error(`❌ 影片載入失敗: ${item.title}`, e);
                });

                mediaElement = video;
            } else {
                const img = document.createElement('img');
                img.src = item.path;
                img.alt = item.title;
                img.className = 'w-full h-full object-cover';

                img.addEventListener('load', () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ 圖片載入完成: ${item.title}`);
                    }
                });

                img.addEventListener('error', (e) => {
                    console.error(`❌ 圖片載入失敗: ${item.title}`, e);
                });

                mediaElement = img;
            }

            itemElement.appendChild(mediaElement);
            slider.appendChild(itemElement);
        });

        // 使用 ScrollTrigger 控制旋轉
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
            markers: false,
            onUpdate: (self) => {
                const totalItems = reportsData.length;
                const anglePerItem = 360 / totalItems;

                // 設定緩衝區
                const startBuffer = 0.025;
                const endBuffer = 0.025;
                const activeRange = 1 - startBuffer - endBuffer;

                let currentIndex = 0;

                if (self.progress <= startBuffer) {
                    currentIndex = 0;
                } else if (self.progress >= (1 - endBuffer)) {
                    currentIndex = totalItems - 1;
                } else {
                    const adjustedProgress = (self.progress - startBuffer) / activeRange;
                    currentIndex = Math.round(adjustedProgress * (totalItems - 1));
                    currentIndex = Math.max(0, Math.min(currentIndex, totalItems - 1));
                }

                const targetRotation = -currentIndex * anglePerItem;

                gsap.to(sliderWrapper, {
                    rotateY: targetRotation,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: 'auto'
                });

                setCurrentSlide(currentIndex);
            },
            id: 'reports-trigger'
        });

        return () => {
            trigger.kill();
        };
    }, [reportsData]);

    const currentItem = reportsData[currentSlide] || reportsData[0];

    return (
        <div ref={sectionRef} className="relative h-[500vh] overflow-visible">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <div ref={sliderContainerRef} className="absolute w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* 3D 輪播部分 */}
                    <div className="w-full h-screen text-center overflow-hidden">
                        <div
                            ref={sliderWrapperRef}
                            className="absolute z-10"
                            style={{
                                top: `calc(50% - ${sliderSize * 1}vw)`,
                                left: `calc(50% - ${sliderSize * 1.5}vw)`,
                                width: `${sliderSize * 3}vw`,
                                height: `${sliderSize * 2}vw`,
                                transformStyle: 'preserve-3d',
                                transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
                            }}
                        >
                            <div
                                ref={sliderRef}
                                className="relative w-full h-full"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: 'rotateX(0deg) rotateY(0deg)'
                                }}
                            >
                                {/* 項目會通過 JavaScript 動態添加 */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 顯示當前項目資訊 */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">
                        {currentItem?.title || ''}
                    </h2>
                    <p className="text-xl text-gray-600">
                        {currentItem?.subtitle || ''}
                    </p>
                </div>
            </div>
        </div>
    );
}