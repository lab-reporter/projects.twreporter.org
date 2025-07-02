'use client';

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip, Pagination, Navigation } from "swiper/modules";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { testimonials } from '@/data/testimonials';

// 導入 Swiper 基本樣式
import "swiper/css";
// 導入 Swiper 翻轉效果樣式
import "swiper/css/effect-flip";
// 導入 Swiper 分頁指示器樣式
import "swiper/css/pagination";
// 導入 Swiper 導航按鈕樣式
import "swiper/css/navigation";

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
      {/* 響應式容器：手機版有內距，桌面版無內距 */}
      <div className="w-full max-w-lg px-4 sm:px-0">
        <Swiper
          modules={[EffectFlip, Pagination, Navigation]}
          effect="flip"
          grabCursor={true}
          pagination={false}
          navigation
          loop={true}
          className="feedback-swiper"
        >
          {testimonials.map((quote) => (
            <SwiperSlide key={quote.id}>
              {/* 證言卡片容器：響應式設計支援不同螢幕尺寸 */}
              <div className="mx-auto w-full max-w-[320px] sm:w-[320px] h-[400px] sm:h-[480px] bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center">
                {/* 證言文字區域：可滾動的主要內容 */}
                <p className="mb-4 text-base sm:text-lg font-semibold leading-relaxed text-center overflow-y-auto flex-1 flex items-center">
                  {quote.text}
                </p>
                {/* 作者資訊區域：固定在卡片底部 */}
                <div className="mt-auto pt-4 border-t border-gray-200 w-full text-center flex-shrink-0">
                  <p className="text-sm text-gray-600 font-medium">
                    — {quote.author}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}