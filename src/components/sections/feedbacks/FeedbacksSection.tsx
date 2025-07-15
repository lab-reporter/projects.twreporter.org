'use client';

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectCoverflow, Pagination } from "swiper/modules";
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

  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-feedbacks',
    // 頁面名稱識別
    sectionName: 'feedbacks'
  });

  // 設定 GSAP ScrollTrigger 動畫
  useEffect(() => {
    if (!swiperContainerRef.current) return;

    // 設定初始寬度
    gsap.set(swiperContainerRef.current, {
      width: 0,
      scale: 0,
      margin: '0px 0px',
    });

    // 建立 ScrollTrigger 動畫
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-feedbacks-trigger="testimonial-area"]',
        start: 'top 20%',
        end: 'top 0%',
        scrub: true,
        markers: true,
      }
    });

    tl.to(swiperContainerRef.current, {
      width: 'auto',
      margin: '0px 64px',
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    });

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
      className="w-full h-[500vh] text-white"
    >
      {/* 讀者證言區域 */}
      <div data-feedbacks-trigger="testimonial-area" className="h-screen sticky top-0 text-center flex flex-col md:flex-row justify-center items-center gap-[0px]">
        <h4 className="flex-1 text-right">持續求真的路上</h4>
        {/* swiper容器 */}
        <div ref={swiperContainerRef} className="px-4 flex items-center justify-center">
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
                  <p className="text-base sm:text-md font-semibold leading-relaxed text-center overflow-y-auto flex-1 flex items-center">
                    {quote.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <h4 className="flex-1 text-left">感謝有眾聲同行</h4>
      </div>
    </section>
  );
}