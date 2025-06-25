'use client';

import { ReactNode } from 'react';

interface CreditsMarqueeProps {
  children: ReactNode;
  className?: string;
}

export default function CreditsMarquee({ 
  children, 
  className = ''
}: CreditsMarqueeProps) {
  return (
    <div className={`py-12 text-center font-noto-sans-tc ${className}`}>
      {/* 分隔線 */}
      <div className="w-64 h-[1px] bg-gray-400 mx-auto mb-10"></div>

      {/* 製作團隊標題 */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">製作團隊</h3>

      {/* 跑馬燈容器 */}
      <div className="relative overflow-hidden w-full">
        {/* 跑馬燈內容 - 複製兩份確保無縫循環 */}
        <div className="flex animate-marquee hover:pause whitespace-nowrap">
          <div className="flex items-center space-x-12 text-gray-700">
            {children}
          </div>
          <div className="flex items-center space-x-12 text-gray-700 ml-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}