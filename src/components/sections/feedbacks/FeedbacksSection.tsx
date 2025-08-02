'use client';

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { testimonials } from '@/data/testimonials';
import { EffectCards } from "swiper/modules";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SupportSection from "../support/SupportSection";
import Image from "next/image";

// 註冊 GSAP ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 導入 Swiper 基本樣式
import "swiper/css";
// 導入 Swiper 卡片效果樣式
import "swiper/css/effect-cards";
// 導入 Swiper 分頁指示器樣式
import "swiper/css/pagination";

// ============================
// 主要組件
// ============================
// 證言回饋頁面主要組件：展示使用者回饋並引導至贊助頁面
export default function FeedbacksSection() {
  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：Swiper 容器
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：左側標題容器
  const leftTitleRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：右側標題容器
  const rightTitleRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：Swiper 實例
  const swiperRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：報導者 Logo
  const logoRef = useRef<HTMLImageElement>(null);
  // DOM 元素參考：半色調 Logo
  const halftoneRef = useRef<HTMLImageElement>(null);
  // DOM 元素參考：背景圓圈容器
  const bgCircleRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：Canvas 繪圖區域
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // ============================
  // 動畫狀態區塊
  // ============================
  // 狀態參考：是否顯示灰色外框圓圈
  const showHiddenCircles = useRef(false);
  // 狀態參考：灰色圓圈的透明度值
  const grayCircleOpacity = useRef(0);
  // 狀態參考：圓圈的縮放倍數
  const circleScale = useRef(1);

  // ============================
  // 自訂 Hooks 區塊
  // ============================
  // 滾動觸發器：監控當前頁面位置並更新全域狀態
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-feedbacks',
    // 頁面名稱識別
    sectionName: 'feedbacks'
  });

  // ============================
  // Effects 區塊 - Canvas 圓圈背景繪製
  // ============================
  // 使用 Canvas 繪製動態圓圈背景圖案
  useEffect(() => {
    if (!bgCircleRef.current) return;

    // 創建 Canvas 元素
    const canvas = document.createElement('canvas');
    (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 函數：更新 Canvas 尺寸以適應視窗大小
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCircles();
    };

    // 函數：繪製圓圈圖案
    const drawCircles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 圓圈參數設定（使用 vw 單位確保響應式）
      const vw = canvas.width / 100;
      const scale = circleScale.current;
      // 圓圈直徑
      const circleDiameter = 12.5 * vw * scale;
      // 圓圈半徑
      const circleRadius = circleDiameter / 2;
      // 圓心到圓心的水平間距
      const horizontalSpacing = 25 * vw * scale;
      // 列與列之間的垂直間距
      const verticalSpacing = 12.5 * vw * scale;

      // 計算視窗中心點
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 計算需要的行列數（從中心向外延伸）
      const halfCols = Math.ceil(centerX / horizontalSpacing) + 1;
      const halfRows = Math.ceil(centerY / verticalSpacing) + 1;

      // 繪製紅色填充圓圈（錯位排列形成網格圖案）
      for (let row = -halfRows - 1; row <= halfRows + 1; row++) {
        for (let col = -halfCols - 1; col <= halfCols + 1; col++) {
          // 偶數列：圓圈向右偏移半個間距
          if (row % 2 === 0) {
            const x = centerX + col * horizontalSpacing + horizontalSpacing / 2;
            const y = centerY + row * verticalSpacing;

            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#F80B28';
            ctx.fill();
          }
          // 奇數列：圓圈正常排列
          else {
            const x = centerX + col * horizontalSpacing;
            const y = centerY + row * verticalSpacing;

            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#F80B28';
            ctx.fill();
          }
        }
      }

      // 繪製灰色外框圓圈（顯示潛在贊助者位置）
      if (showHiddenCircles.current) {
        // 在紅色圓圈之間的空隙繪製灰色外框
        for (let row = -halfRows; row <= halfRows; row++) {
          for (let col = -halfCols; col <= halfCols; col++) {
            // 奇數列向右偏移半個間距（與紅色圓圈互補）
            const xOffset = (row % 2) * (horizontalSpacing / 2);
            const x = centerX + col * horizontalSpacing + xOffset;
            const y = centerY + row * verticalSpacing;

            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 100, 100, ${grayCircleOpacity.current})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }
    };

    // 初始化 Canvas 樣式並加入 DOM
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;';
    bgCircleRef.current.appendChild(canvas);
    updateCanvasSize();

    // 監聽視窗大小變化
    window.addEventListener('resize', updateCanvasSize);

    // ============================
    // ScrollTrigger 動畫設定
    // ============================
    // 動畫：顯示灰色外框圓圈（代表潛在贊助者）
    gsap.timeline({
      scrollTrigger: {
        trigger: '[data-trigger="show-hidden-circle"]',
        start: 'top 50%',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          // 根據滾動進度調整灰色圓圈透明度
          grayCircleOpacity.current = self.progress;
          showHiddenCircles.current = self.progress > 0;
          drawCircles();
        }
      }
    });

    // 動畫：放大圓圈效果（強調贊助者數量）
    gsap.timeline({
      scrollTrigger: {
        trigger: '[data-trigger="bigger-circle"]',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: true,
        onUpdate: (self) => {
          // 圓圈從原始大小放大到指定倍數
          circleScale.current = 1 + self.progress * 5;
          drawCircles();
        }
      }
    });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  // ============================
  // Effects 區塊 - 主要動畫序列
  // ============================
  // 設定頁面滾動動畫序列
  useEffect(() => {
    if (!swiperContainerRef.current) return;

    // 設定 Swiper 容器初始狀態
    gsap.set(swiperContainerRef.current, {
      width: '0px',
      margin: '0px 0px',
      scale: 0,
    });

    // ============================
    // 第一階段：Swiper 出現動畫
    // ============================
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-trigger="content-area"]',
        start: 'top 20%',
        end: 'top 0%',
        scrub: true,
      }
    });

    tl.to(swiperContainerRef.current, {
      width: 'auto',
      scale: 1,
      duration: 1,
      margin: '0px 64px',
      ease: 'power2.out'
    });

    // ============================
    // 第二階段：感謝頁面轉場動畫
    // ============================
    if (leftTitleRef.current && rightTitleRef.current && swiperRef.current && logoRef.current) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="thanks-area"]',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        }
      });

      titleTl
        // 標題向上移動
        .to([leftTitleRef.current, rightTitleRef.current], {
          y: '-50%',
          ease: 'power2.inOut'
        })
        // 隱藏 Swiper
        .to(swiperRef.current, {
          display: 'none',
        }, '<')
        // 縮小 Swiper 容器
        .to(swiperContainerRef.current, {
          margin: '0px 32px',
          width: '0px',
          scale: 0,
          opacity: 0,
        }, '<')
        // 顯示報導者 Logo
        .to(logoRef.current, {
          scale: 1,
        }, '<')
        // 顯示半色調 Logo
        .to(halftoneRef.current, {
          scale: 1,
        }, '<');
    }

    // ============================
    // 第三階段：半色調轉場到圓圈背景
    // ============================
    if (halftoneRef.current && logoRef.current && leftTitleRef.current && rightTitleRef.current && bgCircleRef.current) {
      const halftoneTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="halftone-area"]',
          start: 'top 20%',
          end: 'bottom 20%',
          scrub: true,
        }
      });

      halftoneTl
        // 半色調 Logo 放大並淡出
        .to(halftoneRef.current, {
          scale: 200,
          opacity: 0,
          ease: 'power2.inOut'
        })
        // 同時淡出其他元素
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          opacity: 0,
          ease: 'expo.out'
        }, '<')
        // 隱藏元素
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          display: 'none'
        }, '<')
        // 顯示圓圈背景
        .to(bgCircleRef.current.querySelector('canvas'), {
          opacity: 1,
          ease: 'power2.in'
        }, '<')
    }

    // 清理函數：移除所有 ScrollTrigger 實例
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // ============================
  // 渲染區塊
  // ============================
  // 組件渲染輸出
  return (
    // 主容器：設定總體滾動高度以容納所有動畫階段
    <section
      id="section-feedbacks"
      className="w-full h-[800vh] text-white"
    >
      {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
      <div data-trigger="content-area" className="overflow-hidden h-screen sticky top-0 text-center flex flex-col md:flex-row justify-center items-center gap-[0px]">
        {/* 左側標題：感謝詞前半段 */}
        <div className="h-[28px] overflow-hidden">
          <div ref={leftTitleRef}>
            <h4 className="text-right leading-none">持續求真的路上</h4>
            <h4 className="text-right leading-none">因為有你們</h4>
          </div>
        </div>
        {/* Swiper 容器：證言卡片輪播 */}
        <div ref={swiperContainerRef}
          className="px-4 flex flex-col items-center justify-center"
          data-custom-cursor="GRAB">
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
                  {/* 證言卡片：展示使用者回饋內容 */}
                  <div className="w-full h-full  bg-white text-black border border-gray-200 p-6 sm:p-8 rounded-md flex flex-col justify-center items-center">
                    {/* 證言文字：支援溢出滾動 */}
                    <p className="text-base sm:text-md font-semibold leading-relaxed text-center overflow-y-auto  flex items-center">
                      {quote.text}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* 操作提示 */}
          <p className="text-sm text-gray-700 mt-2">
            grab to switch
          </p>
        </div>
        {/* 右側標題：感謝詞後半段 */}
        <div className="h-[28px] overflow-hidden">
          <div ref={rightTitleRef}>
            <h4 className="text-left leading-none">感謝有眾聲同行</h4>
            <h4 className="text-left leading-none">才有報導者</h4>
          </div>
        </div>


        {/* Logo 元素：用於轉場動畫 */}
        <img ref={halftoneRef} src="/assets/logo-halftone.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <img ref={logoRef} src="/assets/favicon.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* 背景圓圈容器：Canvas 繪圖區域 */}
        <div ref={bgCircleRef} className="w-full h-screen absolute top-0 left-0 -z-10">
        </div>
      </div>

      {/* ============================
      // 轉場區域：動畫觸發點
      // ============================*/}
      <div data-trigger="thanks-area" className="h-[50vh]">
      </div>

      <div data-trigger="halftone-area" className="h-[50vh]">
      </div>

      {/* ============================
      // 第二部分：贊助者統計與號召
      // ============================*/}
      <div className="z-1 h-auto">
        {/* 現有贊助者感謝 */}
        <div className="relative flex flex-col items-center justify-center h-screen">
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
        
        {/* 號召新贊助者（觸發灰色圓圈顯示） */}
        <div data-trigger="show-hidden-circle" className="relative flex flex-col items-center justify-center h-screen">
          <div>
            <h5>
              為了迎接下一個十年的種種挑戰 <br />
              我們需要更多定期定額支持的夥伴與我們前行
            </h5>
            <h4>號招</h4>
            <h1>
              10000
              <span className="text-4xl font-bold">位</span>
            </h1>
            <h3 className="mb-2">支持報導者的定期定額贊助者</h3>
            <h6>和我們一起打造多元進步的公民社會</h6>
          </div>
        </div>
        
        {/* 十週年限定回饋（觸發圓圈放大） */}
        <div data-trigger="bigger-circle" className="relative flex flex-col items-center justify-center h-screen">
          <Image
            src="/assets/gift.png"
            width={1000}
            height={1000}
            alt="十週年限定贊助回饋"
            className="w-full h-auto max-w-[30rem]" />
          <h4 className="mb-2 font-bold">
            十週年限定贊助回饋
          </h4>
          <h6 className="leading-relaxed">
            凡在2025年11月30日（日）前加入定期定額贊助行列 <br />
            即可在《報導者》十週年活動領取十週年限定紀念品
          </h6>
        </div>
      </div>

      {/* ============================
      // 第三部分：贊助行動區域
      // ============================*/}
      <div data-trigger="support-section" className="sticky top-0 flex flex-col items-center justify-center h-screen">
        {/* 嵌入贊助區塊組件 */}
        <SupportSection />
      </div>
    </section>
  );
}