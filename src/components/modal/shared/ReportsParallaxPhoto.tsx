'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { getResponsiveValue, type ResponsiveValue } from '@/utils/responsive';

// 照片項目介面
export interface PhotoItem {
    src: string;
    alt?: string;
    position?: {
        top: ResponsiveValue<string>;
        left: ResponsiveValue<string>;
        z: ResponsiveValue<number>;
    };
    width?: ResponsiveValue<string>;
    visibility?: ResponsiveValue<boolean>;
}

// 組件 Props 介面
interface ReportsParallaxPhotoProps {
    photos: PhotoItem[];
    // 可選：是否在手機版啟用視差效果
    enableMobileParallax?: boolean;
}

export default function ReportsParallaxPhoto({
    photos,
    enableMobileParallax = false
}: ReportsParallaxPhotoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const breakpoint = useBreakpoint();

    // 判斷是否為行動裝置
    const isMobile = breakpoint === 'base' || breakpoint === 'sm';

    // 使用滑鼠追蹤 Hook（統一的行動裝置檢測）
    useMouseTracking3D({
        enabled: true,  // 總是啟用，內部會根據裝置類型自動處理
        targetRef: containerRef,
        cssProperty: 'perspectiveOrigin',
        rangeMin: 20,
        rangeMax: 80,
        useLerp: true,
        lerpFactor: 0.1,
        // 如果 enableMobileParallax 為 true，則強制在行動裝置上也啟用
        disableOnMobile: !enableMobileParallax,
        disableOnTablet: !enableMobileParallax
    });

    // 產生預設響應式位置
    const getDefaultPosition = (index: number): PhotoItem['position'] => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        return {
            top: {
                base: `${5 + row * 45}%`,    // 手機版：垂直間距更大
                sm: `${8 + row * 40}%`,      // 小平板
                md: `${12 + row * 35}%`,     // 平板
                lg: `${15 + row * 32}%`,     // 筆電
                xl: `${18 + row * 30}%`,     // 桌機
                '2xl': `${20 + row * 28}%`   // 大螢幕
            },
            left: {
                base: `${10 + col * 40}%`,   // 手機版：水平間距更小
                sm: `${8 + col * 38}%`,
                md: `${10 + col * 35}%`,
                lg: `${10 + col * 32}%`,
                xl: `${10 + col * 30}%`,
                '2xl': `${12 + col * 28}%`
            },
            z: {
                base: 10 + (index % 3) * 10, // 手機版：較小的 Z 軸深度
                sm: 15 + (index % 3) * 12,
                md: 20 + (index % 3) * 15,
                lg: 25 + (index % 3) * 18,
                xl: 30 + (index % 3) * 20,
                '2xl': 35 + (index % 3) * 22
            }
        };
    };

    // 取得預設寬度
    const getDefaultWidth = (): ResponsiveValue<string> => ({
        base: '70vw',   // 手機版：較大的圖片
        sm: '55vw',
        md: '40vw',     // 平板
        lg: '32vw',     // 筆電
        xl: '25vw',     // 桌機
        '2xl': '22vw'   // 大螢幕
    });

    // 取得響應式透視值
    const getPerspective = (): string => {
        const perspectiveValues = {
            base: '300px',
            sm: '350px',
            md: '400px',
            lg: '450px',
            xl: '500px',
            '2xl': '550px'
        };
        return getResponsiveValue(perspectiveValues, breakpoint);
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-[70vh] relative"
            style={{
                transformStyle: 'preserve-3d',
                perspective: getPerspective(),
            }}>
            {photos.map((photo, index) => {
                // 取得位置配置（使用預設或自訂）
                const position = photo.position || getDefaultPosition(index);

                // 取得當前斷點對應的值
                const currentTop = getResponsiveValue(position?.top || '', breakpoint);
                const currentLeft = getResponsiveValue(position?.left || '', breakpoint);
                const currentZ = getResponsiveValue(position?.z || 0, breakpoint);
                const currentWidth = getResponsiveValue(
                    photo.width || getDefaultWidth(),
                    breakpoint
                );
                const isVisible = getResponsiveValue(
                    photo.visibility ?? true,
                    breakpoint
                );

                // 如果當前斷點設定為不顯示，則跳過渲染
                if (!isVisible) return null;

                return (
                    <div
                        key={index}
                        className="h-auto absolute transition-all duration-300 ease-out"
                        style={{
                            width: currentWidth,
                            top: currentTop,
                            left: currentLeft,
                            transform: `translateZ(${currentZ}px)`,
                            zIndex: Math.floor(currentZ / 10)
                        }}
                        onMouseEnter={(e) => {
                            // 只在非手機版啟用 hover 效果
                            if (!isMobile || enableMobileParallax) {
                                e.currentTarget.style.transform = `translateZ(${currentZ}px) scale(1.05)`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `translateZ(${currentZ}px) scale(1)`;
                        }}>
                        <Image
                            src={photo.src}
                            alt={photo.alt || `reports-photo-${index + 1}`}
                            width={2000}
                            height={1333}
                            className="w-full h-auto border-2 sm:border-3 md:border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm"
                            priority={index < 3} // 前三張圖片優先載入
                        />

                        {/* 開發模式：顯示響應式調試資訊 */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-mono">
                                <div className="text-yellow-300">BP: {breakpoint}</div>
                                <div>T: {currentTop}</div>
                                <div>L: {currentLeft}</div>
                                <div>Z: {currentZ}</div>
                                <div>W: {currentWidth}</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}