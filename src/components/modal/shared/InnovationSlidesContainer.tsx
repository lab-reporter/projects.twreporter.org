'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface InnovationSlidesContainerProps {
  children: React.ReactNode;
  scrollContainer?: HTMLElement | null;
  onSlideChange?: (index: number) => void;
  enableModalClose?: boolean; // 是否在最後一頁向下滑動時關閉 Modal
}

export default function InnovationSlidesContainer({ 
  children, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollContainer: _scrollContainer,
  onSlideChange,
  enableModalClose = true
}: InnovationSlidesContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overScrollDistance, setOverScrollDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const lastTransitionTime = useRef(0);
  
  // 將 children 轉換為陣列（處理單個或多個子元素）
  const slides = React.Children.toArray(children);
  const slideCount = slides.length;

  // 切換到指定頁面
  const goToSlide = useCallback((index: number) => {
    // 冷卻時間檢查（1秒）
    const now = Date.now();
    if (now - lastTransitionTime.current < 1000) return;
    
    // 邊界檢查
    if (index < 0 || index >= slideCount) return;
    
    // 第一頁向上滑動無反應
    if (index < 0 && currentSlide === 0) return;
    
    // 最後一頁向下滑動時不處理（讓 ModalScrollManager 處理）
    if (index >= slideCount && currentSlide === slideCount - 1) {
      return;
    }

    lastTransitionTime.current = now;
    setIsTransitioning(true);
    setCurrentSlide(index);
    onSlideChange?.(index);
    
    // 動畫結束後解除鎖定
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [currentSlide, slideCount, onSlideChange]);

  // 處理滾輪事件
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isTransitioning) return;
    
    // 阻止預設行為和事件冒泡（防止觸發 ModalScrollManager）
    e.preventDefault();
    e.stopPropagation();
    
    // 滾動超過 50px 才觸發
    if (Math.abs(e.deltaY) > 50) {
      if (e.deltaY > 0) {
        // 向下滾動
        if (currentSlide === slideCount - 1) {
          // 最後一頁向下滾動，累積 overscroll 距離來關閉 Modal
          if (enableModalClose) {
            const newDistance = overScrollDistance + Math.abs(e.deltaY);
            setOverScrollDistance(newDistance);
            
            // 檢查是否達到關閉閾值（100vh）
            const viewportHeight = window.innerHeight;
            if (newDistance >= viewportHeight) {
              // 觸發 Modal 關閉
              const closeButton = document.querySelector('button')?.parentElement?.querySelector('button[class*="group"]') as HTMLElement;
              if (closeButton) {
                closeButton.click();
              }
            }
          }
          return;
        }
        goToSlide(currentSlide + 1);
      } else {
        // 向上滾動
        if (currentSlide === 0) {
          // 第一頁向上滾動，不做任何事
          return;
        }
        goToSlide(currentSlide - 1);
      }
    }
    
    // 如果不在最後一頁，重置 overscroll 距離
    if (currentSlide !== slideCount - 1) {
      setOverScrollDistance(0);
    }
  }, [isTransitioning, currentSlide, slideCount, goToSlide, enableModalClose, overScrollDistance]);

  // 處理觸控事件
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;
    
    // 確保是垂直滑動（Y 軸移動大於 X 軸）
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // 向上滑動（下一頁）
        goToSlide(currentSlide + 1);
      } else {
        // 向下滑動（上一頁）
        goToSlide(currentSlide - 1);
      }
    }
  }, [isTransitioning, currentSlide, goToSlide]);

  // 處理鍵盤事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTransitioning) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;
    }
  }, [isTransitioning, currentSlide, goToSlide]);

  // 重置 overScroll 距離的計時器
  useEffect(() => {
    if (overScrollDistance > 0 && currentSlide === slideCount - 1) {
      const timer = setTimeout(() => {
        setOverScrollDistance(0);
      }, 500); // 500ms 後重置
      
      return () => clearTimeout(timer);
    }
  }, [overScrollDistance, currentSlide, slideCount]);

  // 設定事件監聽器
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 防止預設滾動行為
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);


  return (
    <div 
      ref={containerRef}
      className="relative w-[92vw] h-[92vh] overflow-hidden"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        touchAction: 'none' // 防止觸控滾動
      }}
    >
      {/* 投影片容器 */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <SlidePage
            key={index}
            isActive={index === currentSlide}
            isPrevious={index < currentSlide}
            isNext={index > currentSlide}
          >
            {slide}
          </SlidePage>
        ))}
      </div>

      {/* 圓點導航 */}
      <DotNavigation
        total={slideCount}
        current={currentSlide}
        onDotClick={goToSlide}
      />
      
      {/* 過度滾動進度指示器（最後一頁） */}
      {currentSlide === slideCount - 1 && overScrollDistance > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="relative w-16 h-16">
            {(() => {
              const radius = 24;
              const circumference = 2 * Math.PI * radius;
              const progress = Math.min(overScrollDistance / window.innerHeight, 1);
              const strokeDashoffset = circumference - (progress * circumference);
              
              return (
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                  {/* 背景圓環 */}
                  <circle 
                    cx="28" 
                    cy="28" 
                    r={radius} 
                    fill="none" 
                    stroke="rgba(0,0,0,0.1)" 
                    strokeWidth="3" 
                  />
                  {/* 進度圓環 */}
                  <circle
                    cx="28" 
                    cy="28" 
                    r={radius} 
                    fill="none" 
                    stroke="#C40D23" 
                    strokeWidth="4"
                    strokeLinecap="round" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-100 ease-out"
                  />
                </svg>
              );
            })()}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C40D23" strokeWidth="2">
                <path d="M7 10l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 單頁容器組件
interface SlidePageProps {
  children: React.ReactNode;
  isActive: boolean;
  isPrevious: boolean;
  isNext: boolean;
}

function SlidePage({ children, isActive }: SlidePageProps) {
  return (
    <div
      className={`
        absolute inset-0 w-full h-full
        transition-opacity duration-500 ease-in-out
        ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
      `}
    >
      {children}
    </div>
  );
}

// 圓點導航組件
interface DotNavigationProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

function DotNavigation({ total, current, onDotClick }: DotNavigationProps) {
  return (
    <div className="
      fixed left-4 top-1/2 -translate-y-1/2 z-20
      md:left-8
      flex flex-col gap-3
      md:flex-col
      sm:fixed sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:top-auto sm:translate-y-0
      sm:flex-row
    ">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`
            w-3 h-3 rounded-full transition-all duration-300
            hover:scale-125
            ${index === current 
              ? 'bg-red-700 scale-125' 
              : 'bg-gray-500 hover:bg-gray-400'
            }
          `}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}