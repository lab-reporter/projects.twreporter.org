'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';

interface PhotoItem {
    src: string;
    alt?: string;
    position?: {
        top: string;
        left: string;
        z: number;
    };
    width?: string;
}

interface ReportsParallaxPhotoProps {
    photos: PhotoItem[];
}

export default function ReportsParallaxPhoto({ photos }: ReportsParallaxPhotoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用滑鼠追蹤 Hook
    useMouseTracking3D({
        enabled: true,
        targetRef: containerRef,
        cssProperty: 'perspectiveOrigin',
        rangeMin: 20,
        rangeMax: 80,
        useLerp: true,
        lerpFactor: 0.1
    });

    // 產生預設位置
    const getDefaultPosition = (index: number) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return {
            top: `${20 + row * 30}%`,
            left: `${10 + col * 30}%`,
            z: 30 + (index % 3) * 20
        };
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-screen relative"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '500px',
            }}>
            {photos.map((photo, index) => {
                const position = photo.position || getDefaultPosition(index);
                const width = photo.width || '25vw';

                return (
                    <div
                        key={index}
                        className="h-auto absolute transition-all duration-300"
                        style={{
                            width: width,
                            top: position.top,
                            left: position.left,
                            transform: `translateZ(${position.z}px)`,
                            zIndex: Math.floor(position.z / 10)
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = `translateZ(${position.z}px) scale(1.05)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `translateZ(${position.z}px) scale(1)`;
                        }}>
                        <Image
                            src={photo.src}
                            alt={photo.alt || `reports-photo-${index + 1}`}
                            width={2000}
                            height={1333}
                            className="w-full h-auto border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        />
                        {/* 調試資訊 - 顯示位置和寬度參數 */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            <div>T: {position.top} | L: {position.left}</div>
                            <div>Z: {position.z} | W: {width}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}