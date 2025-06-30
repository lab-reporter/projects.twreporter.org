'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '@/app/data/projects.json';
import ReportsSwiperItem from './ReportsSwiperItem';

interface ReportItem {
    id: string;
    path: string;
    title: string;
    subtitle?: string; // 修改為可選屬性，解決 TypeScript 類型錯誤
    section: string[];
    bgColor?: string;
}

export default function ReportsSwiper() {
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

        const sliderWrapper = sliderWrapperRef.current;
        const section = sectionRef.current;
        const sliderContainer = sliderContainerRef.current;

        if (!section || !sliderWrapper || !sliderContainer) return;

        // 設定初始狀態
        gsap.set(sliderContainer, {
            opacity: 1,
            scale: 1
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
    }, [reportsData, sliderSize, translateZMultiplier]);

    const currentItem = reportsData[currentSlide] || reportsData[0];

    // 計算哪些項目應該播放影片（當前項目和前後相鄰項目）
    const shouldPlayVideo = (index: number) => {
        const totalItems = reportsData.length;
        const prevIndex = (currentSlide - 1 + totalItems) % totalItems;
        const nextIndex = (currentSlide + 1) % totalItems;

        return index === currentSlide || index === prevIndex || index === nextIndex;
    };

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
                            {/* 使用 React 組件渲染項目 */}
                            {reportsData.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 cursor-pointer"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: `rotateY(calc(${index} * (360 / ${reportsData.length}) * 1deg)) translateZ(${sliderSize * translateZMultiplier}vw)`,
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <ReportsSwiperItem
                                        id={item.id}
                                        path={item.path}
                                        title={item.title}
                                        subtitle={item.subtitle || ''}
                                        bgColor={item.bgColor}
                                        shouldPlay={shouldPlayVideo(index)}
                                        projectData={item}
                                    />
                                </div>
                            ))}
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