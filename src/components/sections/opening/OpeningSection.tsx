'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useOptimizedMouseTracking } from '@/hooks/useOptimizedMouseTracking';
import { useOpeningPhotosAnimation } from '@/hooks/useOpeningPhotosAnimation';
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
    { id: 'right-img3', src: '/assets/img9.png', top: '10%', right: '30%', width: '22%' },
    { id: 'right-img4', src: '/assets/img10.png', top: '43%', right: '50%', width: '20%' },
    { id: 'right-img5', src: '/assets/img11.png', top: '60%', right: '3%', width: '18%' },
    { id: 'right-img6', src: '/assets/img12.png', top: '50%', right: '20%', width: '20%' }
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
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // 使用新的照片動畫 hook
  const { triggerEntranceAnimation, resetAnimationState } = useOpeningPhotosAnimation(is3DEnabled);

  // 優化的滑鼠追蹤（只在 3D 啟用且可見時運作）
  const mousePosition = useOptimizedMouseTracking({
    enabled: is3DEnabled && isVisible,
    throttleMs: 16,
    rangeMin: 47.5,
    rangeMax: 52.5
  });

  // 分層漸進式載入
  useEffect(() => {
    if (!isVisible) return;

    // 只在第一次可見時初始化
    if (!hasInitialized) {
      // 延遲啟用 3D 效果（讓頁面先載入基本內容）
      const timer = setTimeout(() => {
        setIs3DEnabled(true);
        setHasInitialized(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hasInitialized]);

  // 觸發入場動畫 - 只在第一次初始化時觸發
  useEffect(() => {
    if (is3DEnabled && !animationsLoaded) {
      triggerEntranceAnimation();
      setAnimationsLoaded(true);
    }
  }, [is3DEnabled, animationsLoaded, triggerEntranceAnimation]);

  // 處理視窗可見性變化
  useEffect(() => {
    if (!isVisible && hasInitialized) {
      // 當視窗不可見時，重置動畫狀態（為下次重新進入做準備）
      resetAnimationState();
      setAnimationsLoaded(false);
      setHasInitialized(false);
      setIs3DEnabled(false);
    }
  }, [isVisible, hasInitialized, resetAnimationState]);

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
          transform: animationsLoaded ? 'translate3d(0,0,0)' : undefined,
        }}
        loading={face === 'left' && index < 2 ? "eager" : "lazy"}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    ));
  };

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
          {renderFacePhotos('left', facesPhotosData.left)}
        </div>

        {/* 3D 立方體的其他面 - 只在 3D 啟用時渲染 */}
        {is3DEnabled && isVisible && (
          <>
            {/* 右側面：3D 立方體的右面 */}
            <div
              className="w-full h-full absolute border-t-2 border-b-2 border-gray-200"
              style={{
                transform: 'rotateY(-90deg)',
                transformOrigin: 'right',
              }}
            >
              {renderFacePhotos('right', facesPhotosData.right)}
            </div>

            {/* 頂面：3D 立方體的上面 */}
            <div
              className="w-full h-full absolute border-l-2 border-r-2 border-gray-200"
              style={{
                transform: 'rotateX(-90deg)',
                transformOrigin: 'top center',
              }}
            >
              {renderFacePhotos('top', facesPhotosData.top)}
            </div>

            {/* 底面：3D 立方體的下面 */}
            <div
              className="w-full h-full absolute border-l-2 border-r-2 border-gray-200"
              style={{
                transform: 'rotateX(90deg)',
                transformOrigin: 'bottom center',
              }}
            >
              {renderFacePhotos('bottom', facesPhotosData.bottom)}
            </div>

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