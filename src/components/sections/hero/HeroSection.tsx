'use client'

import { useRef, useEffect, useState } from 'react'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import ScrollDownIndicator from '@/components/shared/ScrollDownIndicator';
import Image from 'next/image';

// 將整體滾動進度 (0~1) 分割成多個動畫階段
const getCurrentProgress = (overallProgress: number) => {
    // 限制數值在 0~1 範圍內
    const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

    // 將特定區間 (start~end) 映射到 0~1
    const progress = (start: number, end: number) =>
        clamp((overallProgress - start) / (end - start));

    return {
        // 縮放動畫：0.05-1 範圍
        scaleAnimation: progress(0.05, 1),
    };
};

export default function HeroSection() {
    // DOM 元素參考：用於 GSAP 動畫控制
    const heroSectionRef = useRef<HTMLDivElement>(null);

    // 滾動進度狀態
    const [scrollProgress, setScrollProgress] = useState(0);
    // 響應式斷點檢測：用於判斷是否為行動裝置
    const breakpoint = useBreakpoint();

    // ============================
    // GSAP ScrollTrigger 設定：統一的滾動進度管理
    // ============================
    useEffect(() => {
        const setupScrollAnimations = async () => {
            // 判斷是否為行動裝置（節省效能）
            const isMobile = breakpoint === 'base' || breakpoint === 'sm';

            // 行動裝置停用動畫以節省效能
            if (isMobile) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('📱 HeroSection: 行動裝置停用滾動動畫');
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

                // 建立統一的滾動觸發器
                const scrollTrigger = ScrollTrigger.create({
                    // 觸發元素：HeroSection 本身
                    trigger: heroSectionRef.current,
                    // 開始觸發點：HeroSection 底部到達視窗 100% 處
                    start: 'bottom 100%',
                    // 結束觸發點：HeroSection 底部到達視窗 0% 處
                    end: 'bottom 0%',
                    // 啟用滾動綁定動畫
                    scrub: 0.5,
                    // 動畫更新回調：根據滾動進度更新狀態
                    onUpdate: (self) => {
                        setScrollProgress(self.progress);
                    },
                    // 動畫識別 ID，便於除錯和管理
                    id: 'hero-scroll-progress'
                });

                // 返回清理函數
                return () => {
                    scrollTrigger.kill();
                };
            }
        };

        setupScrollAnimations();
    }, [breakpoint]);

    // ============================
    // 縮放動畫控制
    // ============================
    useEffect(() => {
        if (!heroSectionRef.current || breakpoint === 'base' || breakpoint === 'sm') return;

        const currentProgress = getCurrentProgress(scrollProgress);

        // 應用縮放動畫
        if (typeof window !== 'undefined') {
            import('gsap').then(({ gsap }) => {
                gsap.set(heroSectionRef.current, {
                    scale: 1 - currentProgress.scaleAnimation
                });
            });
        }

        // 開發模式除錯資訊
        if (process.env.NODE_ENV === 'development') {
            console.log(`📏 縮放進度: ${(currentProgress.scaleAnimation * 100).toFixed(1)}%`);
        }
    }, [scrollProgress, breakpoint]); // 當斷點改變時重新設定動畫（例如從桌面旋轉到行動裝置）

    return (

        <>
            <div
                ref={heroSectionRef}
                className="
            relative w-full mb-[-100v] max-w-[100rem] mx-auto flex flex-col-reverse justify-center items-center
            lg:h-screen lg:pt-0 lg:sticky lg:top-0 lg:px-12 py-16 lg:py-0 lg:flex-row gap-2 lg:gap-0"
            >
                <div className="lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2">
                    <ScrollDownIndicator />
                </div>
                {/* 文字區塊 */}
                <div className="w-auto flex-shrink-0 flex flex-col lg:justify-start justify-center items-center lg:items-start">
                    <h2 className="font-bold leading-[1] lg:text-left text-center">
                        這條獨立媒體之路 <br />
                        已經走了10年
                        <span style={{
                            letterSpacing: -8,
                        }}>——</span>
                    </h2>
                    <h5>
                        看看我們跟讀者一起走過了什麼
                    </h5>
                </div>
                {/* 影片區域 */}
                <div className="h-full p-10 relative">
                    <video
                        src="/assets/KV/motion 2160p.mp4"
                        autoPlay
                        muted
                        loop={true}
                        className="w-full h-full object-contain"
                    ></video>
                    <div className="w-full h-full absolute z-10 top-0 left-0 wave-animation">
                        <Image
                            src="/assets/KV/KV-Waves.webp"
                            alt="KV聲波"
                            fill
                            sizes="100vw"
                            priority
                            className="w-full h-full invert object-contain"
                        />
                    </div>
                    <style jsx>{`
                    @keyframes wavePulse {
                        0% {
                            transform: scale(0.8);
                            opacity: 0;
                        }
                        50% {
                            transform: scale(0.9);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 0;
                        }
                    }
                    
                    .wave-animation {
                        animation: wavePulse 1.5s linear infinite;
                    }
                `}</style>
                </div>
            </div>
        </>
    );
}