'use client';

import { useState } from 'react';

interface HeroBannerProps {
  mediaSrc?: string;
  title: string;
  subtitle?: string;
  date?: string;
  className?: string;
}

export default function HeroBanner({ 
  mediaSrc, 
  title, 
  subtitle, 
  date, 
  className = '' 
}: HeroBannerProps) {
  const [mediaError, setMediaError] = useState(false);
  
  // 判斷媒體類型的函數 - 完全匹配原始邏輯
  const getMediaType = (src?: string) => {
    if (!src) return 'image';

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const lowerSrc = src.toLowerCase();

    return videoExtensions.some(ext => lowerSrc.includes(ext)) ? 'video' : 'image';
  };
  
  const mediaType = getMediaType(mediaSrc);
  
  const handleMediaError = () => {
    setMediaError(true);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* 媒體容器 - 使用原始的 90vh 高度 */}
      <div className="w-full h-[calc(90vh)]">
        {mediaError ? (
          // 錯誤狀態
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white/80">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">媒體載入失敗</p>
            </div>
          </div>
        ) : mediaSrc ? (
          // 有媒體來源
          mediaType === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              onError={handleMediaError}
            >
              您的瀏覽器不支援影片播放。
            </video>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={mediaSrc}
              alt={title}
              onError={handleMediaError}
            />
          )
        ) : (
          // 無媒體來源 - 預設漸層背景
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" />
        )}
        
        {/* 漸層遮罩 - 完全匹配原始設計 */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-blend-multiply" 
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%)' 
          }}
        />
      </div>
      
      {/* 文字內容疊加 - 完全匹配原始位置和樣式 */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center">
        {/* 日期 - 原始樣式 */}
        {date && (
          <h4 className="text-white text-xl font-bold text-center mb-4">
            {date}
          </h4>
        )}
        
        {/* 主標題 - 原始樣式 */}
        <h2 className="text-white text-4xl font-bold text-center mb-4">
          {title}
        </h2>
        
        {/* 副標題 - 原始樣式 */}
        {subtitle && (
          <h3 className="text-white text-xl font-bold text-center">
            {subtitle}
          </h3>
        )}
      </div>
    </div>
  );
}