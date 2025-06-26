import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import type { VideoControlButtonsProps } from './types';

/**
 * 影片控制按鈕群組
 * 
 * 包含播放/暫停、靜音、全屏等控制按鈕
 */
export default function VideoControlButtons({ 
  isPlaying, 
  isMuted, 
  title, 
  onTogglePlay, 
  onToggleMute, 
  onToggleFullscreen 
}: VideoControlButtonsProps) {
  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        {/* 播放/暫停 */}
        <button
          onClick={onTogglePlay}
          className="hover:text-blue-400 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        {/* 靜音 */}
        <button
          onClick={onToggleMute}
          className="hover:text-blue-400 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* 標題 */}
        {title && (
          <span className="text-sm opacity-80 max-w-xs truncate">
            {title}
          </span>
        )}
        
        {/* 全屏 */}
        <button
          onClick={onToggleFullscreen}
          className="hover:text-blue-400 transition-colors"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
} 