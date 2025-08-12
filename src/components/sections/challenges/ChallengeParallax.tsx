'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D'
import { useStore } from '@/stores'
import projectsData from '@/app/data/projects.json'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { CurrentItemDisplay } from '@/components/shared'

gsap.registerPlugin(ScrollTrigger)

const parallaxImages = [
    // 在這裡添加更多圖片物件
    {
        src: "/assets/challenges/challenge-1/challenge-1-2.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 25,
        width: "12.5%",
        top: "20%",
        left: "10%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-1/challenge-1-1.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 30,
        width: "7.5%",
        top: "30%",
        left: "5%",
        zIndex: 2
    },
    {
        src: "/assets/challenges/challenge-2/challenge-2-2.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 50,
        width: "12.5%",
        top: "10%",
        left: "30%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-3/challenge-3-1.jpg",
        alt: "Challenge Parallax Image 3",
        x: 0,
        y: 0,
        z: 35,
        width: "12.5%",
        top: "40%",
        left: "15%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-4/challenge-4-1.jpg",
        alt: "Challenge Parallax Image 4",
        x: 0,
        y: 0,
        z: 45,
        width: "12.5%",
        top: "15%",
        left: "75%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-5/challenge-5-1.jpg",
        alt: "Challenge Parallax Image 4",
        x: 0,
        y: 0,
        z: 95,
        width: "12.5%",
        top: "60%",
        left: "10%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-6/challenge-6-1.jpg",
        alt: "Challenge Parallax Image 6",
        x: 0,
        y: 0,
        z: 120,
        width: "12.5%",
        top: "60%",
        left: "70%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-7/challenge-7-2.jpg",
        alt: "Challenge Parallax Image 7",
        x: 0,
        y: 0,
        z: 60,
        width: "12.5%",
        top: "75%",
        left: "25%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-8/challenge-8-2.jpg",
        alt: "Challenge Parallax Image 8",
        x: 0,
        y: 0,
        z: 60,
        width: "17.5%",
        top: "70%",
        left: "45%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-9/challenge-9-2.jpg",
        alt: "Challenge Parallax Image 9",
        x: 0,
        y: 0,
        z: 28,
        width: "12.5%",
        top: "35%",
        left: "80%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-10/challenge-10-1.jpg",
        alt: "Challenge Parallax Image 10",
        x: 0,
        y: 0,
        z: 60,
        width: "12.5%",
        top: "20%",
        left: "50%",
        zIndex: 1
    },
]

// 定義 ProjectItem 介面
interface ProjectItem {
    id: string;
    path: string;
    title: string;
    subtitle?: string;
    section: string | string[];
    bgColor?: string;
}

