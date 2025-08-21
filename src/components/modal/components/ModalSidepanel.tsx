'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../shared/NavigationIcons';
import { Button } from '@/components/shared';
import { getOptimizedSidepanelImage, isVideoFile, getPreloadUrls, logImageUsage } from '@/utils/imageAdapter';
import { getModalSidepanelImageConfig, detectDeviceInfo, detectNetworkCondition } from '@/utils/responsiveImageLoader';

interface Project {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  section: string[];
  bgColor?: string;
  imageSRC?: string; // 新增 imageSRC 屬性
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

  // 裝置和網路狀況檢測
  const [deviceInfo] = useState(() => detectDeviceInfo());
  const [networkCondition] = useState(() => detectNetworkCondition());

  // 智慧預載：使用優化後的圖片路徑
  const getOptimizedPreloadUrls = useCallback(() => {
    return getPreloadUrls(projects, 6);
  }, [projects]);

  // 預載圖片函數
  const preloadImage = useCallback((src: string) => {
    if (preloadedImagesRef.current.has(src) || isVideoFile(src)) return;

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
      // 使用智慧預載策略
      const preloadUrls = getOptimizedPreloadUrls();

      // 立即預載高優先級圖片
      const highPriorityUrls = preloadUrls.filter(item => item.priority === 'high');
      highPriorityUrls.forEach(item => {
        preloadImage(item.url);

        // 開發模式記錄
        if (process.env.NODE_ENV === 'development') {
          console.log(`[ModalSidepanel] 預載高優先級圖片:`, item.url);
        }
      });

      // 延遲預載中優先級圖片
      setTimeout(() => {
        const mediumPriorityUrls = preloadUrls.filter(item => item.priority === 'medium');
        mediumPriorityUrls.forEach(item => {
          preloadImage(item.url);
        });

        // 繼續預載剩餘項目
        projects.slice(6).forEach(project => {
          const optimizedImage = getOptimizedSidepanelImage(project);
          if (!isVideoFile(optimizedImage.src)) {
            preloadImage(optimizedImage.src);
          }
        });
      }, 300);
    }
  }, [isOpen, projects, preloadImage, getOptimizedPreloadUrls]);

  // Hover 時預載圖片（提前預載機制）
  const handleProjectHover = (project: Project) => {
    const optimizedImage = getOptimizedSidepanelImage(project);
    if (!isVideoFile(optimizedImage.src) && !preloadedImagesRef.current.has(optimizedImage.src)) {
      preloadImage(optimizedImage.src);

      // 開發模式記錄使用情況
      logImageUsage(project, optimizedImage.src, 'Hover預載');
    }
  };

  // 渲染媒體內容（圖片或影片）
  const renderMedia = (project: Project) => {
    // 使用新的響應式圖片載入系統
    const imageConfig = getModalSidepanelImageConfig(
      project,
      deviceInfo.isMobile,
      networkCondition
    );

    const mediaPath = imageConfig.src;
    const fallbackPath = imageConfig.fallbackSrc;

    // 智慧決定是否使用影片：只有無縮圖的影片才顯示原始影片
    const shouldShowVideo = isVideoFile(project.path) && !project.imageSRC;

    // 檢查圖片載入狀態
    const isImageLoaded = loadedImages.has(mediaPath);
    const isImageLoading = loadingImages.has(mediaPath);

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

              {/* 開發模式：顯示優化指示器 */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-1 right-1 space-y-1">
                  {imageConfig.optimizationLevel !== 'none' && (
                    <div className={`text-white text-xs px-1 rounded opacity-90 ${imageConfig.optimizationLevel === 'high' ? 'bg-green-500' :
                      imageConfig.optimizationLevel === 'medium' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}>
                      {imageConfig.optimizationLevel === 'high' ? '最佳化' :
                        imageConfig.optimizationLevel === 'medium' ? '優化' : '輕度優化'}
                    </div>
                  )}
                  <div className="bg-gray-700 text-white text-xs px-1 rounded opacity-75">
                    {imageConfig.estimatedSize}
                  </div>
                </div>
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
            quality={imageConfig.quality}
            priority={imageConfig.priority}
            loading={imageConfig.loading}
            sizes={imageConfig.sizes}
            onLoad={() => {
              setLoadedImages(prev => new Set(prev).add(mediaPath));
              setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(mediaPath);
                return newSet;
              });

              // 記錄載入成功
              logImageUsage(project, mediaPath, 'ModalSidepanel載入成功');
            }}
            onError={() => {
              // 載入失敗時處理
              if (mediaPath !== fallbackPath) {
                console.warn(`[ModalSidepanel] 優化圖片載入失敗，項目: ${project.id}`);
              }

              setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(mediaPath);
                return newSet;
              });
            }}
          />
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
        className={`fixed top-0 ${isOpen ? 'border-2 border-r-0 border-gray-100' : 'border-none'} bg-white rounded-md rounded-tl-none rounded-bl-none overflow-y-auto right-0 h-full shadow-2xl z-[99] transition-all duration-300 ${isOpen ? 'w-[320px]' : 'w-0'
          }`}
        onClick={(e) => {
          // 防止點擊 sidepanel 時觸發外部的關閉事件
          e.stopPropagation();
        }}
      >
        {/* 內容區域 */}
        <div className={`h-full overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="h-full overflow-y-auto p-4 pb-[calc(5vh+40px)]">
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