'use client'

import React, { useRef, useState, useMemo } from 'react'
import { useStore } from '@/stores'
import projectsData from '@/app/data/projects.json'
import { CurrentItemDisplay } from '@/components/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

// import required modules
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules'

// ============================
// 型別定義
// ============================
interface ChallengeItem {
    id: string
    path: string
    title: string
    subtitle?: string
    section: string | string[]
    bgColor?: string
    [key: string]: unknown
}

// ============================
// 主組件
// ============================
const ChallengesSwiper: React.FC = () => {
    // Swiper 實例參考
    const swiperRef = useRef<SwiperType | null>(null)

    // 狀態管理
    const [activeIndex, setActiveIndex] = useState(0)
    const { openModal } = useStore()

    // 從 projects.json 過濾 challenge 資料
    const challengeData = useMemo(() => {
        const data = (projectsData as ChallengeItem[]).filter((item: ChallengeItem) => {
            if (Array.isArray(item.section)) {
                return item.section.includes('challenge')
            }
            return item.section === 'challenge'
        })
        console.log('Challenge data:', data)
        return data
    }, [])

    // 取得當前顯示的項目
    const currentItem = challengeData[activeIndex] || challengeData[0]

    // ============================
    // 事件處理
    // ============================
    const handleSlideChange = (swiper: SwiperType) => {
        // 當使用 loop 時，需要使用 realIndex 來獲取實際的索引
        setActiveIndex(swiper.realIndex)
    }

    const handleCardClick = (item: ChallengeItem, index: number) => {
        // 使用 realIndex 進行比較
        const realIndex = swiperRef.current?.realIndex ?? 0
        if (index === realIndex) {
            // 點擊當前活動卡片，開啟 Modal
            openModal(item.id, item as Record<string, unknown>)
        } else {
            // 點擊其他卡片，切換到該卡片
            swiperRef.current?.slideTo(index)
        }
    }

    const goToNext = () => {
        swiperRef.current?.slideNext()
    }

    const goToPrevious = () => {
        swiperRef.current?.slidePrev()
    }

    // ============================
    // 渲染
    // ============================
    return (
        <div className="w-full relative overflow-hidden mt-12">
            {/* Swiper 容器 */}
            <div className="relative">
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    loop={true}  // 啟用循環
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    initialSlide={0}
                    coverflowEffect={{
                        rotate: 15,  // 旋轉角度
                        stretch: 0,  // 拉伸
                        depth: 200,  // 深度
                        modifier: 1, // 修改器強度
                        slideShadows: false, // 陰影
                    }}
                    keyboard={{
                        enabled: true,
                        onlyInViewport: true,
                    }}
                    navigation={false} // 使用自定義導航按鈕
                    modules={[EffectCoverflow, Navigation, Keyboard]}
                    onSlideChange={handleSlideChange}
                    className="challenges-swiper"
                    style={{
                        paddingTop: '60px',
                        paddingBottom: '60px',
                        overflow: 'visible'
                    }}
                >
                    {challengeData.map((item, index) => (
                        <SwiperSlide
                            key={item.id}
                            style={{
                                width: '35vw',
                                height: '26vw',
                                minWidth: '400px',
                                minHeight: '300px',
                                maxWidth: '600px',
                                maxHeight: '450px'
                            }}
                            data-swiper-slide-index={index}
                        >
                            <div
                                className="relative w-full h-full cursor-pointer"
                                onClick={() => handleCardClick(item, index)}
                            >
                                <div className="relative w-full h-full rounded-sm overflow-hidden shadow-2xl bg-white transform transition-transform duration-300 hover:scale-105">
                                    <Image
                                        src={item.path}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        priority={index === activeIndex}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 導航控制區與 CurrentItemDisplay */}
            <div className="mt-8 w-full flex justify-center items-center">
                <button
                    onClick={goToPrevious}
                    className="group relative p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300"
                    aria-label="上一個挑戰"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </button>

                <CurrentItemDisplay
                    title={currentItem?.title}
                    subtitle={currentItem?.subtitle}
                    className="min-w-[35rem] mx-6"
                />

                <button
                    onClick={goToNext}
                    className="group relative p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300"
                    aria-label="下一個挑戰"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </button>
            </div>

            {/* 自定義樣式 */}
            <style jsx global>{`
                .challenges-swiper {
                    width: 100%;
                    padding: 40px 0;
                }
                
                .challenges-swiper .swiper-slide {
                    background-position: center;
                    background-size: cover;
                }
                
                .challenges-swiper .swiper-slide-active {
                    z-index: 10;
                }
                
                /* 調整 3D 透視效果 */
                .swiper-3d .swiper-slide-shadow-left,
                .swiper-3d .swiper-slide-shadow-right {
                    background-image: none;
                }
                
                /* 響應式調整 */
                @media (max-width: 768px) {
                    .challenges-swiper .swiper-slide {
                        width: 80vw !important;
                        height: 60vw !important;
                    }
                }
                
                @media (max-width: 1024px) {
                    .challenges-swiper .swiper-slide {
                        width: 50vw !important;
                        height: 37.5vw !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default ChallengesSwiper