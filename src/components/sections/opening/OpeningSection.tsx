'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useOptimizedMouseTracking } from '@/hooks/useOptimizedMouseTracking';
import { useMainTimeline } from '@/hooks/useMainTimeline';
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

// 面的類型定義
type FaceType = 'left' | 'right' | 'top' | 'bottom';

// 各面的照片數據 - 統一使用 top/right 管理
const facesPhotosData: Record<FaceType, PhotoData[]> = {
  left: [
    { id: 'left-img1', src: '/assets/img1.png', top: '40%', right: '90%', width: '10%' },
    { id: 'left-img2', src: '/assets/img2.png', top: '10%', right: '10%', width: '30%' },
    { id: 'left-img3', src: '/assets/img3.png', top: '60%', right: '30%', width: '25%' },
    { id: 'left-img4', src: '/assets/img4.png', top: '20%', right: '50%', width: '25%' },
    { id: 'left-img5', src: '/assets/img5.png', top: '64%', right: '60%', width: '28%' },
    { id: 'left-img6', src: '/assets/img6.png', top: '10%', right: '90%', width: '15%' }
  ],
  right: [
    { id: 'right-img1', src: '/assets/img7.png', top: '5%', right: '55%', width: '30%' },
    { id: 'right-img2', src: '/assets/img8.png', top: '5%', right: '-5%', width: '25%' },
    { id: 'right-img3', src: '/assets/img9.png', top: '10%', right: '25%', width: '22%' },
    { id: 'right-img4', src: '/assets/img10.png', top: '43%', right: '50%', width: '20%' },
    { id: 'right-img5', src: '/assets/img11.png', top: '60%', right: '-5%', width: '18%' },
    { id: 'right-img6', src: '/assets/img12.png', top: '50%', right: '15%', width: '20%' }
  ],
  top: [
    { id: 'top-img1', src: '/assets/img13.png', top: '20%', right: '5%', width: '16%' },
    { id: 'top-img2', src: '/assets/img14.png', top: '25%', right: '25%', width: '25%' },
    { id: 'top-img3', src: '/assets/img15.png', top: '17%', right: '78%', width: '20%' },
    { id: 'top-img4', src: '/assets/img16.png', top: '70%', right: '30%', width: '20%' },
    { id: 'top-img5', src: '/assets/img17.png', top: '5%', right: '55%', width: '22%' },
    { id: 'top-img6', src: '/assets/img18.png', top: '75%', right: '55%', width: '27%' }
  ],
  bottom: [
    { id: 'bottom-img1', src: '/assets/img19.png', top: '-20%', right: '55%', width: '30%' },
    { id: 'bottom-img2', src: '/assets/img20.png', top: '32%', right: '10%', width: '20%' },
    { id: 'bottom-img3', src: '/assets/img21.png', top: '45%', right: '68%', width: '24%' },
    { id: 'bottom-img4', src: '/assets/img22.png', top: '65%', right: '35%', width: '25%' },
    { id: 'bottom-img5', src: '/assets/img23.png', top: '80%', right: '60%', width: '22%' },
    { id: 'bottom-img6', src: '/assets/img24.png', top: '35%', right: '40%', width: '18%' }
  ]
};

// 創建全域照片引用，供其他組件使用
export const openingPhotosRef = {
  current: {
    left: [] as (HTMLImageElement | null)[],
    right: [] as (HTMLImageElement | null)[],
    top: [] as (HTMLImageElement | null)[],
    bottom: [] as (HTMLImageElement | null)[]
  }
};

// 導出照片數據，供其他組件使用
export { facesPhotosData };

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

  // 優化的滑鼠追蹤（只在 3D 啟用且可見時運作）
  const mousePosition = useOptimizedMouseTracking({
    enabled: is3DEnabled && isVisible,
    throttleMs: 16,
    rangeMin: 47.5,
    rangeMax: 52.5
  });

  // 啟用 3D 效果
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIs3DEnabled(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // 視窗外時停用 3D 效果
  useEffect(() => {
    if (!containerRef.current) return;

    if (isVisible && is3DEnabled) {
      // 啟用 3D 變換
      gsap.set(containerRef.current, {
        transformStyle: 'preserve-3d',
        perspective: '400px'
      });
    } else {
      // 停用 3D 變換，減少計算負荷
      gsap.set(containerRef.current, {
        transformStyle: 'flat',
        perspective: 'none'
      });
    }
  }, [isVisible, is3DEnabled]);

  // 渲染單個面的照片
  const renderFacePhotos = (face: FaceType, photos: PhotoData[]) => {
    return photos.map((photo, index) => (
      <Image
        key={photo.id}
        ref={(el) => {
          photosRef.current[face][index] = el;
        }}
        src={photo.src}
        alt={`${face} photo ${index + 1}`}
        width={300}
        height={200}
        quality={85}
        priority={face === 'left' && index < 2} // 左側面前2張優先載入
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        className="absolute h-auto shadow-lg"
        style={{
          top: photo.top,
          right: photo.right,
          width: photo.width,
          opacity: 0, // 初始不可見，由動畫系統控制
          visibility: 'hidden', // 初始隱藏
          transform: is3DEnabled && isVisible ? 'translate3d(0,0,0)' : undefined,
        }}
        loading={face === 'left' && index < 2 ? "eager" : "lazy"}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    ));
  };

  return (
    // 主要開場區塊：固定定位的全螢幕區域
    <section
      ref={sectionRef}
      id="section-opening"
      className="fixed top-0 w-full h-screen overflow-hidden z-10"
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
          className="w-full h-full absolute"
          style={{
            // 只在 3D 啟用時應用變換
            transform: is3DEnabled && isVisible ? 'rotateY(90deg)' : 'none',
            transformOrigin: 'left',
          }}
        >
          {renderFacePhotos('left', facesPhotosData.left)}
        </div>

        {/* 3D 立方體的其他面 - 只在 3D 啟用時渲染 */}
        {is3DEnabled && isVisible && (
          <>
            {/* 右側面：3D 立方體的右面 */}
            <div
              className="w-full h-full absolute"
              style={{
                transform: 'rotateY(-90deg)',
                transformOrigin: 'right',
              }}
            >
              {renderFacePhotos('right', facesPhotosData.right)}
            </div>

            {/* 頂面：3D 立方體的上面 */}
            <div
              className="w-full h-full absolute"
              style={{
                transform: 'rotateX(-90deg)',
                transformOrigin: 'top center',
              }}
            >
              {renderFacePhotos('top', facesPhotosData.top)}
            </div>

            {/* 底面：3D 立方體的下面 */}
            <div
              className="w-full h-full absolute"
              style={{
                transform: 'rotateX(90deg)',
                transformOrigin: 'bottom center',
              }}
            >
              {renderFacePhotos('bottom', facesPhotosData.bottom)}
            </div>

            {/* 背面：3D 立方體的中央 */}
            <div
              className="w-full h-full absolute flex items-center justify-center"
              style={{
                transform: 'translateZ(-1400px)',
              }}
            >
            </div>
          </>
        )}
      </div>
    </section>
  );
}