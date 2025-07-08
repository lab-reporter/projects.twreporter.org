'use client';

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { testimonials } from '@/data/testimonials';

// 導入 Swiper 基本樣式
import "swiper/css";
// 導入 Swiper 覆蓋流效果樣式
import "swiper/css/effect-coverflow";
// 導入 Swiper 分頁指示器樣式
import "swiper/css/pagination";

// 證言回饋頁面主要組件
export default function FeedbacksSection() {
  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-feedbacks',
    // 頁面名稱識別
    sectionName: 'feedbacks'
  });

  // 組件渲染輸出
  return (
    // 主要頁面區塊：證言回饋頁面
    <section
      // 頁面錨點 ID
      id="section-feedbacks"
      className="w-full h-screen text-white flex flex-col justify-center items-center"
    >
      {/* 標題區域：頁面主要標題 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-white">持續求真的路上</h2>
        <h3 className="text-3xl font-semibold mb-8 text-white">感謝有眾聲同行</h3>
      </div>

      {/* 輪播器容器：證言卡片展示區域 */}
      {/* 響應式容器：調整為支援覆蓋流效果的較大寬度，增加高度避免卡片被切到 */}
      <div className="w-full px-4 flex items-center">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={false}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={false}
          loop={true}
          modules={[EffectCoverflow, Pagination]}
          className="feedback-swiper h-full"
        >
          {testimonials.map((quote) => (
            <SwiperSlide key={quote.id} className="!w-[320px] sm:!w-[380px]">
              {/* 證言卡片容器：響應式設計支援不同螢幕尺寸，適配覆蓋流效果 */}
              <div className="w-full h-[400px] sm:h-[480px] my-8 bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center">
                {/* 證言文字區域：可滾動的主要內容 */}
                <p className="mb-4 text-base sm:text-md font-semibold leading-relaxed text-center overflow-y-auto flex-1 flex items-center">
                  {quote.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}