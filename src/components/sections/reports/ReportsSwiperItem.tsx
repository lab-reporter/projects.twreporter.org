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
  isDragging?: boolean; // 是否正在拖曳
  dragDelta?: number; // 拖曳距離
  isActive?: boolean; // 是否為當前顯示的項目
  index?: number; // 項目索引
  onItemClick?: (index: number) => void; // 點擊項目的回調函數
  isCustomCursorEnabled?: boolean; // 是否啟用自訂游標
}

export default function ReportsSwiperItem({ id, path, title, bgColor, shouldPlay = false, projectData, isDragging = false, dragDelta = 0, isActive = false, index = 0, onItemClick, isCustomCursorEnabled = false }: ReportsSwiperItemProps) {
  const { openModal } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mouseDownTime, setMouseDownTime] = useState(0);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);

  const isVideo = path.endsWith('.mp4') || path.endsWith('.webm');

  // 當 path 改變時重置載入狀態
  useEffect(() => {
    setIsLoading(true);
  }, [path]);

  // 滑鼠按下處理
  const handleMouseDown = () => {
    setMouseDownTime(Date.now());
    setHasMouseMoved(false);
  };

  // 點擊事件處理器 - 開啟對應的 Modal 或切換項目
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 計算按下到放開的時間
    const clickDuration = Date.now() - mouseDownTime;

    // 如果正在拖曳、拖曳距離超過 10px、按住時間太長（超過 200ms）或有移動，都不觸發點擊
    if (isDragging || Math.abs(dragDelta) > 10 || clickDuration > 200 || hasMouseMoved) {
      return;
    }

    if (!isActive) {
      // 如果不是當前項目，切換到該項目
      if (onItemClick) {
        onItemClick(index);
      }
    } else {
      // 如果是當前項目，開啟 modal
      if (projectData) {
        openModal(id, projectData);
      }
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

  // 監測拖曳狀態變化
  useEffect(() => {
    if (isDragging || Math.abs(dragDelta) > 10) {
      setHasMouseMoved(true);
    }
  }, [isDragging, dragDelta]);


  return (
    <div
      className="relative w-full h-full rounded-sm overflow-hidden group bg-gray-100 select-none"
      style={{
        backgroundColor: bgColor || '#F1F1F1',
        cursor: isActive ? 'zoom-in' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      data-custom-cursor={isCustomCursorEnabled ? (isActive ? "VIEW" : "SWITCH") : undefined}
    >
      {/* 媒體內容 */}
      <div className="w-full h-full overflow-hidden relative bg-white select-none" style={{ cursor: 'none', userSelect: 'none' }}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={path}
            className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out select-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ cursor: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={handleMediaLoad}
            draggable={false}
          />
        ) : (
          <Image
            src={path}
            alt={title}
            width={500}
            height={500}
            quality={75}
            className={`w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-transform transition-opacity duration-300 ease-in-out select-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ cursor: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
            onLoad={handleMediaLoad}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}