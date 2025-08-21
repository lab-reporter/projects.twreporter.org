'use client';

import Image from 'next/image';
import { useStore } from '@/stores';

// Footer 頁尾組件：包含組織資訊、連結導覽和版權聲明
export default function FooterSection() {
    // 滾動到指定章節的函數（與 SectionNavigation 使用相同邏輯）
    const scrollToSection = async (sectionId: string) => {
        // 檢查是否有 swiper 正在動畫，如果是則忽略此次調用
        if (document.body.hasAttribute('data-swiper-animating')) {
            return;
        }

        // 查找目標元素
        const targetElement = document.getElementById(`section-${sectionId}`);
        if (!targetElement) {
            return;
        }

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
    return (
        <footer
            className="sticky bottom-0 z-0 left-0 w-full bg-white text-black py-16 px-12"
            id="section-footer"
        >
            <div className="relative max-w-7xl mx-auto">
                {/* 主要內容區域 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Logo 和描述文字區域 */}
                    <div className="lg:col-span-7 xl:col-span-6">
                        {/* Logo */}
                        <div className="mb-8">
                            <Image
                                src="/assets/footer-logo.svg"
                                alt="報導者 The Reporter"
                                width={300}
                                height={45}
                                className="w-1/2 min-w-[15rem] sm:min-w-[18rem]"
                            />
                        </div>

                        {/* 描述文字 */}
                        <div className="mb-8">
                            <p className="text-body-base md:text-body-lg text-gray-800 leading-relaxed font-noto-sans-tc text-balance">
                                台灣第一個由公益基金會成立的網路媒體，致力於公共領域調查報導，打造多元進步的媒體環境。
                            </p>
                        </div>
                    </div>

                    {/* 右側連結區域 */}
                    <div className="lg:col-span-5 xl:col-span-6">
                        <div className="flex flex-row lg:flex-col gap-4 lg:justify-end items-end">

                            {/* 前往官網 */}
                            <div>
                                <a
                                    href="https://www.twreporter.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-body-base text-gray-700 hover:text-black transition-colors duration-300"
                                >
                                    前往官網
                                </a>
                            </div>

                            {/* 贊助支持 */}
                            <div>
                                <button
                                    onClick={() => scrollToSection('support')}
                                    className="text-body-base text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer"
                                >
                                    贊助支持
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* 分隔線 */}
                <div className="border-t border-gray-200 my-12"></div>

                {/* 底部資訊區域 */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    {/* 法律資訊 */}
                    <div className="text-body-sm text-gray-600 font-noto-sans-tc">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span>公益勸募許可號</span>
                            <span className="text-gray-400">|</span>
                            <span>衛部救字第 1131363879 號</span>
                            <span className="text-gray-400">｜</span>
                            <span>募款期間：2025/1/1~2025/12/31</span>
                            <span className="text-gray-400">｜</span>
                            <a
                                href="https://www.twreporter.org/a/license-footer"
                                target="_blank"
                                className="hover:text-black transition-colors duration-300"
                            >
                                許可協議
                            </a>
                            <span className="text-gray-400">|</span>
                            <a
                                href="https://www.twreporter.org/a/privacy-footer"
                                target="_blank"
                                className="hover:text-black transition-colors duration-300"
                            >
                                隱私政策
                            </a>
                        </div>
                    </div>

                    {/* 版權聲明 */}
                    <div className="text-body-sm text-gray-500 font-noto-sans-tc">
                        Copyright © 2025 The Reporter.
                    </div>

                </div>

            </div>
        </footer>
    );
}


