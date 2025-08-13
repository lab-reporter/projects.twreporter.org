'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useStore } from '@/stores'
import projectsData from '@/app/data/projects.json'
import gsap from 'gsap'
import { Draggable } from 'gsap/dist/Draggable'
import { CurrentItemDisplay } from '@/components/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

// 註冊 GSAP 插件
if (typeof window !== 'undefined') {
    gsap.registerPlugin(Draggable)
}

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

interface CardTransform {
    x: number
    y: number
    z: number
    rotateX: number
    rotateY: number
    rotateZ: number
    scale: number
    opacity: number
}

// ============================
// 配置參數
// ============================
const SWIPER_CONFIG = {
    // 動畫設定
    animation: {
        duration: 0.6,
        ease: 'power2.inOut'
    },

    // 響應式卡片數量配置
    responsive: {
        mobile: 3,    // < 768px
        tablet: 5,    // 768px - 1024px
        desktop: 5,   // 1024px - 1536px
        wide: 7       // >= 1536px
    },

    // 卡片變換參數（可調整）
    transforms: {
        5: [ // 5張卡片配置
            { x: -1200, y: 0, z: -200, rotateX: 0, rotateY: 18, rotateZ: 0, scale: 0.8, opacity: 1 },
            { x: -300, y: 0, z: -100, rotateX: 0, rotateY: 12, rotateZ: 0, scale: 0.9, opacity: 1 },
            { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 },
            { x: 300, y: 0, z: -100, rotateX: 0, rotateY: -12, rotateZ: 0, scale: 0.9, opacity: 1 },
            { x: 1200, y: 0, z: -200, rotateX: 0, rotateY: -18, rotateZ: 0, scale: 0.8, opacity: 1 }
        ],
        3: [ // 3張卡片配置（平板）
            { x: -200, y: 0, z: -100, rotateX: 0, rotateY: 15, rotateZ: 0, scale: 0.85, opacity: 1 },
            { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 },
            { x: 200, y: 0, z: -100, rotateX: 0, rotateY: -15, rotateZ: 0, scale: 0.85, opacity: 1 }
        ],
        7: [ // 7張卡片配置（超寬螢幕）
            { x: -480, y: 0, z: -300, rotateX: 0, rotateY: 25, rotateZ: 0, scale: 0.7, opacity: 1 },
            { x: -320, y: 0, z: -200, rotateX: 0, rotateY: 18, rotateZ: 0, scale: 0.8, opacity: 1 },
            { x: -160, y: 0, z: -100, rotateX: 0, rotateY: -12, rotateZ: 0, scale: 0.9, opacity: 1 },
            { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 },
            { x: 160, y: 0, z: -100, rotateX: 0, rotateY: 12, rotateZ: 0, scale: 0.9, opacity: 1 },
            { x: 320, y: 0, z: -200, rotateX: 0, rotateY: -18, rotateZ: 0, scale: 0.8, opacity: 1 },
            { x: 480, y: 0, z: -300, rotateX: 0, rotateY: -25, rotateZ: 0, scale: 0.7, opacity: 1 }
        ]
    }
}

