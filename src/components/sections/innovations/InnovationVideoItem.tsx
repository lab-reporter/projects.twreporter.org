'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { InnovationVideoItemProps } from './types';
import { isSafari } from './utils';

// ============================
// 子組件：創新影片項目
// ============================
// 單個創新項目的展示組件，處理影片播放和 3D 定位
export default function InnovationVideoItem({
  item,
  index,
  isVisible,
  is3DEnabled,
  animationsEnabled,
  offset,
  initialDepth,
  onItemClick
}: InnovationVideoItemProps) {
  // ============================
  // DOM 參考與狀態
  // ============================
  // DOM 元素參考：影片播放器
  const videoRef = useRef<HTMLVideoElement>(null);
  // 狀態變數：影片是否已載入完成
  const [videoLoaded, setVideoLoaded] = useState(false);

  const [init, setInit] = useState(false);

  // ============================
  // Effects 區塊 - 影片播放控制
  // ============================
  // 根據可見性自動控制影片播放與暫停
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // 策略：可見時播放，不可見時暫停（效能最佳化）
    if (isVisible) {
      const attemptPlay = async () => {
        try {
          await video.play();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Video ${item.id} autoplay failed:`, error);
          }
        }
      };

      attemptPlay();
    } else {
      // 暫停播放以節省資源
      try {
        video.pause();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Video ${item.id} pause failed:`, error);
        }
      }
    }
  }, [isVisible, videoLoaded, item.id]);

  // ============================
  // 事件處理函數
  // ============================
  // 處理影片載入完成事件
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);

    // 載入完成且可見時立即播放
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Video ${item.id} initial play failed:`, error);
        }
      });
    }
  }, [isVisible, item.id]);

  // ============================
  // 計算值區塊
  // ============================
  // 判斷是否為第一個項目（特殊處理：始終置中）
  const isFirstItem = index === 0;
  const shouldCenterFirst = isFirstItem && !animationsEnabled;

  useEffect(() => {
    setInit(true)
  }, [])

  // ============================
  // 渲染區塊
  // ============================
  return (
    // 項目容器：絕對定位於場景中心
    <div
      id={`innovation-item-${item.id}`}
      className="absolute top-1/2 left-1/2 will-change-transform pointer-events-auto"
      style={{
        cursor: "zoom-in",
        transformOrigin: "center center",
        width: "800px",
        height: "800px",
        transform: "translate(-50%, -50%)",
        // 根據深度設定初始透明度，避免載入時的閃爍
        opacity: is3DEnabled ? undefined : initialDepth < -300 ? 0 : 0.6,
        // 位置策略：第一個項目始終置中，其他項目根據動畫狀態決定偏移
        left: shouldCenterFirst
          ? "50%"
          : !animationsEnabled
          ? `calc(50% + ${offset.x}vw)`
          : "50%",
        top: shouldCenterFirst
          ? "50%"
          : !animationsEnabled
          ? `calc(50% + ${offset.y}vh)`
          : "50%",
        // Z 軸層級：第一個項目優先顯示
        zIndex: isFirstItem ? 10 : 1,
      }}
      onClick={() => onItemClick(item)}
    >
      {/* 影片容器：提供圓角和溢出裁切 */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        {/* 影片播放器：自動循環播放的靜音影片 */}
        {init && <video
          ref={videoRef}
          src={isSafari() ? item.path.replace(".webm", ".mp4") : item.path}
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
          style={{ pointerEvents: "none" }}
          onLoadedData={handleVideoLoaded}
          onCanPlayThrough={handleVideoLoaded}
        />}
        {/* Hover 資訊層：滑鼠懸停時顯示標題和副標題 */}
        <div className="absolute inset-0 transition-all duration-300 flex items-end">
          <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm opacity-80">{item.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}ut