'use client';

import { useRef, useState, useEffect } from 'react';

interface ReportsSwiperItemProps {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  bgColor?: string;
  shouldPlay?: boolean; // 控制是否應該播放
}

export default function ReportsSwiperItem({ id, path, title, subtitle, bgColor, shouldPlay = false }: ReportsSwiperItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isVideo = path.endsWith('.mp4');

  const handleVideoLoad = () => {
    console.log('✅ 影片載入成功:', title);
    setIsLoading(false);
  };

  const handleVideoError = (e: any) => {
    console.error('❌ 影片載入失敗:', title, path);
    setIsLoading(false);
    setHasError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ 圖片載入成功:', title);
    setIsLoading(false);
  };

  const handleImageError = (e: any) => {
    console.error('❌ 圖片載入失敗:', title, path);
    setIsLoading(false);
    setHasError(true);
  };

  // 簡化載入檢測 - 直接在渲染後設為載入完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒後自動完成載入

    return () => clearTimeout(timer);
  }, []);

  // 根據 shouldPlay 控制影片播放
  useEffect(() => {
    if (isVideo && videoRef.current && !isLoading) {
      const video = videoRef.current;
      
      // 設置基本屬性
      video.muted = true;
      video.loop = true;
      
      if (shouldPlay) {
        // 應該播放：啟動播放
        const startPlayback = () => {
          video.play().then(() => {
            console.log('✅ 影片開始播放:', title);
          }).catch((error) => {
            console.warn('⚠️ 播放失敗:', title, error);
          });
        };

        if (video.readyState >= 2) { // HAVE_CURRENT_DATA
          startPlayback();
        } else {
          video.addEventListener('canplay', startPlayback, { once: true });
        }
      } else {
        // 不應該播放：暫停影片
        video.pause();
        video.currentTime = 0; // 重置到開始位置
        console.log('⏸️ 影片暫停（效能優化）:', title);
      }
    }
  }, [isVideo, isLoading, shouldPlay, title]);


  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer group bg-gray-100"
      style={{ backgroundColor: bgColor || '#F1F1F1' }}
    >
      {/* 媒體內容 */}
      <div className="w-full h-full overflow-hidden relative">
        {/* 載入指示器 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        )}

        {/* 錯誤狀態 */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-sm text-gray-600">載入失敗</p>
            </div>
          </div>
        )}

        {isVideo ? (
          <video
            ref={videoRef}
            src={path}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img
            src={path}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
      </div>

      {/* Hover 效果 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none" />
    </div>
  );
}