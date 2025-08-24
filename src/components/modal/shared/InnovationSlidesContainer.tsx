'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Button from '../../shared/Button';
import { ChevronUpIcon, ChevronDownIcon } from '../../shared/NavigationIcons';

interface InnovationSlidesContainerProps {
  children: React.ReactNode;
  scrollContainer?: HTMLElement | null;
  onSlideChange?: (index: number) => void;
  enableModalClose?: boolean; // 是否在最後一頁向下滑動時關閉 Modal
}

export default function InnovationSlidesContainer({
  children,
  scrollContainer: _scrollContainer,
  onSlideChange,
  enableModalClose: _enableModalClose = true
}: InnovationSlidesContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    }, 200);
  }, [currentSlide, slideCount, onSlideChange]);

  // 處理滾輪事件
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isTransitioning) return;

    // 阻止預設行為和事件冒泡（防止觸發 ModalScrollManager）
    e.preventDefault();
    e.stopPropagation();

    // 降低觸發閾值到 10px，讓輕微滑動也能觸發
    if (Math.abs(e.deltaY) > 10) {
      if (e.deltaY > 0) {
        // 向下滾動
        if (currentSlide === slideCount - 1) {
          // 最後一頁向下滾動不切換頁面
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
  }, [isTransitioning, currentSlide, slideCount, goToSlide]);

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

    // 確保是垂直滑動（Y 軸移動大於 X 軸），降低觸發閾值到 20px
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
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

    switch (e.key) {
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
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
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

      {/* 圓點導航與切換按鈕 */}
      <DotNavigation
        total={slideCount}
        current={currentSlide}
        onDotClick={goToSlide}
        onPrevious={() => goToSlide(currentSlide - 1)}
        onNext={() => goToSlide(currentSlide + 1)}
      />
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
        transition-opacity duration-200 ease-in-out
        ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
      `}
    >
      {children}
    </div>
  );
}

// 圓點導航組件（含上下切換按鈕）
interface DotNavigationProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

function DotNavigation({ total, current, onDotClick, onPrevious, onNext }: DotNavigationProps) {
  // 判斷是否為邊界狀態（禁用按鈕）
  const isFirstSlide = current === 0;
  const isLastSlide = current === total - 1;

  return (
    <div className="
      absolute left-4 top-1/2 -translate-y-1/2 z-20
      md:left-8
      flex flex-col items-center gap-2
      md:flex-col
      sm:absolute sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:top-auto sm:translate-y-0
      sm:flex-row
    ">
      {/* 上一頁按鈕（桌面版在上方，手機版在左方）*/}
      <Button
        variant="navigation"
        shape="circle"
        size="sm"
        onClick={onPrevious}
        disabled={isFirstSlide}
        aria-label="上一張投影片"
        leftIcon={<ChevronUpIcon size={16} className="" />}
        className="sm:order-1"
      />

      {/* 圓點導航區域 */}
      <div className="
        flex flex-row md:flex-col gap-3
        order-2
      ">
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              hover:scale-125
              ${index === current
                ? 'bg-red-70 scale-125'
                : 'bg-white/50 border border-gray-400 hover:bg-red-90'
              }
            `}
            aria-label={`前往第 ${index + 1} 張投影片`}
          />
        ))}
      </div>

      {/* 下一頁按鈕（桌面版在下方，手機版在右方）*/}
      <Button
        variant="navigation"
        shape="circle"
        size="sm"
        onClick={onNext}
        disabled={isLastSlide}
        aria-label="下一張投影片"
        leftIcon={<ChevronDownIcon size={16} className="" />}
        className="sm:order-3"
      />
    </div>
  );
}