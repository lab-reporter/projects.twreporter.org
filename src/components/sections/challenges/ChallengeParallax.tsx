'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D'

const parallaxImages = [
    // 在這裡添加更多圖片物件
    {
        src: "/assets/challenges/challenge-1/challenge-1-2.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 45,
        width: "12.5%",
        top: "20%",
        left: "10%",
        zIndex: 1
    },
    {
        src: "/assets/challenges/challenge-1/challenge-1-1.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 50,
        width: "7.5%",
        top: "30%",
        left: "5%",
        zIndex: 2
    },
    {
        src: "/assets/challenges/challenge-2/challenge-2-1.jpg",
        alt: "Challenge Parallax Image 1",
        x: 0,
        y: 0,
        z: 80,
        width: "10%",
        top: "10%",
        left: "30%",
        zIndex: 1
    },
]

const ChallengeParallax = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用滑鼠追蹤 Hook
    useMouseTracking3D({
        enabled: true,
        targetRef: containerRef,
        cssProperty: 'perspectiveOrigin',
        rangeMin: 30,  // 可調整範圍
        rangeMax: 70,  // 可調整範圍
        useLerp: true,
        lerpFactor: 0.1
    });

    return (
        <div
            ref={containerRef}
            className="w-full h-screen absolute top-0 left-0"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '500px',
                // perspectiveOrigin 由 useMouseTracking3D 自動管理
            }}>
            {parallaxImages.map((image, index) => (
                <div
                    key={index}
                    style={{
                        transform: `translate3d(${image.x}px, ${image.y}px, ${image.z}px)`,
                        width: image.width,
                        top: image.top,
                        left: image.left,
                        zIndex: image.zIndex
                    }}
                    className="aspect-[3/2] absolute">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover" />
                </div>
            ))}
        </div>
    )
}

export default ChallengeParallax