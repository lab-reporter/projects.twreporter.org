'use client';

import { useState } from 'react';
import { ContentProps } from '../types';

export default function MediaDisplay({ projectData }: Pick<ContentProps, 'projectData'>) {
  const [imageError, setImageError] = useState(false);
  
  if (!projectData.path) return null;
  
  // 檢測是否為影片檔案
  const fileExtension = projectData.path.split('.').pop()?.toLowerCase() || '';
  const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
  const isVideo = videoFormats.includes(fileExtension);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  if (imageError) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">圖片載入失敗</p>
          <p className="text-sm">檔案路徑：{projectData.path}</p>
        </div>
      </div>
    );
  }
  
  if (isVideo) {
    return (
      <div className="w-full">
        <video
          src={projectData.path}
          controls
          className="w-full h-auto max-h-96 rounded-lg object-cover"
          onError={handleImageError}
        >
          <p className="text-gray-500">您的瀏覽器不支援影片播放</p>
        </video>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <img 
        src={projectData.path}
        alt={projectData.title}
        className="w-full h-auto max-h-96 rounded-lg object-cover shadow-md"
        onError={handleImageError}
      />
    </div>
  );
}