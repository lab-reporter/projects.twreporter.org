'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '@/app/data/projects.json';
import { CurrentItemDisplay } from '@/components/shared';
import ReportsSwiperItem from './ReportsSwiperItem';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/stores';

// 報導項目的資料結構定義
interface ReportItem {
    // 項目唯一識別碼
    id: string;
    // 項目媒體檔案路徑
    path: string;
    // 項目標題
    title: string;
    // 項目副標題（可選）
    subtitle?: string;
    // 項目所屬章節陣列
    section: string[];
    // 項目背景顏色（可選）
    bgColor?: string;
    [key: string]: unknown;
}

// 報導輪播組件主函數
export default function ReportsSwiper() {
    // DOM 元素參考：輪播容器的旋轉外框
    const sliderWrapperRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：整個章節區域
    const sectionRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：輪播展示容器
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：當前項目資訊展示區域
    const currentItemDisplayRef = useRef<HTMLDivElement>(null);

    // 從 store 取得開場動畫完成狀態
    const isOpeningComplete = useStore((state) => state.isOpeningComplete);

    // 狀態變數：當前顯示的輪播項目索引
    const [currentSlide, setCurrentSlide] = useState(0);
    // 狀態變數：是否已完成客戶端初始化（解決 SSR/CSR 不匹配問題）
    const [isClient, setIsClient] = useState(false);
    // 狀態：追蹤模糊背景層是否已經顯示過
    const [hasShownBlurOverlay, setHasShownBlurOverlay] = useState(false);
    // 狀態：追蹤模糊背景層是否正在顯示
    const [showBlurOverlay, setShowBlurOverlay] = useState(false);
    // 使用 ref 來追蹤是否已經顯示過，避免重新渲染
    const hasShownBlurOverlayRef = useRef(false);
    // 狀態變數：瀏覽器視窗寬度（用於響應式設計）
    const [windowWidth, setWindowWidth] = useState(1024); // 統一初始值，避免 SSR/CSR 不匹配

    // 拖曳相關狀態
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragDelta, setDragDelta] = useState(0);
    const [previewSlide, setPreviewSlide] = useState(0); // 預覽時的項目索引
    const dragThreshold = 50; // 觸發切換的最小拖曳距離

    // 使用 ref 來存儲不需要觸發重新渲染的值
    const currentSlideRef = useRef(currentSlide);
    const isDraggingRef = useRef(isDragging);
    const startXRef = useRef(startX);
    const dragDeltaRef = useRef(dragDelta);

    // 更新 ref 的值
    useEffect(() => {
        currentSlideRef.current = currentSlide;
    }, [currentSlide]);

    useEffect(() => {
        isDraggingRef.current = isDragging;
    }, [isDragging]);

    useEffect(() => {
        startXRef.current = startX;
    }, [startX]);

    useEffect(() => {
        dragDeltaRef.current = dragDelta;
    }, [dragDelta]);

    // 可見性偵測
    const { elementRef: observerRef, isVisible } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '100px'
    });

    // 優化的滑鼠追蹤
    const mousePosition = useMouseTracking3D({
        // 啟用條件：客戶端已載入且章節可見時才追蹤滑鼠
        enabled: isClient && isVisible,
        rangeMin: 40,
        rangeMax: 60,
        useLerp: true,
        lerpFactor: 0.1
    });

    // 響應式斷點配置：根據螢幕寬度精確調整輪播參數
    const getResponsiveValues = (width: number) => {
        // Tailwind CSS 斷點對應：sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
        if (width < 640) {
            // 小於 640px：手機直立模式
            return { sliderSize: 10.5, translateZMultiplier: 9, perspective: '25vw' };
        } else if (width < 768) {
            // 640px - 768px：手機橫向/小平板
            return { sliderSize: 9, translateZMultiplier: 8.5, perspective: '35vw' };
        } else if (width < 1024) {
            // 768px - 1024px：平板模式
            return { sliderSize: 8, translateZMultiplier: 8, perspective: '35vw' };
        } else if (width < 1280) {
            // 1024px - 1280px：小桌面
            return { sliderSize: 7, translateZMultiplier: 7.5, perspective: '35vw' };
        } else if (width < 1536) {
            // 1280px - 1536px：大桌面
            return { sliderSize: 5, translateZMultiplier: 7, perspective: '35vw' };
        } else {
            // 1536px+：超大桌面
            return { sliderSize: 4, translateZMultiplier: 6, perspective: '35vw' };
        }
    };

    // 計算值：根據當前視窗寬度取得響應式參數（只在客戶端初始化後使用實際寬度）
    const { sliderSize, translateZMultiplier, perspective } = getResponsiveValues(isClient ? windowWidth : 1024);

    // 資料篩選：從專案資料中篩選出報導章節的項目
    const reportsData: ReportItem[] = (projectsData as ReportItem[]).filter((item: ReportItem) =>
        item.section.includes('reports')
    );

    // 副作用：初始化客戶端狀態和監聽視窗大小變化
    useEffect(() => {
        // 標記客戶端已初始化，啟用響應式功能
        setIsClient(true);

        // 立即設定當前視窗寬度
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }

        // 事件處理函數：更新視窗寬度狀態
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setWindowWidth(window.innerWidth);
            }
        };

        // 註冊視窗大小變化監聽器
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        // 清理函數：移除事件監聽器
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []); // 空依賴陣列：只在組件載入時執行一次

    // 副作用：設定 3D 輪播的初始狀態（只執行一次）
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient) return;

        // 取得所需的 DOM 元素參考
        const sliderWrapper = sliderWrapperRef.current;
        const section = sectionRef.current;
        const sliderContainer = sliderContainerRef.current;

        // 確保所有必要元素都存在
        if (!section || !sliderWrapper || !sliderContainer) return;

        // 設定輪播容器的初始顯示狀態
        gsap.set(sliderContainer, {
            // 完全不透明
            opacity: 1,
            // 正常大小
            scale: 1
        });

        // 設定初始旋轉角度（顯示第一個項目）
        gsap.set(sliderWrapper, {
            rotateY: 0
        });
    }, [isClient]); // 只依賴 isClient，避免重複初始化

    // 副作用：設定拖曳功能
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient) return;

        const sliderWrapper = sliderWrapperRef.current;
        const sliderContainer = sliderContainerRef.current;

        if (!sliderWrapper || !sliderContainer) return;

        // 計算輪播項目的總數量和角度
        const totalItems = reportsData.length;
        const anglePerItem = 360 / totalItems;

        // 切換到指定索引的函數（支援最短路徑旋轉）
        const goToSlide = (index: number, preferredDirection?: 'left' | 'right') => {
            // 確保索引在有效範圍內
            const validIndex = ((index % totalItems) + totalItems) % totalItems;

            // 計算當前角度和目標角度
            const currentRotation = -(currentSlideRef.current * anglePerItem);
            const targetRotation = -validIndex * anglePerItem;

            // 計算最短路徑
            let rotationDiff = targetRotation - currentRotation;

            // 如果有偏好方向，確保按照該方向旋轉
            if (preferredDirection === 'left') {
                // 向左拖曳，逆時針旋轉（負方向）
                if (rotationDiff > 0) {
                    rotationDiff -= 360;
                }
            } else if (preferredDirection === 'right') {
                // 向右拖曳，順時針旋轉（正方向）
                if (rotationDiff < 0) {
                    rotationDiff += 360;
                }
            } else {
                // 沒有偏好方向時，選擇最短路徑
                if (rotationDiff > 180) {
                    rotationDiff -= 360;
                } else if (rotationDiff < -180) {
                    rotationDiff += 360;
                }
            }

            // 計算最終的旋轉角度
            const finalRotation = currentRotation + rotationDiff;

            gsap.to(sliderWrapper, {
                rotateY: finalRotation,
                duration: 0.6,
                ease: "power2.out",
                overwrite: 'auto',
                onComplete: () => {
                    // 動畫完成後，標準化角度
                    gsap.set(sliderWrapper, {
                        rotateY: targetRotation
                    });
                }
            });

            setCurrentSlide(validIndex);
        };

        // 滑鼠/觸控開始事件處理
        const handleStart = (clientX: number) => {
            setIsDragging(true);
            isDraggingRef.current = true;
            setStartX(clientX);
            startXRef.current = clientX;
            setDragDelta(0);
            dragDeltaRef.current = 0;
            setPreviewSlide(currentSlideRef.current); // 開始拖曳時設定預覽索引
        };

        // 滑鼠/觸控移動事件處理
        const handleMove = (clientX: number) => {
            if (!isDraggingRef.current) return;

            const delta = clientX - startXRef.current;
            setDragDelta(delta);
            dragDeltaRef.current = delta;

            // 使用視窗寬度的 20% 作為一個項目的拖曳距離
            const vwToPixels = window.innerWidth * 0.2; // 20vw

            // 計算預覽的項目索引（最多 5 個）
            let itemsDelta = Math.round(delta / vwToPixels);
            itemsDelta = Math.max(-5, Math.min(5, itemsDelta)); // 限制在 -5 到 5 之間

            let tempIndex = currentSlideRef.current - itemsDelta; // 向右為正，所以要減

            // 確保索引在有效範圍內（支援循環）
            tempIndex = ((tempIndex % totalItems) + totalItems) % totalItems;
            setPreviewSlide(tempIndex);

            // 即時旋轉預覽（調整係數讓預覽更貼近實際切換效果）
            // 每 20vw 對應一個項目的旋轉角度
            const rotationDelta = (delta / vwToPixels) * anglePerItem;
            const tempRotation = -(currentSlideRef.current * anglePerItem) + rotationDelta;

            gsap.set(sliderWrapper, {
                rotateY: tempRotation,
                overwrite: 'auto'
            });
        };

        // 滑鼠/觸控結束事件處理
        const handleEnd = () => {
            if (!isDraggingRef.current) return;

            setIsDragging(false);
            isDraggingRef.current = false;

            // 根據拖曳距離計算要切換幾個項目
            const dragDistance = Math.abs(dragDeltaRef.current);

            if (dragDistance > dragThreshold) {
                // 使用視窗寬度的 20% 作為一個項目的拖曳距離
                const vwToPixels = window.innerWidth * 0.2; // 20vw

                // 計算要切換的項目數量（每 20vw 切換一個項目，最多 5 個）
                let itemsToSwitch = Math.floor(dragDistance / vwToPixels) || 1;
                itemsToSwitch = Math.min(5, itemsToSwitch); // 限制最多切換 5 個

                if (dragDeltaRef.current > 0) {
                    // 向右滑動，切換到前面的項目，旋轉方向為右
                    const newIndex = (currentSlideRef.current - itemsToSwitch + totalItems) % totalItems;
                    goToSlide(newIndex, 'right');
                } else {
                    // 向左滑動，切換到後面的項目，旋轉方向為左
                    const newIndex = (currentSlideRef.current + itemsToSwitch) % totalItems;
                    goToSlide(newIndex, 'left');
                }
            } else {
                // 滑動距離不足，回到當前項目
                goToSlide(currentSlideRef.current);
            }

            setDragDelta(0);
            dragDeltaRef.current = 0;
            setPreviewSlide(currentSlideRef.current); // 結束拖曳時重設預覽索引
        };

        // 滑鼠事件監聽
        const handleMouseDown = (e: MouseEvent) => handleStart(e.clientX);
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const handleMouseUp = () => handleEnd();

        // 觸控事件監聽
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX);
            }
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                e.preventDefault(); // 防止頁面滾動
                handleMove(e.touches[0].clientX);
            }
        };
        const handleTouchEnd = () => handleEnd();

        // 註冊事件監聽器
        if (sliderContainer) {
            // 滑鼠事件
            sliderContainer.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            // 觸控事件
            sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
            sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            sliderContainer.addEventListener('touchend', handleTouchEnd);
        }

        // 清理函數
        return () => {
            if (sliderContainer) {
                sliderContainer.removeEventListener('mousedown', handleMouseDown);
                sliderContainer.removeEventListener('touchstart', handleTouchStart);
                sliderContainer.removeEventListener('touchmove', handleTouchMove);
                sliderContainer.removeEventListener('touchend', handleTouchEnd);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isClient, reportsData.length]); // 只依賴必要的值，避免重複綁定事件

    // 讓sliderWrapper rotateX 從90deg變回0degg的動畫
    // 副作用：設定 ScrollTrigger 動畫
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient) return;

        // 註冊 ScrollTrigger 插件
        gsap.registerPlugin(ScrollTrigger);

        const sliderWrapper = sliderWrapperRef.current;
        const currentItemDisplay = currentItemDisplayRef.current;
        const sectionHeading = document.querySelector('#reports-section-heading');

        if (!sliderWrapper || !sectionHeading || !currentItemDisplay) return;

        // 設定初始狀態
        gsap.set(currentItemDisplay, {
            opacity: 0
        });

        // 創建時間軸動畫（在 ScrollTrigger 外部，以便重複使用）
        const tl = gsap.timeline({ paused: true });

        // 設定動畫內容
        tl.fromTo(sliderWrapper,
            {
                // 起始狀態
                rotateX: 90,
                rotateY: 0,
                translateZ: '10vw'  // 總是從 10vw 開始
            },
            {
                // 結束狀態
                rotateX: 0,
                rotateY: 0,  // 總是回到第一個項目
                translateZ: 0,
                duration: 1,
                ease: "power2.out",
                onStart: () => {
                    // 動畫開始時，停止 zoom out 動畫（如果還在進行中）
                    if (zoomOutTweenRef.current && zoomOutTweenRef.current.isActive()) {
                        zoomOutTweenRef.current.kill();
                    }
                    // 立即設定 opacity 確保正確的起始狀態
                    gsap.set(sectionHeading, { opacity: 1 });
                    gsap.set(currentItemDisplay, { opacity: 0 });
                }
            }, 0)
            .fromTo(sectionHeading,
                { opacity: 1 },
                {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0)
            .fromTo(currentItemDisplay,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.5,
                    ease: "power2.in"
                }, 0);

        // 動畫完成的回調
        tl.eventCallback("onComplete", () => {
            // 只在第一次動畫完成時顯示模糊背景
            if (!hasShownBlurOverlayRef.current) {
                hasShownBlurOverlayRef.current = true;
                setShowBlurOverlay(true);
                setHasShownBlurOverlay(true);
                // 鎖定滾動
                document.body.style.overflow = 'hidden';

                // 3 秒後自動隱藏並解鎖滾動
                setTimeout(() => {
                    setShowBlurOverlay(false);
                    // 解鎖滾動
                    document.body.style.overflow = '';
                }, 3000);
            }
        });

        // 建立 ScrollTrigger 動畫
        const scrollTrigger = ScrollTrigger.create({
            trigger: sectionHeading,
            start: 'top top',
            end: 'bottom -20%',
            toggleActions: "none", // 禁用自動觸發
            onEnter: () => {
                // 向下滾動進入時，正向播放
                tl.play();

                // 如果動畫被中斷，確保 opacity 最終到達正確狀態
                gsap.to(sectionHeading, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                gsap.to(currentItemDisplay, {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.5,
                    ease: "power2.in",
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                // 向上滾動離開時，重置到第一個項目
                gsap.to(sliderWrapper, {
                    rotateY: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // 更新當前項目索引為 0
                        setCurrentSlide(0);
                        // 重置完成後再播放反向動畫
                        tl.reverse();
                    }
                });

                // 確保 opacity 也會恢復
                gsap.to(sectionHeading, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.in",
                    overwrite: "auto"
                });
                gsap.to(currentItemDisplay, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            },
            onEnterBack: () => {
                // 從下方再次進入時，直接正向播放（rotateY 已經是 0）
                tl.play();

                // 確保 opacity 狀態正確
                gsap.to(sectionHeading, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                gsap.to(currentItemDisplay, {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.5,
                    ease: "power2.in",
                    overwrite: "auto"
                });
            },
            onLeave: () => {
                // 向下滾動完全離開時，可選擇是否要反向播放
                // tl.reverse();
            }
        });

        // 清理函數
        return () => {
            tl.kill();
            scrollTrigger.kill();
        };
    }, [isClient, isOpeningComplete]);

    // 用來儲存 zoom out 動畫的引用
    const zoomOutTweenRef = useRef<gsap.core.Tween | null>(null);

    // 副作用：開場動畫完成後的 zoom out 效果
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient || !isOpeningComplete) return;

        const sliderWrapper = sliderWrapperRef.current;
        const sectionHeading = document.querySelector('#reports-section-heading');
        if (!sliderWrapper) return;

        // 設定初始狀態（40vw）
        gsap.set(sliderWrapper, {
            translateZ: '40vw'
        });

        // 立即鎖定滾動
        document.body.style.overflow = 'hidden';

        // 動畫到最終狀態（10vw）
        zoomOutTweenRef.current = gsap.to(sliderWrapper, {
            translateZ: '10vw',
            duration: 3,
            ease: 'power4.out'
        });

        // 監聽滾動意圖
        let hasTriggeredAnimation = false;
        const handleScrollIntent = (e: WheelEvent) => {
            if (!hasTriggeredAnimation && sectionHeading) {
                hasTriggeredAnimation = true;
                
                // 手動觸發 ScrollTrigger 的 onEnter 事件
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.trigger === sectionHeading && trigger.vars.onEnter) {
                        trigger.vars.onEnter();
                    }
                });
                
                // 移除監聽器
                window.removeEventListener('wheel', handleScrollIntent);
            }
        };

        // 添加滾輪監聽器
        window.addEventListener('wheel', handleScrollIntent, { passive: true });

        // 清理函數
        return () => {
            if (zoomOutTweenRef.current) {
                zoomOutTweenRef.current.kill();
            }
            window.removeEventListener('wheel', handleScrollIntent);
            // 確保清理時解鎖滾動
            document.body.style.overflow = '';
        };
    }, [isClient, isOpeningComplete]);

    // 計算值：取得當前顯示的報導項目資料（拖曳時顯示預覽項目）
    const displayIndex = isDragging ? previewSlide : currentSlide;
    const currentItem = reportsData[displayIndex] || reportsData[0];

    // 函數：判斷指定索引的影片是否應該播放
    // 策略：當前項目及其前後相鄰項目才播放影片（效能最佳化）
    const shouldPlayVideo = (index: number) => {
        // 取得項目總數
        const totalItems = reportsData.length;
        // 計算前一個項目的索引（環形結構）
        const prevIndex = (currentSlide - 1 + totalItems) % totalItems;
        // 計算下一個項目的索引（環形結構）
        const nextIndex = (currentSlide + 1) % totalItems;

        // 回傳是否為當前項目或相鄰項目
        return index === currentSlide || index === prevIndex || index === nextIndex;
    };

    // 組件渲染輸出（等待客戶端初始化完成後再顯示 3D 效果）
    return (
        // 主容器：設定總體滾動高度以提供足夠的滾動空間
        <div ref={(el) => {
            sectionRef.current = el;
            observerRef.current = el;
        }} className="relative h-screen overflow-visible">
            {/* 黏性容器：在滾動時保持在視窗頂部 */}
            <div className="sticky top-0 w-full h-screen">
                {/* 輪播展示容器：居中定位 */}
                <div
                    ref={sliderContainerRef}
                    className={`absolute w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                    style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    }}
                >
                    {/* 3D 輪播展示區域 */}
                    <div className="w-full h-screen text-center overflow-hidden"
                        style={{
                            // 初始 3D 變換狀態
                            transform: 'translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
                            // 確保 3D 渲染環境
                            transformStyle: 'preserve-3d',
                            // 設定透視距離和動態透視中心點
                            perspective: `${sliderSize * 9}vw`,
                            perspectiveOrigin: isClient && isVisible
                                ? `${mousePosition.x}% ${mousePosition.y}%`
                                : 'center center'
                        }}
                    >
                        {/* 3D 輪播旋轉容器：實際執行旋轉動畫的元素 */}
                        <div
                            ref={sliderWrapperRef}
                            className="absolute z-10"
                            style={{
                                // 動態計算容器位置和尺寸（響應式）
                                top: `calc(50% - ${sliderSize * 1}vw)`,
                                left: `calc(50% - ${sliderSize * 1.5}vw)`,
                                width: `${sliderSize * 3}vw`,
                                height: `${sliderSize * 2}vw`,
                                // 保持 3D 變換樣式
                                transformStyle: 'preserve-3d',
                                // 設定 3D 透視和初始變換（使用響應式透視值）
                                transform: `translateZ(10vw) rotateX(90deg) rotateY(0deg) rotateZ(0deg)`
                            }}
                        >
                            {/* 渲染所有報導項目：建立 3D 圓形輪播結構 */}
                            {reportsData.map((item, index) => (
                                // 單個報導項目容器
                                <div
                                    key={item.id}
                                    className="absolute inset-0"
                                    style={{
                                        // 保持 3D 變換樣式
                                        transformStyle: 'preserve-3d',
                                        // 計算每個項目在圓形輪播中的位置
                                        // 根據索引分配角度，並在 Z 軸上向外推移形成圓形
                                        transform: `rotateY(calc(${index} * (360 / ${reportsData.length}) * 1deg)) rotateZ(0deg) translateZ(${sliderSize * 6}vw)`,
                                        // 設定項目尺寸
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    {/* 報導項目內容組件 */}
                                    <ReportsSwiperItem
                                        id={item.id}
                                        path={item.path}
                                        title={item.title}
                                        subtitle={item.subtitle || ''}
                                        bgColor={item.bgColor}
                                        shouldPlay={shouldPlayVideo(index)}
                                        projectData={item}
                                        isDragging={isDragging}
                                        dragDelta={dragDelta}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 當前項目資訊展示區域：顯示在輪播下方 */}
                <div
                    ref={currentItemDisplayRef}
                    className="absolute bottom-8 w-full"
                    style={{
                        opacity: 0
                    }}
                >
                    <CurrentItemDisplay
                        title={currentItem?.title}
                        subtitle={currentItem?.subtitle}
                    />
                </div>
            </div>

            {/* 模糊背景層 */}
            {showBlurOverlay && (
                <div
                    className="fixed inset-0 w-full h-screen z-[9999] transition-opacity duration-300"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0,0.8)'
                    }}
                >
                    {/* 模糊背景效果 */}
                    <div className="absolute inset-0 backdrop-blur-sm opacity-80" />

                    {/* 在這裡加入你想要的內容 */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {/* 範例：中央內容區域 */}
                        <div className="text-white text-4xl font-bold">
                            {/* 在這裡放入你的內容 */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}