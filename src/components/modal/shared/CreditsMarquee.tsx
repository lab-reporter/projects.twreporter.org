'use client';

import { ReactNode } from 'react';

interface CreditsMarqueeProps {
  children: ReactNode;
  title?: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
}

export default function CreditsMarquee({ 
  children, 
  title = '製作團隊',
  className = '',
  speed = 'normal',
  pauseOnHover = true
}: CreditsMarqueeProps) {
  
  // 速度設定
  const speedClasses = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast'
  };
  
  return (
    <div className={`py-12 text-center ${className}`}>
      {/* 分隔線 */}
      <div className="w-32 md:w-48 lg:w-64 h-[1px] bg-gray-400 mx-auto mb-8 md:mb-10"></div>

      {/* 製作團隊標題 */}
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 md:mb-8">
        {title}
      </h3>

      {/* 跑馬燈容器 */}
      <div className="relative overflow-hidden w-full">
        {/* 左右漸層遮罩 */}
        <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        {/* 跑馬燈內容 - 複製兩份確保無縫循環 */}
        <div className={`
          flex whitespace-nowrap
          ${speedClasses[speed]} 
          ${pauseOnHover ? 'hover:pause' : ''}
        `}>
          <div className="flex items-center space-x-8 md:space-x-12 text-gray-700 text-sm md:text-base">
            {children}
          </div>
          <div className="flex items-center space-x-8 md:space-x-12 text-gray-700 text-sm md:text-base ml-8 md:ml-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}