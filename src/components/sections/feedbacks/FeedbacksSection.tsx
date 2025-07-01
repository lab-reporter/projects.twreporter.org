'use client';

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip, Pagination, Navigation } from "swiper/modules";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { testimonials } from '@/data/testimonials';

import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeedbacksSection() {
  useScrollTrigger({
    sectionId: 'section-feedbacks',
    sectionName: 'feedbacks'
  });


  return (
    <section
      id="section-feedbacks"
      className="w-full h-screen bg-black text-white flex flex-col justify-center items-center"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-white">持續求真的路上</h2>
        <h3 className="text-3xl font-semibold mb-8 text-white">感謝有眾聲同行</h3>
      </div>

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
              <div className="mx-auto w-full max-w-[320px] sm:w-[320px] h-[400px] sm:h-[480px] bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center">
                <p className="mb-4 text-base sm:text-lg font-semibold leading-relaxed text-center overflow-y-auto flex-1 flex items-center">
                  {quote.text}
                </p>
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