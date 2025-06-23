"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionOpenTitle from './SectionOpenTitle';

gsap.registerPlugin(ScrollTrigger);

const ReportsOpen = () => {
    // 圖片陣列配置
    const imageGroups = [
        {
            path: ['/assets/img1.png', '/assets/img2.png', '/assets/img3.png', '/assets/img4.png', '/assets/img5.png'],
            top: '5%',
            left: '21.5%',
            width: '20%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img6.png', '/assets/img7.png', '/assets/img8.png', '/assets/img9.png', '/assets/img10.png'],
            top: '18%',
            left: '50%',
            width: '12.5%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img11.png', '/assets/img12.png', '/assets/img13.png', '/assets/img14.png', '/assets/img15.png'],
            top: '38%',
            left: '2%',
            width: '20%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img16.png', '/assets/img17.png', '/assets/img18.png', '/assets/img19.png'],
            top: '78%',
            left: '9%',
            width: '20%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img21.png', '/assets/img22.png', '/assets/img23.png', '/assets/img24.png', '/assets/img25.png'],
            top: '55%',
            left: '75%',
            width: '20%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img26.png', '/assets/img27.png'],
            top: '10%',
            left: '70%',
            width: '22%',
            aspectRatio: '3/2'
        },
        {
            path: ['/assets/img28.png', '/assets/img29.png', '/assets/img30.png', '/assets/img20.png'],
            top: '72%',
            left: '45%',
            width: '22%',
            aspectRatio: '3/2'
        }
    ];

    // 為每個圖片群組維護當前圖片索引
    const [currentImageIndices, setCurrentImageIndices] = useState(() =>
        imageGroups.map(() => 0)
    );

    // 追蹤初始化是否完成
    const [isInitialized, setIsInitialized] = useState(false);

    // 圖片元素的引用
    const imageRefs = useRef([]);

    // 初始化圖片引用陣列
    useEffect(() => {
        imageRefs.current = imageGroups.map(() => []);
    }, []);

    // 切換圖片的函數
    const switchImage = (groupIndex) => {
        const group = imageGroups[groupIndex];
        const currentIndex = currentImageIndices[groupIndex];
        const nextIndex = (currentIndex + 1) % group.path.length;

        const currentImageRef = imageRefs.current[groupIndex][currentIndex];
        const nextImageRef = imageRefs.current[groupIndex][nextIndex];

        if (currentImageRef && nextImageRef) {
            // 確保先將下一張圖片完全隱藏和準備狀態
            gsap.set(nextImageRef, {
                rotateX: -90,
                opacity: 0,
                zIndex: 1
            });

            // 確保當前圖片可見狀態
            gsap.set(currentImageRef, {
                rotateX: 0,
                opacity: 1,
                zIndex: 2
            });

            // 動畫時間軸
            const tl = gsap.timeline();

            // 上一張圖片旋轉到90度
            tl.to(currentImageRef, {
                rotateX: 90,
                duration: 0.8,
                ease: "power3.in"
            })
                // 在90度時切換圖片可見性並開始下一張動畫
                .set(currentImageRef, { opacity: 0, zIndex: 1 })
                .set(nextImageRef, { opacity: 1, zIndex: 2 })
                // 下一張圖片從90度旋轉到0度
                .to(nextImageRef, {
                    rotateX: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
        }

        // 更新狀態
        setCurrentImageIndices(prev => {
            const newIndices = [...prev];
            newIndices[groupIndex] = nextIndex;
            return newIndices;
        });
    };

    // NOTE設定定時器，切換所有群組的圖片 - 只在初始化完成後啟動
    useEffect(() => {
        if (!isInitialized) return; // 如果還沒初始化完成，不啟動定時器

        const interval = setInterval(() => {
            // 使用 stagger 機制，每個群組間隔切換
            imageGroups.forEach((_, groupIndex) => {
                setTimeout(() => {
                    switchImage(groupIndex);
                }, groupIndex * 50); // NOTE每個照片群組的動畫間隔
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [isInitialized, currentImageIndices]); // 依賴 isInitialized 狀態

    // 初始化所有圖片的狀態 - 採用兩階段初始化
    useEffect(() => {
        // 延遲初始化確保所有 ref 都已建立
        const initializeImages = () => {
            imageGroups.forEach((group, groupIndex) => {
                group.path.forEach((_, imageIndex) => {
                    const imageRef = imageRefs.current[groupIndex]?.[imageIndex];
                    if (imageRef) {
                        // 第一階段：所有圖片都設為隱藏
                        gsap.set(imageRef, {
                            opacity: 0,
                            rotateX: imageIndex === 0 ? 0 : 90,
                            zIndex: 1
                        });
                    }
                });
            });

            // 第二階段：只顯示每組圖片的第一張
            imageGroups.forEach((group, groupIndex) => {
                const firstImageRef = imageRefs.current[groupIndex]?.[0];
                if (firstImageRef) {
                    gsap.to(firstImageRef, {
                        opacity: 1,
                        rotateX: 0,
                        zIndex: 2,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                }
            });

            // 初始化完成，啟用定時器
            setIsInitialized(true);
        };

        // 使用 setTimeout 確保 DOM 完全準備就緒
        const timeoutId = setTimeout(initializeImages, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className='relative w-full h-screen'>
            {/* 照片容器 */}
            <div className="imgs-container w-full h-screen">
                {imageGroups.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="absolute"
                        style={{
                            top: group.top,
                            left: group.left,
                            width: group.width,
                            aspectRatio: group.aspectRatio,
                            perspective: '1200px', // 這裡加上perspective
                            perspectiveOrigin: '50% 50%', // 可以微調視角中心
                            transformStyle: 'preserve-3d', // 讓子元素保留3D效果
                            overflow: 'hidden',
                            borderRadius: '4px'
                        }}
                    >
                        {group.path.map((imagePath, imageIndex) => (
                            <img
                                key={`${groupIndex}-${imageIndex}`}
                                ref={el => {
                                    if (!imageRefs.current[groupIndex]) {
                                        imageRefs.current[groupIndex] = [];
                                    }
                                    imageRefs.current[groupIndex][imageIndex] = el;
                                }}
                                className="absolute w-full h-full"
                                style={{
                                    objectFit: 'cover',
                                    backfaceVisibility: 'hidden',
                                    transformStyle: 'preserve-3d',
                                    opacity: 0 // 預設所有圖片都隱藏
                                }}
                                src={imagePath}
                                alt=""
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* absolute-center-container */}
            <div className="content-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] mx-auto h-auto py-20 flex flex-col items-center justify-center gap-4">
                <h1 className='relative text-white text-center text-[32px] leading-[1.5] font-bold mx-auto py-10 max-w-[640px]'>
                    10年之間<br />
                    我們和台灣社會一起走過什麼呢
                </h1>
            </div>
        </div >
    );
};

export default ReportsOpen;