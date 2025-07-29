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
        z: 30,
        width: "12.5%",
        top: "80%",
        left: "10%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-8/challenge-8-2.jpg",
        alt: "Challenge Parallax Image 8",
        x: 0,
        y: 0,
        z: 60,
        width: "12.5%",
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
    const [hasHovered, setHasHovered] = useState(false);

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

    // 設置淡入動畫
    useEffect(() => {
        const ctx = gsap.context(() => {
            // 選擇所有圖片元素
            const imageElements = gsap.utils.toArray('.challenge-parallax-image') as HTMLElement[];

            // 為每個元素設置動畫
            imageElements.forEach((element, index) => {
                const targetZ = parallaxImages[index].z;
                const x = parallaxImages[index].x;
                const y = parallaxImages[index].y;

                // 設置初始狀態
                gsap.set(element, {
                    opacity: 0,
                    transform: `translate3d(${x}px, ${y}px, -100px)`
                });

                // 創建 ScrollTrigger 動畫
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top center",
                    once: true,
                    onEnter: () => {
                        gsap.to(element, {
                            opacity: 1,
                            transform: `translate3d(${x}px, ${y}px, ${targetZ}px)`,
                            duration: 1,
                            delay: index * 0.1, // stagger 效果
                            ease: "power2.out"
                        });
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

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
            
            // 第一次 hover 時，隱藏 SectionHeading 並顯示 CurrentItemDisplay
            if (!hasHovered) {
                setHasHovered(true);
                
                // 找到 SectionHeading 元素並隱藏
                // 向上查找到 sticky container，然後找到所有具有 section-headings class 的元素
                const stickyContainer = containerRef.current?.closest('.sticky');
                const sectionHeading = stickyContainer?.querySelector('.section-headings');
                
                if (sectionHeading) {
                    gsap.to(sectionHeading, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            (sectionHeading as HTMLElement).style.display = 'none';
                        }
                    });
                }
                
                // 顯示 CurrentItemDisplay
                if (currentItemDisplayRef.current) {
                    gsap.set(currentItemDisplayRef.current, { display: 'block' });
                    gsap.to(currentItemDisplayRef.current, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            }
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
            }}>
            {parallaxImages.map((image, index) => (
                <div
                    key={index}
                    style={{
                        width: image.width,
                        top: image.top,
                        left: image.left,
                        zIndex: image.zIndex
                    }}
                    className="challenge-parallax-image aspect-[3/2] absolute cursor-pointer"
                    data-z={image.z} // 儲存目標 z 值
                    onMouseEnter={(e) => {
                        // 獲取當前的 transform 值並加上 scale
                        const currentTransform = e.currentTarget.style.transform;
                        const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();
                        gsap.to(e.currentTarget, {
                            transform: `${baseTransform} scale(1.1)`,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                        // 處理 hover 顯示標題
                        handleImageHover(image.src);
                    }}
                    onMouseLeave={(e) => {
                        // 恢復到原始的 transform（移除 scale）
                        const currentTransform = e.currentTarget.style.transform;
                        const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();
                        gsap.to(e.currentTarget, {
                            transform: baseTransform,
                            duration: 0.3,
                            ease: "power2.out"
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
                {hoveredItem ? (
                    <CurrentItemDisplay
                        title={hoveredItem.title}
                        subtitle={hoveredItem.subtitle}
                    />
                ) : (
                    // 預設文字區塊 - 你可以在這裡編輯內容
                    <div className="text-center">
                        <h3>點選有興趣的項目</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChallengeParallax