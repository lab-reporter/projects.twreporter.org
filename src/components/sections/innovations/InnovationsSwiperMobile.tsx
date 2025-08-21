'use client';

import { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, EffectFlip } from 'swiper/modules';

// 引入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';

import projectsData from '@/app/data/projects.json';
import { ItemDisplayWithNavigation } from '@/components/shared';
import { useStore } from '@/stores';
import { getResponsiveImagePath, type ProjectData } from '@/utils/responsiveImage';

// ============================
// 型別定義
// ============================
interface InnovationItem {
    id: string;
    path: string;
    imageSRC?: string;
    videoSRC?: string; // 手機版使用的 MP4 影片
    title: string;
    subtitle?: string;
    section: string[];
    [key: string]: unknown;
}

// ============================
// 手機版創新輪播組件
// ============================
export default function InnovationsSwiperMobile() {
    // ============================
    // 狀態管理
    // ============================
    const [currentSlide, setCurrentSlide] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    // ============================
    // 資料處理
    // ============================
    // 從專案資料中篩選創新項目並排序
    const innovationsData: InnovationItem[] = (projectsData as ProjectData[])
        .filter((item: ProjectData) => item.section.includes('innovation'))
        .sort((a: ProjectData, b: ProjectData) => {
            const numA = parseInt(a.id.split('-')[1]);
            const numB = parseInt(b.id.split('-')[1]);
            return numA - numB;
        }) as InnovationItem[];

    // 取得當前顯示的項目
    const currentItem = innovationsData[currentSlide] || innovationsData[0];

    // ============================
    // 導航控制函數
    // ============================
    const goToNext = useCallback(() => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    }, []);

    const goToPrevious = useCallback(() => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    }, []);

    // ============================
    // 事件處理函數
    // ============================
    const handleSlideChange = useCallback((swiper: SwiperType) => {
        // 處理 loop 模式：使用 realIndex 來取得真實的索引位置
        setCurrentSlide(swiper.realIndex);
    }, []);

    const handleSwiperInit = useCallback((swiper: SwiperType) => {
        swiperRef.current = swiper;
    }, []);

    // 處理項目點擊開啟 Modal
    const handleItemClick = useCallback((item: InnovationItem) => {
        // flip 效果一次只顯示一張，當前顯示的就是可以點擊的
        const { openModal } = useStore.getState();
        openModal(item.id, item);
    }, []);

    // 處理標題點擊開啟 Modal
    const handleTitleClick = useCallback((item: Record<string, unknown>) => {
        const { openModal } = useStore.getState();
        openModal(item.id as string, item);
    }, []);

    // ============================
    // 渲染
    // ============================
    return (
        <div
            className="relative w-full flex flex-col gap-16 select-none"
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
        >
            {/* Swiper 輪播區域 */}
            <Swiper
                modules={[EffectFlip, Pagination, Navigation]}
                effect="flip"
                grabCursor={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}
                loop={true}
                // 確保第一張在正中央
                initialSlide={0}
                className="w-full max-w-sm mx-auto"
                style={{
                    paddingBottom: '50px', // 為 pagination 留空間
                }}
            >
                {innovationsData.map((item, index) => (
                    <SwiperSlide
                        key={item.id}
                        className="relative select-none"
                        style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                        }}
                    >
                        <div
                            className="relative w-full aspect-[4/3] select-none cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                MozUserSelect: "none",
                                msUserSelect: "none",
                            }}
                            onClick={() => handleItemClick(item)}
                        >
                            {/* 創新項目影片 - 使用響應式封面圖 */}
                            <video
                                src={item.videoSRC} // 使用 MP4 格式的影片
                                poster={getResponsiveImagePath(item as unknown as ProjectData, 'innovations-mobile')} // 使用響應式封面圖
                                className="w-full h-full object-cover select-none rounded-lg"
                                muted
                                playsInline
                                preload="metadata"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                style={{
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    MozUserSelect: "none",
                                    msUserSelect: "none",
                                }}
                                // 當前顯示的影片會自動播放
                                autoPlay={index === currentSlide}
                                loop={index === currentSlide}
                            />

                            {/* 視覺提示層 */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 當前項目資訊與導航控制 */}
            <div className="">
                <ItemDisplayWithNavigation
                    title={currentItem?.title}
                    subtitle={currentItem?.subtitle}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    previousLabel="上一個創新項目"
                    nextLabel="下一個創新項目"
                    navigationDisabled={false}
                    currentItem={currentItem}
                    onTitleClick={handleTitleClick}
                    displayClassName=""
                    className="px-4"
                />
            </div>
        </div>
    );
}