const ChallengeParallax = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentItemDisplayRef = useRef<HTMLDivElement>(null);
    const { openModal } = useStore();
    const [hoveredItem, setHoveredItem] = useState<ProjectItem | null>(null);

    // 使用滑鼠追蹤 Hook
    useMouseTracking3D({
        enabled: true,
        targetRef: containerRef,
        cssProperty: 'perspectiveOrigin',
        rangeMin: 30,  // 可調整範圍
        rangeMax: 70,  // 可調整範圍
        useLerp: true,
        lerpFactor: 0.1
    });

    // 設置優化的動畫系統 - 使用單一 ScrollTrigger 和 stagger
    useEffect(() => {
        const ctx = gsap.context(() => {
            // 選擇所有圖片元素
            const imageElements = gsap.utils.toArray('.challenge-parallax-image') as HTMLElement[];

            // 設置每個元素的初始狀態和目標值
            imageElements.forEach((element, index) => {
                const targetZ = parallaxImages[index].z;
                const x = parallaxImages[index].x;
                const y = parallaxImages[index].y;

                // 設置初始狀態
                gsap.set(element, {
                    opacity: 0,
                    transform: `translate3d(${x}px, ${y}px, -100px)`,
                    willChange: 'transform, opacity'
                });

                // 儲存每個元素的動畫資訊
                (element as HTMLElement & { _animData?: { x: number; y: number; targetZ: number; startTransform: string; midTransform: string; endTransform: string; } })._animData = {
                    x, y, targetZ,
                    startTransform: `translate3d(${x}px, ${y}px, -100px)`,
                    midTransform: `translate3d(${x}px, ${y}px, ${targetZ}px)`,
                    endTransform: `translate3d(${x}px, ${y}px, 1000px)`
                };
            });

            // 建立主時間軸
            const mainTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom top",
                    scrub: 0.5, // 降低 scrub 值提升流暢度
                    markers: false,
                    fastScrollEnd: true, // 快速滾動時優化效能
                    preventOverlaps: true, // 防止動畫重疊
                    id: "challenge-parallax",
                    onUpdate: () => {
                        // 可用於 debug 或效能監控
                        // console.log("progress:", self.progress);
                    }
                }
            });

            // 入場動畫（0% - 40% 的時間軸）
            mainTimeline.to(imageElements, {
                opacity: 1,
                transform: (_index, element) => {
                    return (element as HTMLElement & { _animData?: { midTransform: string } })._animData?.midTransform || '';
                },
                ease: "power2.out",
                duration: 0.25, // 佔總時間軸的 40%
                stagger: {
                    each: 0.01, // 每個元素延遲 0.05 (相對於總時間軸)
                    from: "start"
                }
            }, 0);

            // 保持狀態（40% - 60% 的時間軸）
            // 不需要特別處理，元素會保持在中間狀態

            // 離場動畫（60% - 100% 的時間軸）
            mainTimeline.to(imageElements, {
                opacity: 0,
                transform: (_index, element) => {
                    return (element as HTMLElement & { _animData?: { endTransform: string } })._animData?.endTransform || '';
                },
                ease: "power2.in",
                duration: 0.25,
                stagger: {
                    each: 0.01,
                    from: "start"
                },
                onComplete: () => {
                    // 清理 will-change
                    imageElements.forEach(element => {
                        gsap.set(element, { willChange: 'auto' });
                        delete (element as HTMLElement & { _animData?: { x: number; y: number; targetZ: number; startTransform: string; midTransform: string; endTransform: string; } })._animData;
                    });
                }
            }, 0.6); // 從時間軸的 60% 開始

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 根據 hoveredItem 狀態控制顯示
    useEffect(() => {
        // 找到父容器，然後找到兄弟元素 SectionHeadings
        const parentContainer = containerRef.current?.parentElement;
        const sectionHeading = parentContainer?.querySelector('.section-headings');

        // Debug log
        if (process.env.NODE_ENV === 'development') {
            console.log('ChallengeParallax hoveredItem changed:', hoveredItem, 'sectionHeading found:', !!sectionHeading);
        }

        if (hoveredItem) {
            // 有 hover：隱藏 SectionHeading，顯示 CurrentItemDisplay
            if (sectionHeading) {
                // 先停止所有進行中的動畫
                gsap.killTweensOf(sectionHeading);

                gsap.to(sectionHeading, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        // 只有在 hoveredItem 還存在時才隱藏
                        if (hoveredItem) {
                            (sectionHeading as HTMLElement).style.display = 'none';
                        }
                    }
                });
            }

            if (currentItemDisplayRef.current) {
                // 先停止所有進行中的動畫
                gsap.killTweensOf(currentItemDisplayRef.current);

                gsap.set(currentItemDisplayRef.current, { display: 'block' });
                gsap.to(currentItemDisplayRef.current, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }
        } else {
            // 沒有 hover：顯示 SectionHeading，隱藏 CurrentItemDisplay
            if (sectionHeading) {
                // 先停止所有進行中的動畫
                gsap.killTweensOf(sectionHeading);

                // 確保元素是可見的
                (sectionHeading as HTMLElement).style.display = '';
                gsap.to(sectionHeading, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }

            if (currentItemDisplayRef.current) {
                // 先停止所有進行中的動畫
                gsap.killTweensOf(currentItemDisplayRef.current);

                gsap.to(currentItemDisplayRef.current, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        // 只有在 hoveredItem 還是 null 時才隱藏
                        if (!hoveredItem && currentItemDisplayRef.current) {
                            currentItemDisplayRef.current.style.display = 'none';
                        }
                    }
                });
            }
        }
    }, [hoveredItem]);

    // 處理 hover 效果
    const handleImageHover = (imageSrc: string) => {
        // 從圖片路徑解析出 challenge ID
        const match = imageSrc.match(/challenge-(\d+)/);
        if (!match) return;

        const challengeId = `challenge-${match[1]}`;

        // 從 projectsData 中找到對應的 challenge 資料
        const projectData = (projectsData as ProjectItem[]).find((p: ProjectItem) =>
            p.id === challengeId &&
            p.section &&
            (Array.isArray(p.section) ? p.section.includes('challenge') : p.section === 'challenge')
        );

        if (projectData) {
            setHoveredItem(projectData);
        }
    };

    const handleImageLeave = () => {
        setHoveredItem(null);
    };

    // 處理圖片點擊
    const handleImageClick = (imageSrc: string) => {
        // 從圖片路徑解析出 challenge ID
        const match = imageSrc.match(/challenge-(\d+)/);
        if (!match) return;

        const challengeId = `challenge-${match[1]}`;

        // 從 projectsData 中找到對應的 challenge 資料
        const projectData = (projectsData as ProjectItem[]).find((p: ProjectItem) =>
            p.id === challengeId &&
            p.section &&
            (Array.isArray(p.section) ? p.section.includes('challenge') : p.section === 'challenge')
        );

        if (projectData) {
            openModal(projectData.id, projectData as unknown as Record<string, unknown>);
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-screen absolute top-0 left-0"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '500px',
                willChange: 'perspective-origin'
            }}>
            {parallaxImages.map((image, index) => (
                <div
                    key={index}
                    style={{
                        width: image.width,
                        top: image.top,
                        left: image.left,
                        zIndex: image.zIndex,
                        cursor: 'zoom-in',
                        willChange: 'transform' // hover 時的 scale 動畫優化
                    }}
                    className="challenge-parallax-image aspect-[3/2] absolute"
                    data-z={image.z} // 儲存目標 z 值
                    onMouseEnter={(e) => {
                        // 使用 scale 屬性而非 transform，避免與滾動動畫衝突
                        gsap.to(e.currentTarget, {
                            scale: 1.1,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: 'auto'
                        });
                        // 處理 hover 顯示標題
                        handleImageHover(image.src);
                    }}
                    onMouseLeave={(e) => {
                        // 恢復 scale
                        gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: 'auto'
                        });
                        handleImageLeave();
                    }}
                    onClick={() => handleImageClick(image.src)}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover shadow-lg hover:shadow-xl transition-shadow duration-300" />
                </div>
            ))}

            {/* CurrentItemDisplay - 置中顯示 */}
            <div
                ref={currentItemDisplayRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                style={{
                    opacity: 0,
                    display: 'none'
                }}
            >
                {hoveredItem && (
                    <CurrentItemDisplay
                        title={hoveredItem.title}
                        subtitle={hoveredItem.subtitle}
                    />
                )}
            </div>
        </div>
    )
}

export default ChallengeParallax