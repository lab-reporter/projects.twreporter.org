'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

interface ModalScrollManagerProps {
    scrollContainer: RefObject<HTMLDivElement | null>;
    isModalOpen: boolean;
    modalDataId?: string;
    modalContentId?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalScrollManager({
    scrollContainer,
    isModalOpen,
    modalDataId,
    modalContentId,
    onClose,
    children
}: ModalScrollManagerProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [overScrollDistance, setOverScrollDistance] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const overScrollResetInterval = useRef<NodeJS.Timeout | null>(null);
    const lastScrollTime = useRef<number>(0);
    const resetStartDistance = useRef<number>(0);

    // 當 Modal 內容改變時，重置滾動位置到頂部
    useEffect(() => {
        if (isModalOpen && scrollContainer.current) {
            scrollContainer.current.scrollTop = 0;
            setScrollProgress(0);
            setOverScrollDistance(0);
            setIsAtBottom(false);

            // 清理計時器
            if (overScrollResetInterval.current) {
                clearInterval(overScrollResetInterval.current);
                overScrollResetInterval.current = null;
            }
        }
    }, [modalDataId, modalContentId, isModalOpen, scrollContainer]);

    // 處理滾動進度和過度滾動關閉機制
    useEffect(() => {
        const container = scrollContainer.current;
        if (!container || !isModalOpen) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const maxScroll = scrollHeight - clientHeight;

            // 計算滾動進度
            let progress = 0;
            if (maxScroll > 0) {
                progress = scrollTop / maxScroll;
            }
            const clampedProgress = Math.min(Math.max(progress, 0), 1);

            setScrollProgress(clampedProgress);

            // 檢測是否到達底部（容許1px誤差）
            const atBottom = scrollTop >= maxScroll - 1;
            setIsAtBottom(atBottom);

            // 如果不在底部，重置過度滾動距離
            if (!atBottom) {
                setOverScrollDistance(0);
                if (overScrollResetInterval.current) {
                    clearInterval(overScrollResetInterval.current);
                    overScrollResetInterval.current = null;
                }
            }
        };

        // 處理過度滾動（在底部時的滾輪事件）
        const handleWheel = (e: WheelEvent) => {
            if (!isAtBottom) return;

            // 只處理向下滾動
            if (e.deltaY > 0) {
                e.preventDefault(); // 阻止默認滾動行為

                // 更新最後滾動時間
                lastScrollTime.current = Date.now();

                const newDistance = overScrollDistance + Math.abs(e.deltaY);
                setOverScrollDistance(newDistance);

                // 檢查是否達到關閉閾值（100vh）
                const viewportHeight = window.innerHeight;
                if (newDistance >= viewportHeight) {
                    onClose();
                    return;
                }
            }
        };

        // 監聽滾動事件
        container.addEventListener('scroll', handleScroll, { passive: true });

        // 監聽滾輪事件（用於過度滾動檢測）
        container.addEventListener('wheel', handleWheel, { passive: false });

        // 監聽容器大小變化，當內容載入完成後重新計算
        const resizeObserver = new ResizeObserver(() => {
            setTimeout(handleScroll, 50);
        });

        resizeObserver.observe(container);

        // 初始化進度
        setTimeout(handleScroll, 100);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('wheel', handleWheel);
            resizeObserver.disconnect();

            // 清理計時器
            if (overScrollResetInterval.current) {
                clearInterval(overScrollResetInterval.current);
                overScrollResetInterval.current = null;
            }
        };
    }, [scrollContainer, isModalOpen, isAtBottom, overScrollDistance, onClose]);

    // 管理過度滾動重置計時器 - 在滾動停止500ms後開始重置
    useEffect(() => {
        if (overScrollDistance > 0 && isAtBottom) {
            // 啟動檢查計時器，每100ms檢查一次是否停止滾動
            const checkTimer = setInterval(() => {
                const now = Date.now();
                const timeSinceLastScroll = now - lastScrollTime.current;

                // 如果停止滾動超過500ms，開始重置
                if (timeSinceLastScroll > 500) {
                    // 清理檢查計時器
                    clearInterval(checkTimer);

                    // 啟動重置計時器 - 平滑減少
                    if (!overScrollResetInterval.current) {
                        // 使用 ref 記錄開始重置時的初始距離
                        resetStartDistance.current = overScrollDistance;
                        const resetStartTime = Date.now();
                        const resetDuration = 200; // 設置重置時間

                        overScrollResetInterval.current = setInterval(() => {
                            const elapsed = Date.now() - resetStartTime;
                            const progress = Math.min(elapsed / resetDuration, 1); // 0-1
                            const newDistance = resetStartDistance.current * (1 - progress); // 線性減少

                            if (progress >= 1 || newDistance < 1) {
                                // 時間到或距離很小時直接重置並清理計時器
                                setOverScrollDistance(0);
                                resetStartDistance.current = 0;
                                if (overScrollResetInterval.current) {
                                    clearInterval(overScrollResetInterval.current);
                                    overScrollResetInterval.current = null;
                                }
                            } else {
                                setOverScrollDistance(newDistance);
                            }
                        }, 16); // 約60fps，更平滑
                    }
                }
            }, 100);

            return () => {
                clearInterval(checkTimer);
            };
        } else {
            // 如果不在底部或沒有過度滾動，清理重置計時器
            if (overScrollResetInterval.current) {
                clearInterval(overScrollResetInterval.current);
                overScrollResetInterval.current = null;
            }
        }
    }, [overScrollDistance, isAtBottom]);

    return (
        <>
            {/* 內容區域包裝器 */}
            <div
                className="relative h-full overflow-y-auto bg-gray-100 shadow-2xl rounded-md [&::-webkit-scrollbar]:hidden"
                style={{ scrollBehavior: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                ref={scrollContainer}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 滾動進度條 */}
                <div className="sticky top-0 left-0 mb-[-4px] w-full h-1 bg-transparent z-20">
                    <div
                        className="h-full bg-red-70 transition-all duration-300 ease-out"
                        style={{ width: `${scrollProgress * 100}%` }}
                    ></div>
                </div>

                {/* 內容 */}
                {children}
            </div>

            {/* 關閉按鈕與過度滾動進度圓環 */}
            <div className="fixed top-[2vh] right-[1vw] z-[10000]">
                <div className="relative w-12 h-12">
                    {/* 過度滾動進度圓環 - 顯示在按鈕後方 */}
                    {isAtBottom && overScrollDistance > 0 && (() => {
                        const radius = 18;
                        const circumference = 2 * Math.PI * radius;
                        const progress = Math.min(overScrollDistance / window.innerHeight, 1);
                        const strokeDashoffset = circumference - (progress * circumference);

                        return (
                            <svg className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 -rotate-90" viewBox="0 0 40 40">
                                {/* 背景圓環 */}
                                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                                {/* 進度圓環 */}
                                <circle
                                    cx="20" cy="20" r={radius} fill="none" stroke="#C40D23" strokeWidth="3"
                                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-100 ease-out"
                                />
                            </svg>
                        );
                    })()}

                    {/* 關閉按鈕 */}
                    <button
                        onClick={onClose}
                        className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current group-hover:stroke-white">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
} 