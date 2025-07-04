import { useState, useRef, useEffect } from 'react';
import type { VideoPlayerProps, VideoPlayerState, VideoPlayerActions } from './types';

/**
 * VideoPlayer 自定義 Hook
 * 
 * 負責管理影片播放器的所有狀態和邏輯：
 * - 播放狀態管理
 * - 事件處理
 * - 錯誤處理
 * - 進度控制
 */
export function useVideoPlayer(props: VideoPlayerProps): {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  state: VideoPlayerState;
  actions: VideoPlayerActions;
} {
  const { autoPlay = false, muted = true, onError } = props;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // 播放/暫停控制
  const togglePlay = async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('播放控制錯誤:', error);
    }
  };
  
  // 靜音控制
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };
  
  // 重新載入
  const reload = () => {
    if (!videoRef.current) return;
    
    setHasError(false);
    setIsLoading(true);
    videoRef.current.load();
  };
  
  // 全屏
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };
  
  // 進度條控制
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // 時間格式化
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // 事件處理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleError = (error: Event) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [onError]);
  
  return {
    videoRef,
    state: {
      isPlaying,
      isMuted,
      currentTime,
      duration,
      isLoading,
      hasError
    },
    actions: {
      togglePlay,
      toggleMute,
      reload,
      toggleFullscreen,
      handleProgressClick,
      formatTime
    }
  };
} 