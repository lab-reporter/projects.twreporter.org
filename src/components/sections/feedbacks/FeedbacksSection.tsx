'use client';

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { testimonials } from '@/data/testimonials';
import { EffectCards } from "swiper/modules";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 註冊 GSAP ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 導入 Swiper 基本樣式
import "swiper/css";
// 導入 Swiper 卡片效果樣式
import "swiper/css/effect-cards";
// 導入 Swiper 分頁指示器樣式
import "swiper/css/pagination";

// 證言回饋頁面主要組件
export default function FeedbacksSection() {
  // Swiper 容器 ref
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  // 左側標題容器 ref
  const leftTitleRef = useRef<HTMLDivElement>(null);
  // 右側標題容器 ref
  const rightTitleRef = useRef<HTMLDivElement>(null);
  // Swiper ref
  const swiperRef = useRef<HTMLDivElement>(null);
  // Logo ref
  const logoRef = useRef<HTMLImageElement>(null);
  // Halftone ref
  const halftoneRef = useRef<HTMLImageElement>(null);
  // 背景圓圈 ref
  const bgCircleRef = useRef<HTMLDivElement>(null);

  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-feedbacks',
    // 頁面名稱識別
    sectionName: 'feedbacks'
  });

  // Canvas 繪製圓圈背景
  useEffect(() => {
    if (!bgCircleRef.current) return;

    // 創建 Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 設定 Canvas 尺寸
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCircles();
    };

    // 繪製圓圈
    const drawCircles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 圓圈參數 (使用 vw 單位)
      const vw = canvas.width / 100;
      const circleDiameter = 12.5 * vw;
      const circleRadius = circleDiameter / 2;
      const horizontalSpacing = 25 * vw; // 圓心到圓心的水平距離
      const verticalSpacing = 18.75 * vw; // 列與列之間的距離

      // 計算視窗中心
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 計算需要的行列數（從中心向外）
      const halfCols = Math.ceil(centerX / horizontalSpacing) + 1;
      const halfRows = Math.ceil(centerY / verticalSpacing) + 1;

      // 從中心開始向外繪製
      for (let row = -halfRows; row <= halfRows; row++) {
        for (let col = -halfCols; col <= halfCols; col++) {
          // 奇數列向右偏移半個水平間距
          const xOffset = (row % 2) * (horizontalSpacing / 2);
          const x = centerX + col * horizontalSpacing + xOffset;
          const y = centerY + row * verticalSpacing;

          // 繪製紅色圓圈
          ctx.beginPath();
          ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#F80B28';
          ctx.fill();
        }
      }
    };

    // 設定 Canvas 樣式
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;';
    bgCircleRef.current.appendChild(canvas);
    updateCanvasSize();

    // 監聽視窗變化
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  // 設定 GSAP ScrollTrigger 動畫
  useEffect(() => {
    if (!swiperContainerRef.current) return;

    // 設定初始寬度
    gsap.set(swiperContainerRef.current, {
      width: '0px',
      margin: '0px 0px',
      scale: 0,
    });

    // Swiper出現動畫
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-trigger="content-area"]',
        start: 'top 20%',
        end: 'top 0%',
        scrub: true,
        markers: true,
      }
    });

    tl.to(swiperContainerRef.current, {
      width: 'auto',
      scale: 1,
      duration: 1,
      margin: '0px 64px',
      ease: 'power2.out'
    });

    // 標題上移、LOGO出現
    if (leftTitleRef.current && rightTitleRef.current && swiperRef.current && logoRef.current) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="thanks-area"]',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
          markers: false,
        }
      });

      titleTl
        .to([leftTitleRef.current, rightTitleRef.current], {
          y: '-50%',
          ease: 'power2.inOut'
        })
        .to(swiperRef.current, {
          display: 'none',
        }, '<')
        .to(swiperContainerRef.current, {
          margin: '0px 32px',
          width: '0px',
          scale: 0,
          opacity: 0,
        }, '<')
        .to(logoRef.current, {
          scale: 1,
        }, '<')
        .to(halftoneRef.current, {
          scale: 1,
        }, '<');
    }

    // 第三個動畫：halftone 放大
    if (halftoneRef.current && logoRef.current && leftTitleRef.current && rightTitleRef.current && bgCircleRef.current) {
      const halftoneTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="halftone-area"]',
          start: 'top 20%',
          end: 'bottom 20%',
          scrub: true,
          markers: false,
        }
      });

      halftoneTl
        .to(halftoneRef.current, {
          scale: 200,
          opacity: 0,
          ease: 'power2.inOut'
        })
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          opacity: 0,
          ease: 'expo.out'
        }, '<')
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          display: 'none'
        }, '<')
        .to(bgCircleRef.current.querySelector('canvas'), {
          opacity: 1,
          ease: 'power2.in'
        }, '<')
    }

    // 清理函數
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // 組件渲染輸出
  return (
    // 主要頁面區塊：證言回饋頁面
    <section
      // 頁面錨點 ID
      id="section-feedbacks"
      className="w-full h-[800vh] text-white"
    >
      {/* 內容區域 */}
      <div data-trigger="content-area" className="h-screen sticky top-0 text-center flex flex-col md:flex-row justify-center items-center gap-[0px]">
        <div className="h-[28px] overflow-hidden">
          <div ref={leftTitleRef}>
            <h4 className="text-right leading-none">持續求真的路上</h4>
            <h4 className="text-right leading-none">因為有你們</h4>
          </div>
        </div>
        {/* swiper容器 */}
        <div ref={swiperContainerRef} className="px-4 flex flex-col items-center justify-center">
          <div ref={swiperRef}>
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              loop={true}
              className="feedback-swiper w-[300px] h-[400px]"
            >
              {testimonials.map((quote) => (
                <SwiperSlide key={quote.id} className="w-full h-auto">
                  {/* 證言卡片容器：響應式設計支援不同螢幕尺寸，適配覆蓋流效果 */}
                  <div className="w-full h-full  bg-white text-black border border-gray-200 p-6 sm:p-8 rounded-md flex flex-col justify-center items-center">
                    {/* 證言文字區域：可滾動的主要內容 */}
                    <p className="text-base sm:text-md font-semibold leading-relaxed text-center overflow-y-auto  flex items-center">
                      {quote.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="h-[28px] overflow-hidden">
          <div ref={rightTitleRef}>
            <h4 className="text-left leading-none">感謝有眾聲同行</h4>
            <h4 className="text-left leading-none">才有報導者</h4>
          </div>
        </div>


        {/* 報導者LOGO */}
        <img ref={halftoneRef} src="/assets/logo-halftone.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <img ref={logoRef} src="/assets/favicon.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />


        {/* 背景圓圈 */}
        <div ref={bgCircleRef} className="w-full h-screen absolute top-0 left-0 -z-10">
        </div>
      </div>

      <div data-trigger="thanks-area" className="h-[50vh] debug">
        <p className="text-red-70 p-2">data-trigger=thanks-area</p>
      </div>

      <div data-trigger="halftone-area" className="h-[100vh] debug">
      </div>
      <div className="sticky top-0 z-1 h-[200vh]">
        <div className="flex flex-col items-center justify-center h-screen">
          <div>
            <h3>感謝目前</h3>
            <h1>
              7964
              <span className="text-4xl font-bold">位</span>
            </h1>
            <h3 className="mb-2">定期定額贊助者</h3>
            <h5>讓《報導者》持續獨立運作、挖掘真相</h5>
          </div>
        </div>
      </div>
    </section>
  );
}