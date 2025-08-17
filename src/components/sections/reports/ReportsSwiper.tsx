'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '@/app/data/projects.json';
import { ItemDisplayWithNavigation } from '@/components/shared';
import ReportsSwiperItem from './ReportsSwiperItem';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useDragSwiper } from '@/hooks/useDragSwiper';
import { useReportsAnimation } from '@/hooks/useReportsAnimation';
import { useReportsPreloader } from '@/hooks/useReportsPreloader';
import { useStore } from '@/stores';

// ============================
// 型別定義區塊
// ============================
// 報導項目的資料結構定義
interface ReportItem {
  // 項目唯一識別碼
  id: string;
  // 項目媒體檔案路徑
  path: string;
  // 項目標題
  title: string;
  // 項目副標題（可選）
  subtitle?: string;
  // 項目所屬章節陣列
  section: string[];
  // 項目背景顏色（可選）
  bgColor?: string;
  [key: string]: unknown;
}

// ============================
// 主要組件
// ============================
// 報導輪播組件：實現 3D 圓形輪播效果
export default function ReportsSwiper() {
  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：輪播容器的旋轉外框
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：整個章節區域
  const sectionRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：輪播展示容器
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：當前項目資訊展示區域
  const currentItemDisplayRef = useRef<HTMLDivElement>(null);
  // 用來儲存 zoom out 動畫的引用 (暫時未使用)
  // const zoomOutTweenRef = useRef<gsap.core.Tween | null>(null);

  const perspectiveContainerRef = useRef<HTMLDivElement>(null);

  // ============================
  // 全域狀態區塊
  // ============================
  // 從 store 取得開場動畫完成狀態
  const isOpeningComplete = useStore((state) => state.isOpeningComplete);

  // ============================
  // 本地狀態區塊 - 基本狀態
  // ============================
  // 狀態變數：當前顯示的輪播項目索引
  const [currentSlide, setCurrentSlide] = useState(0);
  // 狀態變數：是否已完成客戶端初始化（解決 SSR/CSR 不匹配問題）
  const [isClient, setIsClient] = useState(false);
  // 狀態變數：瀏覽器視窗寬度（用於響應式設計）
  const [windowWidth, setWindowWidth] = useState(1024); // 統一初始值，避免 SSR/CSR 不匹配

  // ============================
  // 本地狀態區塊 - 模糊背景層相關 (暫時移除)
  // ============================

  // ============================
  // 本地狀態區塊 - 滑鼠追蹤參數
  // ============================
  // 狀態：動態調整滑鼠追蹤範圍
  const [mouseRangeMin, setMouseRangeMin] = useState(30);
  const [mouseRangeMax, setMouseRangeMax] = useState(70);

  // 狀態：是否啟用互動（拖曳和點擊切換）
  const [isInteractionEnabled, setIsInteractionEnabled] = useState(false);


  // ============================
  // 自訂 Hooks 區塊
  // ============================
  // 可見性偵測：用於判斷組件是否在視窗中可見
  const { elementRef: observerRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // 優化的滑鼠追蹤：建立 3D 透視效果
  useMouseTracking3D({
    // 啟用條件：客戶端已載入且章節可見時才追蹤滑鼠
    enabled: isClient && isVisible,
    targetRef: perspectiveContainerRef,
    rangeMin: mouseRangeMin,
    rangeMax: mouseRangeMax,
    useLerp: true,
    lerpFactor: 0.1
  });

  // ============================
  // 工具函數區塊
  // ============================
  // 響應式斷點配置：根據螢幕寬度精確調整輪播參數
  const getResponsiveValues = (width: number) => {
    // Tailwind CSS 斷點對應：sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
    if (width < 640) {
      // 小於 640px：手機直立模式
      return { sliderSize: 10 };
    } else if (width < 768) {
      // 640px - 768px：手機橫向/小平板
      return { sliderSize: 9 };
    } else if (width < 1024) {
      // 768px - 1024px：平板模式
      return { sliderSize: 8 };
    } else if (width < 1280) {
      // 1024px - 1280px：小桌面
      return { sliderSize: 7 };
    } else if (width < 1536) {
      // 1280px - 1536px：大桌面
      return { sliderSize: 5 };
    } else {
      // 1536px+：超大桌面
      return { sliderSize: 4 };
    }
  };

  // 函數：判斷指定索引的影片是否應該播放
  // 策略：當前項目及其前後相鄰項目才播放影片（效能最佳化）
  const shouldPlayVideo = (index: number) => {
    // 取得項目總數
    const totalItems = reportsData.length;
    // 計算前一個項目的索引（環形結構）
    const prevIndex = (currentSlide - 1 + totalItems) % totalItems;
    // 計算下一個項目的索引（環形結構）
    const nextIndex = (currentSlide + 1) % totalItems;

    // 回傳是否為當前項目或相鄰項目
    return index === currentSlide || index === prevIndex || index === nextIndex;
  };

  // ============================
  // 計算值區塊
  // ============================
  // 計算值：根據當前視窗寬度取得響應式參數（只在客戶端初始化後使用實際寬度）
  const { sliderSize } = getResponsiveValues(isClient ? windowWidth : 1024);

  // 資料篩選：從專案資料中篩選出報導章節的項目
  const reportsData: ReportItem[] = (projectsData as ReportItem[]).filter((item: ReportItem) =>
    item.section.includes('reports')
  );

  // ============================
  // 拖曳功能 Hook
  // ============================
  // 使用自訂的拖曳 Hook 來處理所有拖曳相關邏輯
  const { isDragging, dragDelta, previewSlide, goToSlide } = useDragSwiper({
    totalItems: reportsData.length,
    anglePerItem: 360 / reportsData.length,
    dragThreshold: 50,
    sliderWrapper: sliderWrapperRef.current,
    sliderContainer: sliderContainerRef.current,
    currentSlide,
    setCurrentSlide,
    enabled: isClient && isInteractionEnabled // 需要互動啟用才能拖曳
  });

  // 計算值：取得當前顯示的報導項目資料（拖曳時顯示預覽項目）
  const displayIndex = isDragging ? previewSlide : currentSlide;
  const currentItem = reportsData[displayIndex] || reportsData[0];

  // ============================
  // 導航函數區塊
  // ============================
  // 前往下一個項目（使用最短路徑）
  const goToNext = useCallback(() => {
    if (!isInteractionEnabled) return;
    const nextIndex = (currentSlide + 1) % reportsData.length;
    goToSlide(nextIndex); // 使用最短路徑，提供最佳視覺體驗
  }, [currentSlide, reportsData.length, goToSlide, isInteractionEnabled]);

  // 前往上一個項目（使用最短路徑）
  const goToPrevious = useCallback(() => {
    if (!isInteractionEnabled) return;
    const prevIndex = (currentSlide - 1 + reportsData.length) % reportsData.length;
    goToSlide(prevIndex); // 使用最短路徑，提供最佳視覺體驗
  }, [currentSlide, reportsData.length, goToSlide, isInteractionEnabled]);

  // ============================
  // 動畫 Hooks 區塊
  // ============================
  // 使用 useCallback 確保函數引用穩定
  const handleAnimationComplete = useCallback(() => {
    // 動畫完成後啟用互動
    setIsInteractionEnabled(true);
  }, []);

  // 新增：處理動畫反向完成（禁用互動）
  const handleAnimationReverseComplete = useCallback(() => {
    // 動畫反向完成後禁用互動
    setIsInteractionEnabled(false);
  }, []);

  // 使用整合的動畫 Hook
  useReportsAnimation({
    sliderWrapperRef,
    currentItemDisplayRef,
    isClient,
    isOpeningComplete,
    setMouseRangeMin,
    setMouseRangeMax,
    onAnimationComplete: handleAnimationComplete,
    onAnimationReverseComplete: handleAnimationReverseComplete
  });

  // ============================
  // 預載機制 Hook
  // ============================
  // 使用預載 Hook 來管理媒體資源預載
  useReportsPreloader({
    currentIndex: currentSlide,
    items: reportsData,
    isVisible,
    enabled: isClient
  });

  // ============================
  // Effects 區塊 - 客戶端初始化與視窗監聽
  // ============================
  // 處理客戶端初始化和視窗大小變化
  useEffect(() => {
    // 標記客戶端已初始化，啟用響應式功能
    setIsClient(true);

    // 立即設定當前視窗寬度
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }

    // 事件處理函數：更新視窗寬度狀態
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };

    // 註冊視窗大小變化監聽器
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // 清理函數：移除事件監聽器
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []); // 空依賴陣列：只在組件載入時執行一次

  // ============================
  // Effects 區塊 - 3D 輪播初始化
  // ============================
  // 設定 3D 輪播的初始狀態
  useEffect(() => {
    // 檢查是否在瀏覽器環境中運行且客戶端已初始化
    if (typeof window === 'undefined' || !isClient) return;

    // 取得所需的 DOM 元素參考
    const sliderWrapper = sliderWrapperRef.current;
    const section = sectionRef.current;
    const sliderContainer = sliderContainerRef.current;

    // 確保所有必要元素都存在
    if (!section || !sliderWrapper || !sliderContainer) return;

    // 設定輪播容器的初始顯示狀態
    gsap.set(sliderContainer, {
      // 完全不透明
      opacity: 1,
      // 正常大小
      scale: 1
    });

    // 設定初始旋轉角度（顯示第一個項目）
    gsap.set(sliderWrapper, {
      rotateY: 0
    });
  }, [isClient]); // 只依賴 isClient，避免重複初始化



  // ============================
  // 渲染區塊
  // ============================
  // 組件渲染輸出（等待客戶端初始化完成後再顯示 3D 效果）
  return (
    // 主容器：設定總體滾動高度以提供足夠的滾動空間
    <div
      ref={(el) => {
        if (sectionRef)
          (
            sectionRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = el;
        if (observerRef)
          (
            observerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = el;
      }}
      className="relative h-screen overflow-visible"
    >
      {/* 黏性容器：在滾動時保持在視窗頂部 */}
      <div className="sticky top-0 w-full h-screen">
        {/* 輪播展示容器：居中定位 */}
        <div
          ref={sliderContainerRef}
          className={`absolute w-full h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none ${isInteractionEnabled && isDragging
            ? "cursor-grabbing"
            : isInteractionEnabled
              ? "cursor-grab"
              : "cursor-default"
            }`}
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          {/* 3D 輪播展示區域 */}
          <div
            className="w-full h-screen text-center overflow-hidden"
            ref={perspectiveContainerRef}
            style={{
              // 初始 3D 變換狀態
              transform:
                "translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
              // 確保 3D 渲染環境
              transformStyle: "preserve-3d",
              // 設定透視距離和動態透視中心點
              perspective: `${sliderSize * 9}vw`,
              perspectiveOrigin: 'center center',
            }}
          >
            {/* 3D 輪播旋轉容器：實際執行旋轉動畫的元素 */}
            <div
              ref={sliderWrapperRef}
              className="absolute z-10"
              style={{
                // 動態計算容器位置和尺寸（響應式）
                top: `calc(50% - ${sliderSize * 1}vw)`,
                left: `calc(50% - ${sliderSize * 1.5}vw)`,
                width: `${sliderSize * 3}vw`,
                height: `${sliderSize * 2}vw`,
                // 保持 3D 變換樣式
                transformStyle: "preserve-3d",
                // 設定 3D 透視和初始變換（使用響應式透視值）
                transform: `translateZ(10vw) rotateX(90deg) rotateY(0deg) rotateZ(0deg)`,
              }}
            >
              {/* 渲染所有報導項目：建立 3D 圓形輪播結構 */}
              {reportsData.map((item, index) => (
                // 單個報導項目容器
                <div
                  key={item.id}
                  data-report-item
                  className="absolute inset-0"
                  style={{
                    // 保持 3D 變換樣式
                    transformStyle: "preserve-3d",
                    // 計算每個項目在圓形輪播中的位置
                    // 根據索引分配角度，並在 Z 軸上向外推移形成圓形
                    transform: `translateY(calc(${index} * 50vw)) rotateY(calc(${index} * (360 / ${reportsData.length
                      }) * 1deg)) rotateZ(0deg) translateZ(${sliderSize * 6
                      }vw)`,
                    // 設定項目尺寸
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* 報導項目內容組件 */}
                  <ReportsSwiperItem
                    id={item.id}
                    path={item.path}
                    title={item.title}
                    subtitle={item.subtitle || ""}
                    bgColor={item.bgColor}
                    shouldPlay={shouldPlayVideo(index)}
                    projectData={item}
                    isDragging={isDragging}
                    dragDelta={dragDelta}
                    isActive={index === displayIndex}
                    index={index}
                    onItemClick={isInteractionEnabled ? goToSlide : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 當前項目資訊展示區域：顯示在輪播下方 */}
        <div
          ref={currentItemDisplayRef}
          className="absolute bottom-20 w-full flex justify-center items-center"
          style={{
            opacity: 0,
          }}
        >
          <ItemDisplayWithNavigation
            title={currentItem?.title}
            subtitle={currentItem?.subtitle}
            onPrevious={goToPrevious}
            onNext={goToNext}
            previousLabel="上一個報導"
            nextLabel="下一個報導"
            navigationDisabled={!isInteractionEnabled}
            currentItem={currentItem}
            onTitleClick={(item) => {
              const { openModal } = useStore.getState();
              openModal(item.id as string, item);
            }}
          />
        </div>
      </div>

      {/* <NextSectionButton /> */}
    </div>
  );
}