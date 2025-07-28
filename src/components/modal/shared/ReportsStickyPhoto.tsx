'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 註冊 ScrollTrigger 插件
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ReportsStickyPhotoProps {
    imgSrcs: string[];
    alts?: string[];
}


export default function ReportsStickyPhoto({ imgSrcs, alts }: ReportsStickyPhotoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !innerRef.current) return;

        // 確保 DOM 已經渲染完成並找到 Modal 的滾動容器
        const timer = setTimeout(() => {
            if (!containerRef.current || !innerRef.current) return;

            // 查找 Modal 的滾動容器
            const modalScrollContainer = document.querySelector('.sidepanel-content')?.parentElement as HTMLElement;
            if (!modalScrollContainer) {
                console.warn('Modal scroll container not found');
                return;
            }

            // 計算滾動距離：內部總寬度 - 容器寬度
            const containerWidth = containerRef.current.offsetWidth;
            const innerWidth = innerRef.current.scrollWidth;
            const scrollDistance = innerWidth - containerWidth;

            // Debug 資訊
            console.log('ReportsStickyPhoto Debug:', {
                containerWidth,
                innerWidth,
                scrollDistance,
                modalScrollContainerHeight: modalScrollContainer.clientHeight,
                containerTop: containerRef.current.offsetTop,
                containerHeight: containerRef.current.offsetHeight
            });

            // 只有當內容超出容器時才建立動畫
            if (scrollDistance > 0) {
                // 建立 GSAP 動畫
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        scroller: modalScrollContainer, // 指定 Modal內部的滾動容器
                        start: 'top 60%',
                        end: 'top 10%',
                        scrub: 1,              // 平滑跟隨滾動
                        invalidateOnRefresh: true, // 視窗大小改變時重新計算
                        markers: {
                            startColor: "red",
                            endColor: "green",
                            fontSize: "12px",
                            indent: 20
                        },
                        id: "photo-scroll" // 給這個 ScrollTrigger 一個識別名稱
                    }
                });

                // 添加向左移動的動畫
                tl.to(innerRef.current, {
                    x: -scrollDistance,
                    ease: 'none', // 線性移動，與滾動同步
                });
            }

            // 清理函數
            return () => {
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.trigger === containerRef.current) {
                        trigger.kill();
                    }
                });
            };
        }, 500); // 增加延遲確保 Modal 完全載入

        return () => {
            clearTimeout(timer);
            // 組件卸載時清理所有相關的 ScrollTrigger
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === containerRef.current) {
                    trigger.kill();
                }
            });
        };
    }, [imgSrcs.length]); // 當圖片數量改變時重新計算

    return (
        <div ref={containerRef} className="w-full my-8 overflow-hidden relative">
            <div ref={innerRef} className="flex gap-4 justify-start items-center">
                {imgSrcs.map((imgSrc, index) => (
                    <div key={index}
                        className="w-[35vw] h-auto flex-shrink-0">
                        <Image
                            src={imgSrc}
                            alt={alts?.[index] || `reports-photo-${index + 1}`}
                            width={2000}
                            height={1333}
                            className={`w-full h-auto border border-4 border-white shadow-lg`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}