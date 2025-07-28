'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';

interface ReportsStickyPhotoProps {
    imgSrcs: string[];
    alts?: string[];
    positions?: Array<{
        top: string;
        left: string;
        z: number;
    }>;
}

export default function ReportsStickyPhoto({ imgSrcs, alts, positions }: ReportsStickyPhotoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用滑鼠追蹤 Hook
    useMouseTracking3D({
        enabled: true,
        targetRef: containerRef,
        cssProperty: 'perspectiveOrigin',
        rangeMin: 30,
        rangeMax: 70,
        useLerp: true,
        lerpFactor: 0.1
    });

    // 產生預設位置（如果沒有提供 positions）
    const getDefaultPositions = (count: number) => {
        const positions = [];
        for (let i = 0; i < count; i++) {
            // 使用簡單的網格分布
            const row = Math.floor(i / 3);
            const col = i % 3;
            positions.push({
                top: `${20 + row * 30}%`,
                left: `${10 + col * 30}%`,
                z: 30 + (i % 3) * 20 // 交錯的 z 值產生深度感
            });
        }
        return positions;
    };

    const imagePositions = positions || getDefaultPositions(imgSrcs.length);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen relative"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '500px',
            }}>
            {imgSrcs.map((imgSrc, index) => {
                const position = imagePositions[index] || { top: '50%', left: '50%', z: 0 };
                
                return (
                    <div
                        key={index}
                        className="w-[35vw] h-auto absolute transition-all duration-300"
                        style={{
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
                            src={imgSrc}
                            alt={alts?.[index] || `reports-photo-${index + 1}`}
                            width={2000}
                            height={1333}
                            className="w-full h-auto border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        />
                    </div>
                );
            })}
        </div>
    );
}