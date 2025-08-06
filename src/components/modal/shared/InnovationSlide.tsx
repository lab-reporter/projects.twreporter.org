'use client';

import React from 'react';

// InnovationSlide 組件 - 每個投影片的容器
interface InnovationSlideProps {
  children: React.ReactNode;
  className?: string; // 允許自訂樣式
}

export default function InnovationSlide({ 
  children, 
  className = '' 
}: InnovationSlideProps) {
  // InnovationSlide 本身只是一個語意化的容器
  // 實際的投影片邏輯由 SlideContainer 處理
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}