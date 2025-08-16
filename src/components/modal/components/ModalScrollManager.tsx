'use client';

import { useEffect, useState, useRef, RefObject } from 'react';
// import Image from 'next/image';
import ModalSidepanel from './ModalSidepanel';
import ModalSidepanelHint from './ModalSidepanelHint';
import projectsData from '@/app/data/projects.json';
import { useStore } from '@/stores';

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
    const [hasScrolledAfterReachingBottom, setHasScrolledAfterReachingBottom] = useState(false);
    const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
    const [hasSlideContainer, setHasSlideContainer] = useState(false);
    const [slideOverScrollDistance, setSlideOverScrollDistance] = useState(0);
    const [isLastSlide, setIsLastSlide] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintOpacity, setHintOpacity] = useState(0);
    const overScrollResetInterval = useRef<NodeJS.Timeout | null>(null);
    const lastScrollTime = useRef<number>(0);
    const resetStartDistance = useRef<number>(0);

    const { openModal } = useStore();

    // 使用 ref 來追蹤最新狀態，避免閉包問題
    const isAtBottomRef = useRef(false);
    const hasScrolledAfterReachingBottomRef = useRef(false);
    const overScrollDistanceRef = useRef(0);
    const reachedBottomTimeRef = useRef<number>(0); // 記錄到達底部的時間
    const lastWheelTimeRef = useRef<number>(0); // 記錄最後一次滾輪事件時間
    const lastScrollTopRef = useRef<number>(0); // 記錄上次滾動位置
    const scrollVelocityRef = useRef<number>(0); // 記錄滾動速度
    const isInertiaScrollingRef = useRef(false); // 是否正在慣性滾動
    const cooldownPeriod = 300; // 冷卻期時間（毫秒）
    const inertiaThreshold = 800; // 慣性滾動檢測閾值（毫秒）

    // 根據當前項目 ID 取得所屬章節的所有項目
    const getCurrentSectionProjects = () => {
        if (!modalDataId) return [];

        // 從 modalDataId 解析出章節名稱 (例如: "reports-1" -> "reports")
        const section = modalDataId.split('-')[0];

        // 篩選出同一章節的所有項目
        return projectsData.filter(project =>
            project.section.includes(section)
        );
    };

    // 處理項目選擇
    const handleSelectProject = (projectId: string) => {
        const selectedProject = projectsData.find(p => p.id === projectId);
        if (selectedProject) {
            // 直接使用 projectId 作為 contentId
            openModal(projectId, selectedProject);
        }
    };

    // 切換側邊欄
    const toggleSidepanel = () => {
        setIsSidepanelOpen(!isSidepanelOpen);
    };

    // 當 Modal 內容改變時，重置滾動位置到頂部
    useEffect(() => {
        if (isModalOpen && scrollContainer.current) {
            scrollContainer.current.scrollTop = 0;
            setScrollProgress(0);
            setOverScrollDistance(0);
            setIsAtBottom(false);
            setHasScrolledAfterReachingBottom(false);
            setIsSidepanelOpen(false); // 重置側邊欄狀態

            // 檢查是否需要顯示提示（使用 localStorage）
            try {
                const hasSeenModalHint = localStorage.getItem('hasSeenModalSidepanelHint');

                if (!hasSeenModalHint) {
                    // 延遲顯示提示，讓 Modal 先完全載入
                    setTimeout(() => {
                        setShowHint(true);
                        // 淡入動畫
                        setTimeout(() => setHintOpacity(1), 50);
                    }, 500);
                }
            } catch (error) {
                // 如果 localStorage 不可用，預設顯示提示
                console.error('localStorage error:', error);
                setTimeout(() => {
                    setShowHint(true);
                    setTimeout(() => setHintOpacity(1), 50);
                }, 500);
            }

            // 檢查是否有 InnovationSlidesContainer
            const hasSlide = !!scrollContainer.current.querySelector('[data-slide-container="true"]');
            setHasSlideContainer(hasSlide);

            // 同時更新 ref
            isAtBottomRef.current = false;
            hasScrolledAfterReachingBottomRef.current = false;
            overScrollDistanceRef.current = 0;
            reachedBottomTimeRef.current = 0;
            lastWheelTimeRef.current = 0;
            lastScrollTopRef.current = 0;
            scrollVelocityRef.current = 0;
            isInertiaScrollingRef.current = false;

            // 清理計時器
            if (overScrollResetInterval.current) {
                clearInterval(overScrollResetInterval.current);
                overScrollResetInterval.current = null;
            }
        }
    }, [modalDataId, modalContentId, isModalOpen, scrollContainer]);

    // 處理提示關閉
    const handleHintClose = () => {
        // 淡出動畫
        setHintOpacity(0);
        setTimeout(() => {
            setShowHint(false);
            // 記錄到 localStorage
            localStorage.setItem('hasSeenModalSidepanelHint', 'true');
        }, 500);
    };

    // 自動關閉提示機制 - 10秒後自動關閉
    useEffect(() => {
        if (showHint && hintOpacity === 1) {
            const autoCloseTimer = setTimeout(() => {
                handleHintClose();
            }, 10000);

            return () => clearTimeout(autoCloseTimer);
        }
    }, [showHint, hintOpacity]);

    // 滾動超過25vh自動關閉提示
    useEffect(() => {
        const container = scrollContainer.current;
        if (!container || !showHint) return;

        const handleScrollForHint = () => {
            const { scrollTop } = container;
            const viewportHeight = window.innerHeight;
            const scrollThreshold = viewportHeight * 0.25; // 25vh

            if (scrollTop > scrollThreshold) {
                handleHintClose();
            }
        };

        container.addEventListener('scroll', handleScrollForHint, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScrollForHint);
        };
    }, [scrollContainer, showHint]);

    // 處理 InnovationSlidesContainer 的最後一頁 overscroll
    useEffect(() => {
        const container = scrollContainer.current;
        if (!container || !isModalOpen || !hasSlideContainer) return;

        const handleSlideWheel = (e: WheelEvent) => {
            // 檢查是否在最後一個 slide
            const slides = container.querySelectorAll('[class*="absolute inset-0"]');
            const activeSlide = Array.from(slides).find(slide =>
                slide.classList.contains('opacity-100')
            );

            if (!activeSlide) return;

            const slideIndex = Array.from(slides).indexOf(activeSlide);
            const isLast = slideIndex === slides.length - 1;
            setIsLastSlide(isLast);

            if (isLast && e.deltaY > 0) {
                // 累積 overscroll 距離
                const newDistance = slideOverScrollDistance + Math.abs(e.deltaY);
                setSlideOverScrollDistance(newDistance);

                // 檢查是否達到關閉閾值（100vh）
                // const viewportHeight = window.innerHeight;
                // if (newDistance >= viewportHeight) {
                //     onClose();
                // }
            } else if (!isLast) {
                // 不在最後一頁時重置
                setSlideOverScrollDistance(0);
            }
        };

        container.addEventListener('wheel', handleSlideWheel, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleSlideWheel);
        };
    }, [scrollContainer, isModalOpen, hasSlideContainer, slideOverScrollDistance]);

    // 重置 slide overscroll 計時器
    useEffect(() => {
        if (slideOverScrollDistance > 0 && isLastSlide) {
            const timer = setTimeout(() => {
                setSlideOverScrollDistance(0);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [slideOverScrollDistance, isLastSlide]);

    // 處理滾動進度和過度滾動關閉機制
    useEffect(() => {
        const container = scrollContainer.current;
        if (!container || !isModalOpen) return;

        // 檢查是否有 InnovationSlidesContainer（不需要滾動管理）
        const hasSlideContainer = container.querySelector('[data-slide-container="true"]');
        if (hasSlideContainer) {
            return; // InnovationSlidesContainer 會自己處理切換邏輯，但 overscroll 由上面的 effect 處理
        }

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const maxScroll = scrollHeight - clientHeight;
            const now = Date.now();

            // 先立即更新滾動進度，避免延遲
            let progress = 0;
            if (maxScroll > 0) {
                progress = scrollTop / maxScroll;
            }
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(clampedProgress);

            // 計算滾動速度（像素/毫秒）- 移到進度更新後
            const timeDelta = now - (lastScrollTime.current || now);
            const scrollDelta = Math.abs(scrollTop - lastScrollTopRef.current);
            if (timeDelta > 0) {
                scrollVelocityRef.current = scrollDelta / timeDelta;
            }

            lastScrollTopRef.current = scrollTop;
            lastScrollTime.current = now;

            // 檢測是否正在慣性滾動（速度較高且持續滾動）
            const isHighVelocity = scrollVelocityRef.current > 2; // 速度閾值
            if (isHighVelocity) {
                isInertiaScrollingRef.current = true;
                // 延遲重置慣性滾動狀態
                setTimeout(() => {
                    isInertiaScrollingRef.current = false;
                }, inertiaThreshold);
            }

            // 檢測是否到達底部（容許1px誤差）
            const atBottom = scrollTop >= maxScroll - 1;
            const wasAtBottom = isAtBottomRef.current;

            setIsAtBottom(atBottom);
            isAtBottomRef.current = atBottom;

            // 如果剛到達底部，重置緩衝狀態並記錄時間
            if (atBottom && !wasAtBottom) {
                reachedBottomTimeRef.current = now;
                setHasScrolledAfterReachingBottom(false);
                hasScrolledAfterReachingBottomRef.current = false;
            }

            // 如果不在底部，重置過度滾動距離和緩衝狀態
            if (!atBottom) {
                setOverScrollDistance(0);
                setHasScrolledAfterReachingBottom(false);
                overScrollDistanceRef.current = 0;
                hasScrolledAfterReachingBottomRef.current = false;
                reachedBottomTimeRef.current = 0;
                lastWheelTimeRef.current = 0;
                isInertiaScrollingRef.current = false;
                if (overScrollResetInterval.current) {
                    clearInterval(overScrollResetInterval.current);
                    overScrollResetInterval.current = null;
                }
            }
        };

        // 處理過度滾動（在底部時的滾輪事件）
        const handleWheel = (e: WheelEvent) => {
            // 只處理向下滑動
            if (e.deltaY > 0) {
                const now = Date.now();

                // 確保當前在底部
                if (!isAtBottomRef.current) {
                    return; // 允許正常滾動，不處理 overscroll
                }

                // 檢查是否正在慣性滾動
                if (isInertiaScrollingRef.current) {
                    lastWheelTimeRef.current = now;
                    return; // 慣性滾動期間忽略
                }

                // 檢查冷卻期：剛到達底部後需要等待冷卻期
                const timeSinceReachedBottom = now - reachedBottomTimeRef.current;
                if (timeSinceReachedBottom < cooldownPeriod) {
                    lastWheelTimeRef.current = now; // 更新最後滾輪時間
                    return; // 冷卻期內忽略
                }

                lastWheelTimeRef.current = now;
                e.preventDefault(); // 阻止默認滾動行為

                // 如果還沒有進行過"緩衝滑動"，設置緩衝狀態但不累積距離
                if (!hasScrolledAfterReachingBottomRef.current) {
                    setHasScrolledAfterReachingBottom(true);
                    hasScrolledAfterReachingBottomRef.current = true;
                    return; // 第一次滑動只是啟動緩衝，不累積距離
                }

                // 已經進行過緩衝滑動，開始累積overscroll距離
                // 更新最後滾動時間
                lastScrollTime.current = now;

                const newDistance = overScrollDistanceRef.current + Math.abs(e.deltaY);
                setOverScrollDistance(newDistance);
                overScrollDistanceRef.current = newDistance;

                // 檢查是否達到關閉閾值（100vh）
                // const viewportHeight = window.innerHeight;
                // if (newDistance >= viewportHeight) {
                //     onClose();
                //     return;
                // }
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
    }, [scrollContainer, isModalOpen]);

    // 管理過度滾動重置計時器 - 在滾動停止500ms後開始重置
    useEffect(() => {
        if (overScrollDistance > 0 && isAtBottom && hasScrolledAfterReachingBottom) {
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
    }, [overScrollDistance, isAtBottom, hasScrolledAfterReachingBottom]);

    return (
        <>
            {/* 內容區域包裝器 */}
            <div
                className="relative h-full overflow-y-auto bg-[rgba(255,255,255,0.9)] rounded-md [&::-webkit-scrollbar]:hidden"
                style={{ scrollBehavior: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                ref={scrollContainer as React.RefObject<HTMLDivElement>}
                onClick={(e) => {
                    e.stopPropagation();
                    // 如果 sidepanel 是開啟的，點擊內容區域會關閉它
                    if (isSidepanelOpen) {
                        setIsSidepanelOpen(false);
                    }
                }}
            >
                {/* 滾動進度條 - 只在沒有 InnovationSlidesContainer 時顯示 */}
                {!hasSlideContainer && (
                    <div className="sticky top-0 left-0 mb-[-4px] w-full h-1 bg-transparent z-20">
                        <div
                            className="h-full bg-red-70"
                            style={{ width: `${scrollProgress * 100}%` }}
                        ></div>
                    </div>
                )}

                {/* 內容 */}
                {children}
            </div>

            {/* 關閉按鈕與過度滾動進度圓環 */}
            <div className={`fixed top-4 z-[10000] transition-all duration-300 ${isSidepanelOpen ? 'right-[320px]' : 'right-4'}`} onClick={(e) => e.stopPropagation()}>
                <div className="relative w-12 h-12">
                    {/* 過度滾動進度圓環 - 暫時停用 */}
                    {/* 一般滾動模式 */}
                    {/* {!hasSlideContainer && isAtBottom && overScrollDistance > 0 && hasScrolledAfterReachingBottom && (() => {
                        const radius = 18;
                        const circumference = 2 * Math.PI * radius;
                        const progress = Math.min(overScrollDistance / window.innerHeight, 1);
                        const strokeDashoffset = circumference - (progress * circumference);

                        return (
                            <svg className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                                <circle
                                    cx="20" cy="20" r={radius} fill="none" stroke="#C40D23" strokeWidth="3"
                                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-100 ease-out"
                                />
                            </svg>
                        );
                    })()} */}

                    {/* InnovationSlidesContainer 模式 */}
                    {/* {hasSlideContainer && isLastSlide && slideOverScrollDistance > 0 && (() => {
                        const radius = 18;
                        const circumference = 2 * Math.PI * radius;
                        const progress = Math.min(slideOverScrollDistance / window.innerHeight, 1);
                        const strokeDashoffset = circumference - (progress * circumference);

                        return (
                            <svg className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                                <circle
                                    cx="20" cy="20" r={radius} fill="none" stroke="#C40D23" strokeWidth="3"
                                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-100 ease-out"
                                />
                            </svg>
                        );
                    })()} */}

                    {/* 關閉按鈕 */}
                    <button
                        onClick={onClose}
                        className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex items-center justify-center rounded-full bg-white/50 shadow-md hover:bg-black transition-colors duration-300"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="stroke-current group-hover:stroke-white">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
            {/* 側邊欄 */}
            <ModalSidepanel
                isOpen={isSidepanelOpen}
                onToggle={toggleSidepanel}
                projects={getCurrentSectionProjects()}
                currentProjectId={modalDataId}
                onSelectProject={handleSelectProject}
            />

            {/* 側邊欄提示 */}
            <ModalSidepanelHint
                show={showHint}
                opacity={hintOpacity}
                onClose={handleHintClose}
            />
        </>
    );
} 