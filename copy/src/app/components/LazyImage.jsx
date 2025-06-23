"use client";

import { useState, useRef, useEffect } from 'react';

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholder = 'blur',
    quality = 80,
    sizes = '100vw',
    priority = false,
    onLoad,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // 優先載入的圖片立即載入
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || isInView) return; // 如果是優先載入或已經在視窗中，跳過

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px' // 提前 50px 開始載入
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isInView]);

    // 建立漸進式圖片 URL
    const getOptimizedSrc = (originalSrc, width = 800) => {
        // 如果是外部 URL，直接使用
        if (originalSrc.startsWith('http')) {
            return originalSrc;
        }

        // 內部圖片使用 Next.js Image Optimization
        return `/_next/image?url=${encodeURIComponent(originalSrc)}&w=${width}&q=${quality}`;
    };

    // 生成不同尺寸的 srcSet
    const generateSrcSet = (originalSrc) => {
        if (originalSrc.startsWith('http')) {
            return originalSrc; // 外部圖片不生成 srcSet
        }

        const widths = [640, 828, 1200, 1920];
        return widths
            .map(width => `${getOptimizedSrc(originalSrc, width)} ${width}w`)
            .join(', ');
    };

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setError(true);
        console.warn(`圖片載入失敗: ${src}`);
    };

    // 佔位符組件
    const Placeholder = () => {
        if (placeholder === 'blur') {
            return (
                <div className={`bg-gray-200 animate-pulse ${className}`} {...props}>
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                </div>
            );
        }

        if (placeholder === 'color') {
            return <div className={`bg-gray-300 ${className}`} {...props} />;
        }

        return null;
    };

    // 錯誤狀態
    if (error) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center ${className}`} {...props}>
                <span className="text-gray-400 text-sm">圖片載入失敗</span>
            </div>
        );
    }

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
            {/* 佔位符 */}
            {!isLoaded && <Placeholder />}

            {/* 實際圖片 */}
            {isInView && (
                <img
                    src={getOptimizedSrc(src)}
                    srcSet={generateSrcSet(src)}
                    sizes={sizes}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`
                        transition-opacity duration-300 
                        ${isLoaded ? 'opacity-100' : 'opacity-0'}
                        ${isLoaded ? '' : 'absolute inset-0'}
                        w-full h-full object-cover
                    `}
                />
            )}
        </div>
    );
};

export default LazyImage; 