'use client';

import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/stores';
import Image from 'next/image';

interface ReportsSwiperItemProps {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  bgColor?: string;
  shouldPlay?: boolean; // 控制是否應該播放
  projectData?: Record<string, unknown>; // 完整的專案資料，用於 Modal 顯示
}

export default function ReportsSwiperItem({ id, path, title, bgColor, shouldPlay = false, projectData }: ReportsSwiperItemProps) {
  const { openModal } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isVideo = path.endsWith('.mp4') || path.endsWith('.webm');

  // 當 path 改變時重置載入狀態
  useEffect(() => {
    setIsLoading(true);
  }, [path]);

  // 點擊事件處理器 - 開啟對應的 Modal
  const handleClick = () => {
    if (projectData) {
      openModal(id, projectData);
    }
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
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
          }).catch(() => {
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
      }
    }
  }, [isVideo, isLoading, shouldPlay, title]);


  return (
    <div
      className="relative w-full h-full rounded-sm overflow-hidden group bg-gray-100"
      style={{ backgroundColor: bgColor || '#F1F1F1', cursor: 'pointer' }}
      onClick={handleClick}
      data-custom-cursor="explore"
    >
      {/* 媒體內容 */}
      <div className="w-full h-full overflow-hidden relative bg-white" style={{ cursor: 'none' }}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={path}
            className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ cursor: 'none' }}
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={handleMediaLoad}
          />
        ) : (
          <Image
            src={path}
            alt={title}
            width={500}
            height={500}
            quality={75}
            className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ cursor: 'none' }}
            onLoad={handleMediaLoad}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
    </div>
  );
}