// ============================
// 主組件
// ============================
const ChallengesSwiper: React.FC = () => {
    // DOM 參考
    const containerRef = useRef<HTMLDivElement>(null)
    const cardsContainerRef = useRef<HTMLDivElement>(null)
    const draggableRef = useRef<Draggable[] | null>(null)

    // 狀態管理
    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleCards, setVisibleCards] = useState(5)
    const [isDragging, setIsDragging] = useState(false)
    const { openModal } = useStore()

    // 從 projects.json 過濾 challenge 資料
    const challengeData = useMemo(() => {
        const data = (projectsData as ChallengeItem[]).filter((item: ChallengeItem) => {
            if (Array.isArray(item.section)) {
                return item.section.includes('challenge')
            }
            return item.section === 'challenge'
        })
        console.log('Challenge data:', data) // Debug log
        return data
    }, [])

    // 取得當前顯示的項目
    const currentItem = challengeData[currentIndex] || challengeData[0]

    // ============================
    // 響應式處理
    // ============================
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            let cards = SWIPER_CONFIG.responsive.desktop

            if (width < 768) {
                cards = SWIPER_CONFIG.responsive.mobile
            } else if (width < 1024) {
                cards = SWIPER_CONFIG.responsive.tablet
            } else if (width >= 1536) {
                cards = SWIPER_CONFIG.responsive.wide
            }

            setVisibleCards(cards)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // ============================
    // 取得卡片變換參數
    // ============================
    const getCardTransform = (cardIndex: number, centerIndex: number): CardTransform => {
        const transforms = SWIPER_CONFIG.transforms[visibleCards as keyof typeof SWIPER_CONFIG.transforms]
            || SWIPER_CONFIG.transforms[5]

        const totalCards = challengeData.length
        const halfVisible = Math.floor(visibleCards / 2)

        // 計算相對位置
        let relativePos = cardIndex - centerIndex

        // 處理循環
        if (relativePos > halfVisible) {
            relativePos -= totalCards
        } else if (relativePos < -halfVisible) {
            relativePos += totalCards
        }

        // 如果卡片在可見範圍內
        if (Math.abs(relativePos) <= halfVisible) {
            const transformIndex = relativePos + halfVisible
            return transforms[transformIndex] || {
                x: 0, y: 0, z: -500, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.5, opacity: 0
            }
        }

        // 不可見的卡片
        return {
            x: 0, y: 0, z: -500, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.5, opacity: 0
        }
    }

    // ============================
    // 更新卡片位置
    // ============================
    const updateCardsPosition = (targetIndex: number) => {
        const cards = gsap.utils.toArray('.challenge-card') as HTMLElement[]

        console.log('Updating cards position for index:', targetIndex, 'Found cards:', cards.length)

        cards.forEach((card, index) => {
            const transform = getCardTransform(index, targetIndex)

            console.log(`Card ${index} transform:`, transform)

            gsap.to(card, {
                x: transform.x,
                y: transform.y,
                z: transform.z,
                rotateX: transform.rotateX,
                rotateY: transform.rotateY,
                rotateZ: transform.rotateZ,
                scale: transform.scale,
                opacity: transform.opacity,
                duration: SWIPER_CONFIG.animation.duration,
                ease: SWIPER_CONFIG.animation.ease,
                overwrite: 'auto'
            })
        })
    }

    // ============================
    // 初始化卡片位置
    // ============================
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (!cardsContainerRef.current) return

        const cards = gsap.utils.toArray('.challenge-card') as HTMLElement[]

        // 只在初次載入或視窗大小改變時設置初始位置
        if (isInitialMount.current || visibleCards) {
            cards.forEach((card, index) => {
                const transform = getCardTransform(index, currentIndex)

                // 初次載入時直接設置位置
                if (isInitialMount.current) {
                    gsap.set(card, {
                        x: transform.x,
                        y: transform.y,
                        z: transform.z,
                        rotateX: transform.rotateX,
                        rotateY: transform.rotateY,
                        rotateZ: transform.rotateZ,
                        scale: transform.scale,
                        opacity: transform.opacity
                    })
                } else {
                    // 後續更新使用動畫
                    gsap.to(card, {
                        x: transform.x,
                        y: transform.y,
                        z: transform.z,
                        rotateX: transform.rotateX,
                        rotateY: transform.rotateY,
                        rotateZ: transform.rotateZ,
                        scale: transform.scale,
                        opacity: transform.opacity,
                        duration: SWIPER_CONFIG.animation.duration,
                        ease: SWIPER_CONFIG.animation.ease
                    })
                }
            })

            if (isInitialMount.current) {
                isInitialMount.current = false
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, visibleCards])

    // ============================
    // 拖曳功能
    // ============================
    useEffect(() => {
        if (!cardsContainerRef.current) return

        // 清理舊的拖曳實例
        if (draggableRef.current) {
            draggableRef.current[0].kill()
        }

        // 創建拖曳實例
        draggableRef.current = Draggable.create(cardsContainerRef.current, {
            type: 'x',
            edgeResistance: 0.65,
            bounds: { minX: -100, maxX: 100 },
            inertia: true,
            onDragStart: () => setIsDragging(true),
            onDragEnd: function () {
                setIsDragging(false)

                const dragDistance = this.x
                const threshold = 50

                if (dragDistance > threshold) {
                    goToPrevious()
                } else if (dragDistance < -threshold) {
                    goToNext()
                }

                // 重置位置
                gsap.to(cardsContainerRef.current, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                })
            }
        })

        return () => {
            if (draggableRef.current) {
                draggableRef.current[0].kill()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])

    // ============================
    // 導航函數
    // ============================
    const goToNext = () => {
        const nextIndex = (currentIndex + 1) % challengeData.length
        console.log('Going to next:', currentIndex, '->', nextIndex)
        setCurrentIndex(nextIndex)
        // 延遲一個 frame 確保 state 更新
        requestAnimationFrame(() => {
            updateCardsPosition(nextIndex)
        })
    }

    const goToPrevious = () => {
        const prevIndex = (currentIndex - 1 + challengeData.length) % challengeData.length
        console.log('Going to previous:', currentIndex, '->', prevIndex)
        setCurrentIndex(prevIndex)
        // 延遲一個 frame 確保 state 更新
        requestAnimationFrame(() => {
            updateCardsPosition(prevIndex)
        })
    }

    // ============================
    // 鍵盤控制
    // ============================
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious()
            } else if (e.key === 'ArrowRight') {
                goToNext()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])

    // ============================
    // 處理卡片點擊
    // ============================
    const handleCardClick = (item: ChallengeItem, index: number) => {
        if (isDragging) return

        if (index === currentIndex) {
            // 點擊中央卡片，開啟 Modal
            openModal(item.id, item as Record<string, unknown>)
        } else {
            // 點擊側邊卡片，也開啟對應的 Modal
            openModal(item.id, item as Record<string, unknown>)
        }
    }

    // ============================
    // 渲染
    // ============================
    return (
        <div className="w-full h-auto relative mt-16">
            {/* 3D 場景容器 */}
            <div
                ref={containerRef}
                className="w-full h-[600px] flex items-center justify-center"
                style={{
                    perspective: '500px',
                    perspectiveOrigin: 'center center'
                }}
            >
                {/* 卡片容器 */}
                <div
                    ref={cardsContainerRef}
                    className="relative"
                    style={{
                        transformStyle: 'preserve-3d',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {challengeData.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="challenge-card absolute w-[40vw] h-[30vw] left-[-20vw] top-[-15vw]"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleCardClick(item, index)}
                            >
                                <div className="relative w-full h-full rounded-sm overflow-hidden shadow-2xl bg-white">
                                    <Image
                                        src={item.path}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="280px"
                                        priority={index === currentIndex}
                                    />

                                    {/* 卡片內容疊層 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 導航控制區 */}
            <div className="absolute bottom-[-8rem] w-full flex justify-center items-center z-50">
                <button
                    onClick={goToPrevious}
                    className="group relative p-3 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300"
                    aria-label="上一個挑戰"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                        上一個
                    </div>
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
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                        下一個
                    </div>
                </button>
            </div>
        </div>
    )
}

export default ChallengesSwiper