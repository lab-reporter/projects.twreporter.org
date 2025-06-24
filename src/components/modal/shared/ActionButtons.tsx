'use client';

import { ExternalLink, Share2 } from 'lucide-react';
import { ContentProps } from '../types';

export default function ActionButtons({ projectData }: Pick<ContentProps, 'projectData'>) {
  const handleReadMore = () => {
    // 這裡可以加入實際的連結邏輯
    console.log('閱讀完整報導:', projectData.title);
    // 可以開啟新視窗或導航到完整報導頁面
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: projectData.title,
          text: projectData.subtitle,
          url: window.location.href
        });
      } else {
        // Fallback: 複製到剪貼簿
        await navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼簿');
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button 
        onClick={handleReadMore}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        <ExternalLink size={18} />
        閱讀完整報導
      </button>
      
      <button 
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
      >
        <Share2 size={18} />
        分享報導
      </button>
    </div>
  );
}