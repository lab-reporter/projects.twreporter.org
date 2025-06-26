import type { VideoLoadingStateProps } from './types';

/**
 * 影片載入狀態組件
 * 
 * 顯示載入中的動畫指示器
 */
export default function VideoLoadingState({}: VideoLoadingStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );
} 