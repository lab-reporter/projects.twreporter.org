'use client';

import { useState } from 'react';

// 贊助者證言資料
const feedbackData = [
  "報導者的深度報導讓我看見台灣社會的真實面貌",
  "專業的調查新聞是民主社會的重要支柱", 
  "感謝報導者持續關注弱勢族群的聲音",
  "技術創新讓新聞報導更加生動有力",
  "非營利模式證明了另一種媒體可能性",
  "每一篇報導都體現了記者的專業與良心",
  "報導者改變了我對新聞媒體的看法",
  "深度調查報導是推動社會進步的力量"
];

interface FeedbackSectionProps {
  visible: boolean;
  progress: number;
}

export default function FeedbackSection({ visible, progress }: FeedbackSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // 切換證言
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % feedbackData.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + feedbackData.length) % feedbackData.length);
  };

  if (!visible) return null;

  return (
    <div 
      className="w-full h-screen flex flex-col justify-center items-center text-white relative z-10"
      onWheel={(e) => {
        // 將滾動事件傳遞給 window，讓 GSAP ScrollTrigger 能夠正常工作
        window.scrollBy(0, e.deltaY);
      }}
    >
      {/* 標題 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">持續求真的路上</h2>
        <h3 className="text-3xl font-semibold mb-8">感謝有眾聲同行</h3>
      </div>

      {/* 證言卡片 */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl min-h-[200px] flex items-center justify-center">
          <p className="text-xl font-medium text-center leading-relaxed">
            "{feedbackData[currentTestimonial]}"
          </p>
        </div>

        {/* 導航按鈕 */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 指示器 */}
      <div className="flex space-x-2 mt-8">
        {feedbackData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentTestimonial 
                ? 'bg-white' 
                : 'bg-white bg-opacity-30 hover:bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* 互動提示 */}
      <p className="text-sm text-gray-300 mt-6 text-center">
        感謝每一位支持者的信任
      </p>
    </div>
  );
}