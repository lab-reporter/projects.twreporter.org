'use client';

import { useVideoPlayer } from './useVideoPlayer';
import VideoControls from './VideoControls';
import VideoErrorState from './VideoErrorState';
import VideoLoadingState from './VideoLoadingState';
import type { VideoPlayerProps } from './types';

/**
 * 影片播放器主組件
 * 
 * 功能完整的影片播放器，包含：
 * - 影片播放控制
 * - 進度條和時間顯示
 * - 全屏支援
 * - 錯誤處理
 * - 載入狀態
 */
export default function VideoPlayer(props: VideoPlayerProps) {
  const { src, title, poster, className = '', autoPlay, loop, muted, controls } = props;
  
  const { videoRef, state, actions } = useVideoPlayer(props);
  
  // 錯誤狀態
  if (state.hasError) {
    return (
      <VideoErrorState 
        className={className} 
        onReload={actions.reload} 
      />
    );
  }
  
  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      {/* 影片元素 */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-auto"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
      >
        您的瀏覽器不支援影片播放。
      </video>
      
      {/* 載入指示器 */}
      {state.isLoading && <VideoLoadingState />}
      
      {/* 自定義控制器 */}
      {controls && !state.isLoading && (
        <VideoControls
          isPlaying={state.isPlaying}
          isMuted={state.isMuted}
          currentTime={state.currentTime}
          duration={state.duration}
          title={title}
          onTogglePlay={actions.togglePlay}
          onToggleMute={actions.toggleMute}
          onProgressClick={actions.handleProgressClick}
          onToggleFullscreen={actions.toggleFullscreen}
        />
      )}
    </div>
  );
} 