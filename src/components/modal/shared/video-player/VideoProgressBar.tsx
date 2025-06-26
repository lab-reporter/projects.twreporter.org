import type { VideoProgressBarProps } from './types';

/**
 * 影片進度條組件
 * 
 * 顯示播放進度並支援點擊跳轉
 */
export default function VideoProgressBar({ 
  currentTime, 
  duration, 
  onProgressClick 
}: VideoProgressBarProps) {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div 
      className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3"
      onClick={onProgressClick}
    >
      <div 
        className="h-full bg-blue-500 rounded-full transition-all duration-100"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
} 