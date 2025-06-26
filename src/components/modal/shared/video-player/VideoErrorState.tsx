import { RotateCcw } from 'lucide-react';
import type { VideoErrorStateProps } from './types';

/**
 * 影片錯誤狀態組件
 * 
 * 當影片載入失敗時顯示錯誤訊息和重新載入按鈕
 */
export default function VideoErrorState({ 
  className = '', 
  onReload 
}: VideoErrorStateProps) {
  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg mb-4">影片載入失敗</p>
          <button
            onClick={onReload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mx-auto"
          >
            <RotateCcw size={16} />
            重新載入
          </button>
        </div>
      </div>
    </div>
  );
} 