'use client';

import { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import Image from 'next/image';

// 引入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import projectsData from '@/app/data/projects.json';
import { ItemDisplayWithNavigation } from '@/components/shared';
import { useStore } from '@/stores';

// ============================
// 型別定義
// ============================
interface ReportItem {
    id: string;
    path: string;
    title: string;
    subtitle?: string;
    section: string[];
    [key: string]: unknown;
}

// ============================
// 手機版報導輪播組件
// ============================
export default function ReportsSwiperMobile() {
    // ============================
    // 狀態管理
    // ============================
    const [currentSlide, setCurrentSlide] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    // ============================
    // 資料處理
    // ============================
    // 從專案資料中篩選報導項目
    const reportsData: ReportItem[] = (projectsData as ReportItem[]).filter((item: ReportItem) =>
        item.section.includes('reports')
    );

    // 取得當前顯示的項目
    const currentItem = reportsData[currentSlide] || reportsData[0];

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
        // 處理 loop 模式：Swiper 在 loop 模式下會有額外的複製 slide
        // 使用 realIndex 來取得真實的索引位置
        setCurrentSlide(swiper.realIndex);
    }, []);

    const handleSwiperInit = useCallback((swiper: SwiperType) => {
        swiperRef.current = swiper;
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
                modules={[EffectCoverflow, Pagination]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                    rotate: 60,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}
                loop={true}
                // 確保第一張在正中央
                initialSlide={0}
                className="w-full"
                style={{
                }}
            >
                {reportsData.map((item, index) => (
                    <SwiperSlide
                        key={item.id}
                        className="relative select-none"
                        style={{
                            width: '300px', // 固定寬度讓 slidesPerView="auto" 正常運作
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                        }}
                    >
                        <div
                            className="relative w-full aspect-[4/3] select-none"
                            style={{
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                MozUserSelect: "none",
                                msUserSelect: "none",
                            }}
                        >
                            {/* 報導圖片 */}
                            <Image
                                src={item.path}
                                alt={item.title}
                                fill
                                className="object-cover select-none pointer-events-none"
                                sizes="(max-width: 1024px) 90vw, 50vw"
                                priority={index === 0} // 首張圖片優先載入
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                style={{
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    MozUserSelect: "none",
                                    msUserSelect: "none",
                                }}
                            />
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
                    previousLabel="上一個報導"
                    nextLabel="下一個報導"
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
