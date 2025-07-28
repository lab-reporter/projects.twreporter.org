'use client';

import { ReactNode, Children } from 'react';

interface CreditsMarqueeProps {
  children: ReactNode;
  className?: string;
}

export default function CreditsMarquee({
  children,
  className = ''
}: CreditsMarqueeProps) {
  // 計算 children 的數量
  const childCount = Children.count(children);
  // 每個項目 4 秒，計算總時長
  const animationDuration = childCount * 4;

  return (
    <div className={`py-12 text-center ${className}`}>
      {/* 分隔線 */}
      <div className="w-64 h-[1px] bg-gray-400 mx-auto mb-10"></div>

      {/* 製作團隊標題 */}
      <h6 className="text-gray-600 mb-4">製作團隊</h6>

      {/* 跑馬燈容器 */}
      <div className="relative overflow-hidden w-full group">
        {/* 跑馬燈內容 - 複製兩份確保無縫循環 */}
        <div className="flex whitespace-nowrap">
          <div
            className="flex group-hover:[animation-play-state:paused] items-center space-x-12 text-gray-700 pr-12"
            style={{
              animation: `marquee ${animationDuration}s linear infinite`
            }}
          >
            {children}
          </div>
          <div
            className="flex group-hover:[animation-play-state:paused] items-center space-x-12 text-gray-700 pr-12"
            style={{
              animation: `marquee ${animationDuration}s linear infinite`
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}