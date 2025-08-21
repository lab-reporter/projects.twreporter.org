'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../shared/NavigationIcons';
import { Button } from '@/components/shared';
import { getResponsiveImagePath, type ProjectData } from '@/utils/responsiveImage';

interface Project {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  section: string[];
  bgColor?: string;
  imageSRC?: string;
  paths?: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
}

interface ModalSidepanelProps {
  isOpen: boolean;
  onToggle: () => void;
  projects: Project[];
  currentProjectId?: string;
  onSelectProject: (projectId: string) => void;
}

export default function ModalSidepanel({
  isOpen,
  onToggle,
  projects,
  currentProjectId,
  onSelectProject
}: ModalSidepanelProps) {
  // 圖片載入狀態管理
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // 判斷是否為影片檔案
  const isVideo = (path: string) => {
    return path.endsWith('.mp4') || path.endsWith('.webm');
  };

  // 預載圖片函數
  const preloadImage = useCallback((src: string) => {
    if (preloadedImagesRef.current.has(src) || isVideo(src)) return;

    setLoadingImages(prev => new Set(prev).add(src));

    const img = new window.Image();
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(src));
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
      preloadedImagesRef.current.add(src);
    };
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
    };
    img.src = src;
  }, []);

  // 當 ModalSidepanel 即將開啟時預載圖片
  useEffect(() => {
    if (isOpen && projects.length > 0) {
      // 立即預載前幾張重要圖片 - 使用 thumbnail 路徑
      projects.slice(0, 6).forEach(project => {
        const mediaPath = getResponsiveImagePath(project as ProjectData, 'modal-sidepanel');
        if (!isVideo(mediaPath)) {
          preloadImage(mediaPath);
        }
      });

      // 延遲預載剩餘圖片
      setTimeout(() => {
        projects.slice(6).forEach(project => {
          const mediaPath = getResponsiveImagePath(project as ProjectData, 'modal-sidepanel');
          if (!isVideo(mediaPath)) {
            preloadImage(mediaPath);
          }
        });
      }, 300);
    }
  }, [isOpen, projects, preloadImage]);

  // Hover 時預載圖片（提前預載機制）
  const handleProjectHover = (project: Project) => {
    const mediaPath = getResponsiveImagePath(project as ProjectData, 'modal-sidepanel');
    if (!isVideo(mediaPath) && !preloadedImagesRef.current.has(mediaPath)) {
      preloadImage(mediaPath);
    }
  };

  // 渲染媒體內容（圖片或影片）- 固定使用 thumbnail 路徑
  const renderMedia = (project: Project) => {
    // 使用響應式圖片系統，固定為 modal-sidepanel 情境（thumbnail）
    const mediaPath = getResponsiveImagePath(project as ProjectData, 'modal-sidepanel');

    // 檢查圖片載入狀態
    const isImageLoaded = loadedImages.has(mediaPath);
    const isImageLoading = loadingImages.has(mediaPath);

    // 檢查是否為影片且沒有縮圖
    const shouldShowVideo = isVideo(project.path) && !project.imageSRC && !project.paths;

    if (shouldShowVideo) {
      return (
        <video
          src={project.path}
          className="w-full h-full object-contain"
          muted
          loop
          autoPlay
          playsInline
        />
      );
    } else {
      return (
        <div className="w-full h-full relative">
          {/* 載入中的骨架屏 */}
          {!isImageLoaded && (
            <div className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center transition-opacity duration-200 ${isImageLoading ? 'opacity-100' : 'opacity-60'
              }`}>
              {isImageLoading && (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}

          <Image
            src={mediaPath}
            alt={project.title}
            width={320}
            height={240}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            quality={85}
            priority={projects.findIndex(p => p.id === project.id) < 6} // 前6張優先載入
            sizes="320px"
            onLoad={() => {
              setLoadedImages(prev => new Set(prev).add(mediaPath));
              setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(mediaPath);
                return newSet;
              });
            }}
          />

          {/* 開發模式：顯示縮圖指示器 */}
          {process.env.NODE_ENV === 'development' && project.paths && (
            <div className="absolute top-1 right-1">
              <div className="bg-green-500 text-white text-xs px-1 rounded opacity-90">
                縮圖
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // 渲染單個項目卡片
  const renderProjectCard = (project: Project) => {
    const isActive = project.id === currentProjectId;

    return (
      <div
        key={project.id}
        className={`rounded-md border overflow-hidden bg-[rgba(255,255,255,0.5)] backdrop-blur-lg transition-all duration-300 shadow-lg group ${isActive
          ? 'border-black'
          : 'border-white hover:border-black'
          }`}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelectProject(project.id)}
        onMouseEnter={() => handleProjectHover(project)}
      >
        <div className="flex flex-col h-auto">
          {/* 圖片影片區域 */}
          <div className="w-full aspect-[2/1] overflow-hidden">
            <div className={`w-full h-full ${isActive
              ? 'opacity-100'
              : 'opacity-80 filter grayscale group-hover:filter-none'
              } transition-all duration-300`}>
              {renderMedia(project)}
            </div>
          </div>

          {/* 文字內容區域 */}
          <div className="flex-1 p-3 text-center flex flex-col justify-center">
            <h5
              className={`text-base leading-tight line-clamp-2 ${isActive
                ? 'text-black font-medium'
                : 'text-gray-600 group-hover:text-black'
                } transition-colors`}
              dangerouslySetInnerHTML={{ __html: project.title }}
            />
            {project.subtitle && (
              <p className={`text-sm mt-1 line-clamp-1 ${isActive
                ? 'text-gray-700'
                : 'text-gray-500 group-hover:text-gray-700'
                } transition-colors`}>
                {project.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 側邊欄主體 */}
      <div
        className={`fixed top-0 ${isOpen ? 'border-2 border-r-0 border-gray-100' : 'border-none'
          } bg-white rounded-md rounded-tl-none rounded-bl-none overflow-y-auto right-0 h-full shadow-2xl z-[99] transition-all duration-300 ${isOpen ? 'w-[320px]' : 'w-0'
          }`}
        onClick={(e) => {
          // 防止點擊 sidepanel 時觸發外部的關閉事件
          e.stopPropagation();
        }}
      >
        {/* 內容區域 */}
        <div className={`h-full overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="h-full overflow-y-auto p-4 pb-8]">
            <div className="space-y-4">
              {projects.map(project => renderProjectCard(project))}
            </div>
          </div>
        </div>
      </div>

      {/* 展開/收合按鈕 */}
      <div
        className={`fixed top-16 p-2 z-[100] transition-all duration-300 ${isOpen ? 'right-[320px]' : 'right-4'
          }`}
        onClick={(e) => {
          // 防止點擊按鈕時觸發外部的關閉事件
          e.stopPropagation();
        }}
      >
        <Button
          variant="close"
          shape="circle"
          size="sm"
          onClick={onToggle}
          aria-label={isOpen ? '收合側邊欄' : '展開側邊欄'}
          leftIcon={
            isOpen ? (
              <ChevronRightIcon size={20} />
            ) : (
              <ChevronLeftIcon size={20} />
            )
          }
        />
      </div>

      {/* 自訂樣式：限制文字行數 */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}