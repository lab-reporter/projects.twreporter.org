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
          width={480}
          height={360}
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
          <span className="text-gray-700 text-lg">沒有更多內容</span>
        </div>
      );
    }

    // 根據方向決定是否反轉佈局
    const isNext = direction === 'next';

    return (
      <div
        className="flex-1 rounded-md overflow-hidden border-[1px] border-gray-500 hover:border-black transition-colors duration-300 cursor-pointer group"
        onClick={() => onNavigate?.(direction)}
        data-custom-cursor="VIEW"
      >

        <div className={`flex h-full group ${isNext ? 'flex-row-reverse' : ''}`}>

          {/* 內容區域 */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            {/* 文字內容 */}
            <div>
              <h5
                className={`text-gray-600 group-hover:text-black transition-colors line-clamp-2 ${isNext ? 'text-right' : 'text-left '}`}
                dangerouslySetInnerHTML={{ __html: project.title }}
              />
              {project.subtitle && (
                <p className={`text-gray-600 group-hover:text-black transition-colors text-base font-medium line-clamp-3 leading-relaxed ${isNext ? 'text-right' : ''}`}>
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* 切換按鈕區域 */}
            <div className={`flex items-center justify-start gap-2 ${isNext ? 'flex-row-reverse' : ''}`}>
              <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
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

          {/* 圖片影片區域 */}
          <div className="flex-1 opacity-100 filter grayscale group-hover:opacity-100 group-hover:filter-none transition-all duration-300 overflow-hidden">
            {renderMedia(project.path, project.title)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full py-32 flex items-center relative z-10 ${className}`}>
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