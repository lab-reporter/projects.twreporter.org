'use client';

import { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import Image from 'next/image';

// 引入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

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
        setCurrentSlide(swiper.activeIndex);
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
        <div className="relative w-full h-[100dvh] flex flex-col">
            {/* Swiper 輪播區域 */}
            <div className="flex-1 relative">
                <Swiper
                    modules={[Navigation, Pagination, EffectCards]}
                    effect="cards"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    cardsEffect={{
                        perSlideOffset: 8,
                        perSlideRotate: 2,
                        rotate: true,
                        slideShadows: true,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    onSlideChange={handleSlideChange}
                    onSwiper={handleSwiperInit}
                    className="w-full h-full"
                    style={{
                        padding: '0 20px',
                    }}
                >
                    {reportsData.map((item, index) => (
                        <SwiperSlide
                            key={item.id}
                            className="relative rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div className="relative w-full h-full">
                                {/* 報導圖片 */}
                                <Image
                                    src={item.path}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 90vw, 50vw"
                                    priority={index === 0} // 首張圖片優先載入
                                />
                                
                                {/* 漸層遮罩 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                
                                {/* 報導資訊 */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 
                                        className="text-xl font-bold mb-2 leading-tight cursor-pointer hover:text-blue-300 transition-colors"
                                        onClick={() => handleTitleClick(item)}
                                        dangerouslySetInnerHTML={{ __html: item.title }}
                                    />
                                    <p className="text-sm opacity-90 leading-relaxed">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 當前項目資訊與導航控制 */}
            <div className="absolute bottom-[10%] left-0 right-0 z-20">
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
                    displayClassName="text-white"
                    className="px-4"
                />
            </div>
        </div>
    );
}
