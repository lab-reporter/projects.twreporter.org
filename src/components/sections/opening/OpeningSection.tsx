'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useOptimizedMouseTracking } from '@/hooks/useOptimizedMouseTracking';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

// 照片數據結構
type PhotoData = {
  id: string;
  src: string;
  top: string;
  right: string;
  width: string;
};

// 照片數據陣列
const photosData: PhotoData[] = [
  { id: 'img1', src: '/assets/img1.png', top: '0%', right: '50%', width: '15%' },
  { id: 'img2', src: '/assets/img2.png', top: '10%', right: '0%', width: '40%' },
  { id: 'img3', src: '/assets/img3.png', top: '30%', right: '70%', width: '20%' },
  { id: 'img4', src: '/assets/img4.png', top: '60%', right: '80%', width: '25%' },
  { id: 'img5', src: '/assets/img5.png', top: '64%', right: '37%', width: '28%' },
  { id: 'img6', src: '/assets/img6.png', top: '0%', right: '80%', width: '20%' }
];

// 創建全域照片引用，供其他組件使用
export const openingPhotosRef = { current: [] as (HTMLImageElement | null)[] };

// 導出照片數據，供其他組件使用
export { photosData };

// 開場動畫區塊組件
export default function OpeningSection() {
  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    sectionId: 'section-opening',
    sectionName: 'opening'
  });

  // 使用視窗可見性偵測
  const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // 3D 容器引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 照片引用陣列（使用全域引用）
  const photosRef = openingPhotosRef;

  // 效能控制狀態
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  // 優化的滑鼠追蹤（只在 3D 啟用且可見時運作）
  const mousePosition = useOptimizedMouseTracking({
    enabled: is3DEnabled && isVisible,
    throttleMs: 16,
    rangeMin: 40,
    rangeMax: 60
  });

  // 分層漸進式載入
  useEffect(() => {
    if (!isVisible) return;

    // 延遲啟用 3D 效果（讓頁面先載入基本內容）
    const timer = setTimeout(() => {
      setIs3DEnabled(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // GSAP 動畫初始化（優化版）
  useEffect(() => {
    if (!is3DEnabled || photosRef.current.length === 0) return;

    // 過濾出有效的照片元素
    const validPhotos = photosRef.current.filter(Boolean);
    if (validPhotos.length === 0) return;

    // 設定照片初始位置（在畫面外）
    gsap.set(validPhotos, {
      right: '150%',
      // 使用 will-change 提示瀏覽器即將變換
      willChange: 'transform'
    });

    // 延遲後開始動畫
    gsap.delayedCall(0.5, () => {
      validPhotos.forEach((photo, index) => {
        if (photo) {
          gsap.to(photo, {
            right: photosData[index].right,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out',
            // 動畫完成後移除 will-change 並確保照片處於正確狀態
            onComplete: () => {
              gsap.set(photo, { 
                willChange: 'auto',
                // 確保照片在原始位置和完全透明
                right: photosData[index].right,
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto'
              });
            }
          });
        }
      });
      setAnimationsLoaded(true);
    });
  }, [is3DEnabled, photosRef]);

  // 視窗外時停用 3D 效果
  useEffect(() => {
    if (!containerRef.current) return;

    if (isVisible && is3DEnabled) {
      // 啟用 3D 變換
      gsap.set(containerRef.current, {
        transformStyle: 'preserve-3d',
        perspective: '500px'
      });
    } else {
      // 停用 3D 變換，減少計算負荷
      gsap.set(containerRef.current, {
        transformStyle: 'flat',
        perspective: 'none'
      });
    }
  }, [isVisible, is3DEnabled]);

  return (
    // 主要開場區塊：黏性定位的全螢幕區域
    <section
      ref={sectionRef}
      id="section-opening"
      className="sticky top-0 w-full h-screen overflow-hidden relative z-0"
      style={{
        // 設定網格背景圖案
        backgroundImage: 'url(/assets/bg_grid.svg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 3D 容器：設定透視效果 */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 m-auto"
        style={{
          // 動態控制 3D 設定
          transformStyle: is3DEnabled && isVisible ? 'preserve-3d' : 'flat',
          perspective: is3DEnabled && isVisible ? '500px' : 'none',
          // 根據滑鼠位置動態設定透視中心點（只在啟用時）
          perspectiveOrigin: is3DEnabled && isVisible
            ? `${mousePosition.x}% ${mousePosition.y}%`
            : 'center center',
        }}
      >
        {/* 左側面：3D 立方體的左面 */}
        <div
          className="w-full h-full absolute border-t-2 border-b-2 border-gray-200"
          style={{
            // 只在 3D 啟用時應用變換
            transform: is3DEnabled && isVisible ? 'rotateY(90deg)' : 'none',
            transformOrigin: 'left',
          }}
        >
          {/* 動態生成照片元件 */}
          {photosData.map((photo, index) => (
            <Image
              key={photo.id}
              ref={(el) => {
                photosRef.current[index] = el;
              }}
              src={photo.src}
              alt={`Opening photo ${index + 1}`}
              width={300}
              height={200}
              quality={85}
              priority={index < 2} // 前2張優先載入
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              className="absolute h-auto shadow-lg"
              style={{
                top: photo.top,
                right: photo.right,
                width: photo.width,
                // 效能優化：使用 transform3d 觸發硬體加速
                transform: animationsLoaded ? 'translate3d(0,0,0)' : undefined,
              }}
              loading={index < 2 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ))}
        </div>

        {/* 其他 3D 面 - 只在 3D 啟用時渲染 */}
        {is3DEnabled && isVisible && (
          <>
            {/* 右側面：3D 立方體的右面 */}
            <div
              className="w-full h-full absolute border-t-2 border-b-2 border-gray-200"
              style={{
                transform: 'rotateY(-90deg)',
                transformOrigin: 'right',
              }}
            ></div>

            {/* 頂面：3D 立方體的上面 */}
            <div
              className="w-full h-full absolute"
              style={{
                transform: 'rotateX(-90deg)',
                transformOrigin: 'top center',
              }}
            ></div>

            {/* 底面：3D 立方體的下面 */}
            <div
              className="w-full h-full absolute"
              style={{
                transform: 'rotateX(90deg)',
                transformOrigin: 'bottom center',
              }}
            ></div>

            {/* 背面：3D 立方體的中央 */}
            <div
              className="w-full h-full absolute flex items-center justify-center border-2 border-gray-200"
              style={{
                transform: 'translateZ(-1400px)',
              }}
            >
            </div>
          </>
        )}
      </div>

      {/* 載入指示器（可選） */}
      {!animationsLoaded && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white opacity-50">載入中...</div>
        </div>
      )}
    </section>
  );
}