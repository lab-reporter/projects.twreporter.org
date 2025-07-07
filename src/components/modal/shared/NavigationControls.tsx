'use client';

import { AdjacentProjects } from '../types';
import Image from 'next/image';

interface NavigationControlsProps {
  onNavigate?: (direction: 'prev' | 'next') => void;
  onHome?: () => void;
  adjacentProjects: AdjacentProjects;
  className?: string;
}

export default function NavigationControls({
  onNavigate,
  adjacentProjects,
  className = ''
}: NavigationControlsProps) {

  // 判斷是否為影片檔案
  const isVideo = (path: string) => {
    return path.endsWith('.mp4') || path.endsWith('.webm');
  };

  // 渲染媒體內容（圖片或影片）
  const renderMedia = (path: string, title: string) => {
    if (isVideo(path)) {
      return (
        <video
          src={path}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
        />
      );
    } else {
      return (
        <Image
          src={path}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          quality={85}
        />
      );
    }
  };

  // 渲染單個導航項目
  const renderNavigationItem = (
    project: { id: string; path: string; title: string; subtitle?: string } | null,
    direction: 'prev' | 'next',
    label: string
  ) => {
    if (!project) {
      return (
        <div className="flex-1 flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <span className="text-gray-400 text-lg">沒有更多內容</span>
        </div>
      );
    }

    // 根據方向決定是否反轉佈局
    const isNext = direction === 'next';

    return (
      <div
        className="flex-1 bg-white rounded-lg overflow-hidden border-[1px] border-gray-200 transition-all duration-300 cursor-pointer group"
        onClick={() => onNavigate?.(direction)}
      >
        {/* 上方標籤區域 */}
        <div className="px-6 py-4 border-b">
          <div className={`flex items-center justify-between ${isNext ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-700 font-bold text-lg tracking-wider">
              {label}
            </span>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {direction === 'prev' ? (
                  <path d="M15 18l-6-6 6-6" />
                ) : (
                  <path d="M9 18l6-6-6-6" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* 內容區域 */}
        <div className={`flex ${isNext ? 'flex-row-reverse' : ''}`}>
          {/* 文字內容 */}
          <div className="flex-1 p-6">
            <h3 className={`font-bold text-xl mb-3 text-gray-800 line-clamp-2 leading-tight ${isNext ? 'text-right' : ''}`}>
              {project.title}
            </h3>
            {project.subtitle && (
              <p className={`text-gray-600 text-base line-clamp-3 leading-relaxed ${isNext ? 'text-right' : ''}`}>
                {project.subtitle}
              </p>
            )}
          </div>

          {/* 媒體預覽 */}
          <div className="w-48 h-36 bg-gray-200 overflow-hidden">
            {renderMedia(project.path, project.title)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full relative z-10 py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 導航預覽區域 */}
        <div className="flex gap-8">
          {/* 上一則預覽 */}
          {renderNavigationItem(adjacentProjects.prev, 'prev', 'PREV')}

          {/* 下一則預覽 */}
          {renderNavigationItem(adjacentProjects.next, 'next', 'NEXT')}
        </div>
      </div>

      {/* 自訂樣式：限制文字行數 */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}