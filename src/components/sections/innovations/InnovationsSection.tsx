'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import SectionHeadings from '@/components/shared/SectionHeadings';
import { CurrentItemDisplay } from '@/components/shared';
import projectsData from '@/app/data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface InnovationItem {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  [key: string]: unknown;
}

// 簡化的物件狀態定義
interface ItemState {
  depth: number;
  opacity: number;
  blur: number;
  scale: number;
}

interface InnovationVideoItemProps {
  item: InnovationItem;
  index: number;
  isVisible: boolean;
  is3DEnabled: boolean;
  animationsEnabled: boolean;
  offset: { x: number; y: number };
  initialDepth: number;
  onItemClick: (item: InnovationItem) => void;
}

function InnovationVideoItem({
  item,
  index,
  isVisible,
  is3DEnabled,
  animationsEnabled,
  offset,
  initialDepth,
  onItemClick
}: InnovationVideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // 處理影片自動播放 - 只使用 isVisible 狀態
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;


    // 只要 isVisible 就嘗試播放
    if (isVisible) {
      const attemptPlay = async () => {
        try {
          await video.play();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Video ${item.id} autoplay failed:`, error);
          }
        }
      };

      attemptPlay();
    } else {
      // 不可見時暫停
      try {
        video.pause();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Video ${item.id} pause failed:`, error);
        }
      }
    }
  }, [isVisible, videoLoaded, item.id]);

  // 監聽影片載入完成
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);


    // 如果此時已可見，立即嘗試播放
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Video ${item.id} initial play failed:`, error);
        }
      });
    }
  }, [isVisible, item.id]);

  // 特別處理第一個項目：始終保持在中央
  const isFirstItem = index === 0;
  const shouldCenterFirst = isFirstItem && !animationsEnabled;

  return (
    <div
      id={`innovation-item-${item.id}`}
      className="absolute top-1/2 left-1/2 cursor-pointer will-change-transform"
      data-custom-cursor="explore"
      style={{
        transformOrigin: 'center center',
        width: '800px',
        height: '800px',
        transform: 'translate(-50%, -50%)',
        // 在 3D 啟用前設定初始 opacity，避免突然出現
        opacity: is3DEnabled ? undefined : (initialDepth < -300 ? 0 : 0.6),
        // 第一個項目保持在中央，其他項目有偏移
        left: shouldCenterFirst ? '50%' : (!animationsEnabled ? `calc(50% + ${offset.x}vw)` : '50%'),
        top: shouldCenterFirst ? '50%' : (!animationsEnabled ? `calc(50% + ${offset.y}vh)` : '50%'),
        // 第一個項目的特殊樣式
        zIndex: isFirstItem ? 10 : 1
      }}
      onClick={() => onItemClick(item)}
    >
      <div className="w-full h-full rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={item.path}
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
          onLoadedData={handleVideoLoaded}
          onCanPlayThrough={handleVideoLoaded}
        />
        <div className="absolute inset-0 transition-all duration-300 flex items-end">
          <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm opacity-80">{item.subtitle}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// 動畫狀態配置（根據效能調整）
const getAnimationStates = (isLowPerformance: boolean) => ({
  hidden: { depth: -400, opacity: 0, blur: isLowPerformance ? 0 : 0, scale: 1 },
  background: { depth: -200, opacity: 0.6, blur: isLowPerformance ? 0 : 8, scale: 1 },
  active: { depth: 0, opacity: 1, blur: 0, scale: 1 },
  foreground: { depth: 200, opacity: 0, blur: isLowPerformance ? 0 : 8, scale: 1 }
});

export default function InnovationsSection() {
  const { openModal } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);

  // SectionHeading 可見性偵測（提前觸發）
  const { elementRef: headingRef, isVisible: headingVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px' // 提前 200px 開始準備
  });

  // 整個 Section 可見性偵測
  const { elementRef: observerRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });


  // 效能監控 - 暫時禁用以避免重複動畫問題
  const isLowPerformance = false;


  // 分層載入控制
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  // 優化的滑鼠追蹤
  const mousePosition = useMouseTracking3D({
    enabled: is3DEnabled && isVisible && !isLowPerformance,
    isLowPerformance
  });

  // 使用 useEffect 來直接更新 perspectiveOrigin，避免組件重新渲染
  useEffect(() => {
    if (!containerRef.current || !is3DEnabled || !isVisible || isLowPerformance) return;
    
    const container = containerRef.current;
    container.style.perspectiveOrigin = `${mousePosition.x}% ${mousePosition.y}%`;
  }, [mousePosition.x, mousePosition.y, is3DEnabled, isVisible, isLowPerformance]);

  // 預先快取元素引用
  const elementRefsCache = useRef<Map<string, HTMLDivElement>>(new Map());

  // 從 projects.json 篩選項目
  const innovationItems = (projectsData as unknown as InnovationItem[])
    .filter((p: InnovationItem) => p.section && (Array.isArray(p.section) ? p.section.includes('innovation') : p.section === 'innovation'))
    .sort((a: InnovationItem, b: InnovationItem) => {
      const numA = parseInt(a.id.split('-')[1]);
      const numB = parseInt(b.id.split('-')[1]);
      return numA - numB;
    });

  // 分層漸進式載入 - 基於 SectionHeading 可見性提前觸發
  useEffect(() => {
    if (!headingVisible) return;

    // 第一階段：當 SectionHeading 可見時立即啟用 3D（避免可見的切換）
    setIs3DEnabled(true);

    // 第二階段：稍微延遲啟用動畫
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, isLowPerformance ? 300 : 150); // 縮短延遲時間

    return () => {
      clearTimeout(timer);
    };
  }, [headingVisible]);

  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations'
  });

  // 處理項目點擊
  const handleItemClick = (item: InnovationItem) => {
    openModal(item.id, item);
  };

  // 計算平滑過渡狀態（效能優化版）
  const calculateOptimizedState = useCallback((currentDepth: number): ItemState => {
    const states = getAnimationStates(isLowPerformance);

    if (currentDepth < -300) {
      return states.hidden;
    } else if (currentDepth < -25) {
      const progress = (currentDepth + 300) / 275;
      return {
        depth: currentDepth,
        opacity: 0.6 + (progress * 0.4),
        blur: isLowPerformance ? 0 : 8 - (progress * 8), // 低效能時停用模糊
        scale: 1
      };
    } else if (currentDepth < 25) {
      return {
        depth: currentDepth,
        opacity: 1,
        blur: 0,
        scale: 1
      };
    } else if (currentDepth < 50) {
      const progress = (currentDepth - 25) / 25;
      return {
        depth: currentDepth,
        opacity: 1 - progress,
        blur: isLowPerformance ? 0 : progress * 8,
        scale: 1
      };
    } else {
      return {
        depth: currentDepth,
        opacity: 0,
        blur: isLowPerformance ? 0 : 8,
        scale: 1
      };
    }
  }, [isLowPerformance]);

  // 計算錯位位置
  const getOffsetPosition = (index: number) => {
    const offsetX = (index % 5 - 2) * 96;
    const offsetY = (Math.floor(index / 5) % 3 - 1) * 144;
    return { x: offsetX, y: offsetY };
  };

  // 優化的 GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !animationsEnabled) return;

    gsap.registerPlugin(ScrollTrigger);

    // 快取元素引用 - 只在需要時更新
    if (elementRefsCache.current.size !== innovationItems.length) {
      elementRefsCache.current.clear();
      innovationItems.forEach((item) => {
        const element = document.getElementById(`innovation-item-${item.id}`) as HTMLDivElement;
        if (element) {
          elementRefsCache.current.set(item.id, element);
        }
      });
    }

    // 批次設定初始狀態
    const elements = Array.from(elementRefsCache.current.values());

    // 設定所有元素的初始狀態
    elements.forEach((element, index) => {
      const initialDepth = -50 - (index * 100);
      const offset = getOffsetPosition(index);
      const isFirstItem = index === 0;

      gsap.set(element, {
        // 第一個項目初始就在中央，其他項目有偏移
        x: isFirstItem ? '0vw' : `${offset.x}vw`,
        y: isFirstItem ? '0vh' : `${offset.y}vh`,
        z: `${initialDepth}vw`,
        scale: 1,
        opacity: initialDepth < -300 ? 0 : (isFirstItem ? 1 : 0.6), // 第一個項目完全不透明
        filter: isLowPerformance ? 'none' : `blur(0px)`,
        rotationX: 0,
        rotationY: 0,
        transformOrigin: 'center center',
        willChange: 'transform, opacity'
      });
    });

    // 創建滾動觸發器 - 提前開始觸發，避免突然跳躍
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top-=200px top', // 提前 200px 開始觸發
      end: 'bottom bottom',
      scrub: isLowPerformance ? 1 : 2, // 低效能時降低 scrub 值
      onUpdate: (self) => {
        const progress = self.progress;
        const itemCount = elements.length;
        // 調整總距離，確保最後一個項目停在 active 狀態
        const totalDistance = (itemCount - 1) * 100 + 50; // 最後一個項目到達 active 狀態的距離
        const currentOffset = progress * totalDistance;
        let activeIndex = -1;

        // 使用快取的元素陣列，避免重複查詢
        elements.forEach((element, index) => {
          if (!element) return;

          const isLastItem = index === elements.length - 1;
          let currentDepth = (-50 - index * 100) + currentOffset;

          // 特殊處理：讓最後一個項目保持在 active 狀態
          if (isLastItem && currentDepth > 0) {
            currentDepth = 0; // 鎖定在 active 狀態
          }

          const state = calculateOptimizedState(currentDepth);

          if (currentDepth >= -25 && currentDepth <= 25) {
            activeIndex = index;
          }

          const offset = getOffsetPosition(index);
          const isFirstItem = index === 0;
          let offsetFactor = 1;

          // 第一個項目特殊處理：始終保持在中央
          if (isFirstItem) {
            offsetFactor = 0; // 第一個項目不使用偏移
          } else {
            if (currentDepth >= -300 && currentDepth <= -25) {
              const transitionProgress = (currentDepth + 300) / 275;
              offsetFactor = 1 - transitionProgress;
            } else if (currentDepth > -25) {
              offsetFactor = 0;
            }
          }

          const finalX = `${offset.x * offsetFactor}vw`;
          const finalY = `${offset.y * offsetFactor}vh`;

          // 效能優化：低效能模式下使用更簡單的動畫
          if (isLowPerformance) {
            gsap.set(element, {
              x: finalX,
              y: finalY,
              z: `${currentDepth}vw`,
              opacity: state.opacity,
              scale: state.scale
            });
          } else {
            gsap.to(element, {
              x: finalX,
              y: finalY,
              z: `${currentDepth}vw`,
              opacity: state.opacity,
              filter: `blur(${state.blur}px)`,
              scale: state.scale,
              duration: 0.3,
              ease: "power2.out",
              overwrite: 'auto'
            });
          }

          // 可見性優化
          if (state.opacity < 0.05) {
            gsap.set(element, {
              visibility: 'hidden',
              pointerEvents: 'none'
            });
          } else {
            gsap.set(element, {
              visibility: 'visible',
              pointerEvents: 'auto'
            });
          }
        });

        if (activeIndex >= 0) {
          setCurrentItemIndex(activeIndex);
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      // 複製引用以避免 cleanup 時的警告
      const cacheRef = elementRefsCache.current;
      cacheRef.clear();
    };
  }, [innovationItems, animationsEnabled]);

  const currentItem = currentItemIndex >= 0 ? innovationItems[currentItemIndex] : null;


  return (
    <div ref={observerRef} id="section-innovations">
      {/* SectionHeadings - 使用專門的 ref 來提前觸發 3D 載入 */}
      <div ref={headingRef}>
        <SectionHeadings
          titleEn="INNOVATION"
          titleZh="開放新聞室・創新"
        >
          <p>
            《報導者》與時俱進，不斷創新說故事方式、突破敘事框架、翻新內容形式，讓文字、聲音、影像在開放協作中碰撞出新的可能。<br />
            點點物件，看10年來的新嘗試，你參與了多少呢？
          </p>
        </SectionHeadings>
      </div>

      <div ref={sectionRef} className="relative w-full h-[1000vh]">
        {/* 3D 容器 */}
        <div className="w-full h-screen sticky top-0">
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              perspective: is3DEnabled && isVisible ? '1000px' : 'none',
              perspectiveOrigin: 'center center' // 初始值，會被 useEffect 更新
            }}
          >
            {/* 3D 場景容器 */}
            <div
              className="absolute inset-0"
              style={{
                transformStyle: is3DEnabled && isVisible ? 'preserve-3d' : 'flat'
              }}
            >
              {innovationItems.map((item, index) => {
                // 計算初始錯位位置，避免啟用前的跳躍
                const offset = getOffsetPosition(index);
                const initialDepth = -50 - (index * 100);


                return (
                  <InnovationVideoItem
                    key={item.id}
                    item={item}
                    index={index}
                    isVisible={isVisible}
                    is3DEnabled={is3DEnabled}
                    animationsEnabled={animationsEnabled}
                    offset={offset}
                    initialDepth={initialDepth}
                    onItemClick={handleItemClick}
                  />
                );
              })}
            </div>


            {/* 當前項目資訊顯示 */}
            <div className="absolute bottom-16 w-full">
              <CurrentItemDisplay
                title={currentItem?.title}
                subtitle={currentItem?.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}