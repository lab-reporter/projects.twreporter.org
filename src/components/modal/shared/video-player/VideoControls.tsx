import VideoProgressBar from './VideoProgressBar';
import VideoControlButtons from './VideoControlButtons';
import type { VideoControlsProps } from './types';

/**
 * 影片控制器主組件
 * 
 * 整合進度條、時間顯示和控制按鈕
 */
export default function VideoControls({ 
  isPlaying, 
  isMuted, 
  currentTime, 
  duration, 
  title, 
  onTogglePlay, 
  onToggleMute, 
  onProgressClick, 
  onToggleFullscreen 
}: VideoControlsProps) {
  // 時間格式化函數
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="p-4">
        {/* 進度條 */}
        <VideoProgressBar
          currentTime={currentTime}
          duration={duration}
          onProgressClick={onProgressClick}
        />
        
        {/* 控制按鈕和時間顯示 */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <VideoControlButtons
              isPlaying={isPlaying}
              isMuted={isMuted}
              title={title}
              onTogglePlay={onTogglePlay}
              onToggleMute={onToggleMute}
              onToggleFullscreen={onToggleFullscreen}
            />
            
            {/* 時間顯示 */}
            <span className="text-sm ml-3">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 