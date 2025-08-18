'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '@/app/data/projects.json';
import { CurrentItemDisplay } from '@/components/shared';
import ReportsSwiperItem from './ReportsSwiperItem';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

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

// 報導輪播組件主函數（原始 ScrollTrigger 版本）
export default function ReportsSwiperOrigin() {
    // DOM 元素參考：輪播容器的旋轉外框
    const sliderWrapperRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：整個章節區域
    const sectionRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：輪播展示容器
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    // 狀態變數：當前顯示的輪播項目索引
    const [currentSlide, setCurrentSlide] = useState(0);
    // 狀態變數：是否已完成客戶端初始化（解決 SSR/CSR 不匹配問題）
    const [isClient, setIsClient] = useState(false);
    // 狀態變數：瀏覽器視窗寬度（用於響應式設計）
    const [windowWidth, setWindowWidth] = useState(1024); // 統一初始值，避免 SSR/CSR 不匹配

    // 可見性偵測
    const { elementRef: observerRef, isVisible } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '100px'
    });

    // 優化的滑鼠追蹤（行動裝置自動停用）
    const mousePosition = useMouseTracking3D({
        // 啟用條件：客戶端已載入且章節可見時才追蹤滑鼠
        enabled: isClient && isVisible,
        rangeMin: 47,
        rangeMax: 53,
        useLerp: true,
        lerpFactor: 0.1
        // 使用預設的行動裝置停用設定（disableOnMobile: true, disableOnTablet: true）
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

    // 副作用：設定 3D 輪播的滾動觸發動畫
    useEffect(() => {
        // 檢查是否在瀏覽器環境中運行且客戶端已初始化
        if (typeof window === 'undefined' || !isClient) return;

        // 註冊 ScrollTrigger 外掛程式
        gsap.registerPlugin(ScrollTrigger);

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

        // 建立滾動觸發器：控制 3D 輪播旋轉動畫
        const trigger = ScrollTrigger.create({
            // 觸發元素：整個章節區域
            trigger: section,
            // 開始觸發點：章節頂部到達視窗頂部
            start: 'top top',
            // 結束觸發點：章節底部離開視窗底部
            end: 'bottom bottom',
            // 動畫與滾動同步程度（數值越大越平滑）
            scrub: 2,
            // 滾動更新時的回調函數
            onUpdate: (self) => {
                // 計算輪播項目的總數量
                const totalItems = reportsData.length;
                // 計算每個項目間的角度間隔
                const anglePerItem = 360 / totalItems;

                // 設定滾動範圍的緩衝區域（避免過快切換）
                const startBuffer = 0.025;
                const endBuffer = 0.025;
                const activeRange = 1 - startBuffer - endBuffer;

                // 初始化當前項目索引
                let currentIndex = 0;

                // 根據滾動進度計算當前應顯示的項目
                if (self.progress <= startBuffer) {
                    // 滾動進度在起始緩衝區內：顯示第一個項目
                    currentIndex = 0;
                } else if (self.progress >= (1 - endBuffer)) {
                    // 滾動進度在結束緩衝區內：顯示最後一個項目
                    currentIndex = totalItems - 1;
                } else {
                    // 滾動進度在主要範圍內：根據進度計算項目索引
                    const adjustedProgress = (self.progress - startBuffer) / activeRange;
                    currentIndex = Math.round(adjustedProgress * (totalItems - 1));
                    // 確保索引在有效範圍內
                    currentIndex = Math.max(0, Math.min(currentIndex, totalItems - 1));
                }

                // 計算目標旋轉角度（負值表示順時針旋轉）
                const targetRotation = -currentIndex * anglePerItem;

                // 執行輪播容器的旋轉動畫
                gsap.to(sliderWrapper, {
                    // Y軸旋轉角度
                    rotateY: targetRotation,
                    // 動畫持續時間
                    duration: 0.9,
                    // 緩動函數
                    ease: "power2.out",
                    // 覆寫模式：自動取消衝突的動畫
                    overwrite: 'auto'
                });

                // 更新當前顯示項目的狀態
                setCurrentSlide(currentIndex);
            },
            // 滾動觸發器識別 ID
            id: 'reports-trigger'
        });

        // 清理函數：組件卸載時移除滾動觸發器
        return () => {
            trigger.kill();
        };
        // 依賴變數：當這些值改變時重新建立動畫（等待客戶端初始化完成）
    }, [reportsData, sliderSize, translateZMultiplier, perspective, isClient]);

    // 計算值：取得當前顯示的報導項目資料
    const currentItem = reportsData[currentSlide] || reportsData[0];

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
            if (sectionRef) (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            if (observerRef) (observerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }} className="relative h-[500vh] overflow-visible">
            {/* 黏性容器：在滾動時保持在視窗頂部 */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                {/* 輪播展示容器：居中定位 */}
                <div ref={sliderContainerRef} className="absolute w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
                                transform: `translateZ(0vw) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
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
                                        transform: `rotateY(calc(${index} * (360 / ${reportsData.length}) * 1deg)) rotateZ(10deg) translateZ(${sliderSize * 6}vw)`,
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
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 當前項目資訊展示區域：顯示在輪播下方 */}
                <div className="absolute bottom-8 w-full">
                    <CurrentItemDisplay
                        title={currentItem?.title}
                        subtitle={currentItem?.subtitle}
                    />
                </div>
            </div>
        </div>
    );
}