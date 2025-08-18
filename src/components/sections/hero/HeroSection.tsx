'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { useStore } from '@/stores'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import ScrollDownIndicator from '@/components/shared/ScrollDownIndicator';

export default function HeroSection() {
    // DOM 元素參考：用於 GSAP 動畫控制
    const heroSectionRef = useRef<HTMLDivElement>(null);
    // 響應式斷點檢測：用於判斷是否為行動裝置
    const breakpoint = useBreakpoint();
    // 定義各個導航項目與對應的 section
    const navigationItems = [
        { id: 'reports', englishTitle: 'Impact', chineseTitle: '深度報導・影響力' },
        { id: 'innovations', englishTitle: 'Innovation', chineseTitle: '開放新聞室・創新' },
        { id: 'challenges', englishTitle: 'Breakthrough', chineseTitle: '非營利媒體・突圍' },
        { id: 'support', englishTitle: 'Support Us', chineseTitle: '支持報導者走過下個十年' }
    ];

    // 滾動到指定章節的函數（參考 SectionNavigation 的實作）
    const scrollToSection = async (sectionId: string) => {
        // 檢查是否有 swiper 正在動畫，如果是則忽略此次調用
        if (document.body.hasAttribute('data-swiper-animating')) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🚫 HeroSection: 忽略跳轉請求，swiper 正在動畫中');
            }
            return;
        }

        // 查找目標元素
        const targetElement = document.getElementById(`section-${sectionId}`);
        if (!targetElement) return;

        // 立即更新當前章節狀態
        const { setCurrentSection } = useStore.getState();
        setCurrentSection(sectionId);

        // 獲取目標位置
        const targetPosition = targetElement.offsetTop;

        // 手動處理背景顏色
        const mainElement = document.querySelector('main');
        if (mainElement) {
            // 如果跳轉到 feedbacks 或 support，背景應該是黑色
            if (sectionId === 'feedbacks' || sectionId === 'support') {
                mainElement.style.backgroundColor = 'rgba(0, 0, 0, 1)';
            } else {
                // 其他區塊背景應該是白色
                mainElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
        }

        // 強制跳轉（無動畫）
        window.scrollTo(0, targetPosition);

        // 確保 ScrollTrigger 更新並重新計算背景動畫
        setTimeout(async () => {
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');

            // 刷新所有 ScrollTrigger
            ScrollTrigger.refresh();

            // 強制更新背景動畫的進度
            const bgAnimation = ScrollTrigger.getById('main-background-animation');
            if (bgAnimation) {
                bgAnimation.refresh();
            }
        }, 50);
    };

    // GSAP 滾動淡出動畫設定
    useEffect(() => {
        const setupFadeOutAnimation = async () => {
            // 判斷是否為行動裝置（節省效能）
            const isMobile = breakpoint === 'base' || breakpoint === 'sm';

            // 行動裝置停用淡出動畫以節省效能
            if (isMobile) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('📱 HeroSection: 行動裝置停用淡出動畫');
                }
                return;
            }

            // 確保在瀏覽器環境中運行且元素已載入
            if (typeof window !== 'undefined' && heroSectionRef.current) {
                // 動態導入 GSAP 相關模組
                const { gsap } = await import('gsap');
                const { ScrollTrigger } = await import('gsap/ScrollTrigger');

                // 註冊 ScrollTrigger 外掛程式
                gsap.registerPlugin(ScrollTrigger);

                // 建立滾動觸發的淡出動畫
                const fadeOutTrigger = ScrollTrigger.create({
                    // 觸發元素：HeroSection 本身
                    trigger: heroSectionRef.current,
                    // 開始觸發點：HeroSection 底部到達視窗 90% 處
                    start: 'bottom 90%',
                    // 結束觸發點：HeroSection 底部到達視窗 50% 處
                    end: 'bottom 0%',
                    // 啟用滾動綁定動畫
                    scrub: true,
                    // 動畫更新回調：根據滾動進度調整透明度
                    onUpdate: (self) => {
                        const progress = self.progress;
                        // 透明度從 1 漸變到 0（progress 0 → 1 對應 opacity 1 → 0）
                        gsap.set(heroSectionRef.current, {
                            opacity: 1 - progress
                        });
                    },
                    // 動畫識別 ID，便於除錯和管理
                    id: 'hero-fade-out-animation'
                });

                // 返回清理函數
                return () => {
                    fadeOutTrigger.kill();
                };
            }
        };

        setupFadeOutAnimation();
    }, [breakpoint]); // 當斷點改變時重新設定動畫（例如從桌面旋轉到行動裝置）

    return (

        <div
            ref={heroSectionRef}
            className="lg:pt-0 pt-32 lg:sticky top-0 w-full max-w-[100rem] mx-auto px-12 lg:h-screen flex  flex-col-reverse lg:flex-row gap-8 lg:gap-0 justify-start items-center"
        >
            {/* 文字區塊 */}
            <div className="w-auto flex-shrink-0 flex flex-col lg:justify-start justify-center items-center lg:items-start">
                <h2 className="font-bold leading-[1] lg:text-left text-center">
                    這條獨立媒體之路 <br />
                    已經走了10年
                    <span style={{
                        transform: 'scale(2, 1)',
                        display: 'inline-block',
                        transformOrigin: 'left center',
                    }}>—</span>
                </h2>
                <h5>
                    看看我們跟讀者一起走過了什麼
                </h5>
                {/* <ul className="mt-8">
                    {navigationItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="py-2 lg:py-4 border-b border-gray-200 lg:pr-8 cursor-pointer transition-all duration-300 ease-in-out hover:border-red-70"
                        >
                            <h4 className="font-normal lg:text-left text-center lg:mb-2 mb-0">{item.englishTitle}</h4>
                            <h6 className="lg:text-left text-center">{item.chineseTitle}</h6>
                        </li>
                    ))}
                </ul> */}
            </div>
            {/* 圖片區域 */}
            <div className="w-full">
                <Image src="/assets/KV/KV-Diamond--Light.webp" alt="hero-image" width={2000} height={2000} />
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <ScrollDownIndicator />
            </div>
        </div>

    );
}