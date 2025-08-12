'use client';

import Image from 'next/image';

interface Project {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  section: string[];
  bgColor?: string;
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
          className="w-full h-full object-contain"
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
          width={320}
          height={240}
          className="w-full h-full object-cover"
          quality={85}
        />
      );
    }
  };

  // 渲染單個項目卡片
  const renderProjectCard = (project: Project) => {
    const isActive = project.id === currentProjectId;

    return (
      <div
        key={project.id}
        className={`rounded-md border overflow-hidden bg-[rgba(255,255,255,0.9)] backdrop-blur-lg transition-all duration-300 shadow-lg group ${isActive
          ? 'border-black'
          : 'border-white hover:border-black'
          }`}
        style={{ cursor: 'zoom-in' }}
        onClick={() => onSelectProject(project.id)}
      >
        <div className="flex flex-col h-auto">
          {/* 圖片影片區域 */}
          <div className="w-full aspect-[2/1] overflow-hidden">
            <div className={`w-full h-full ${isActive
              ? 'opacity-100'
              : 'opacity-80 filter grayscale group-hover:filter-none'
              } transition-all duration-300`}>
              {renderMedia(project.path, project.title)}
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
        className={`fixed top-16 z-[100] transition-all duration-300 ${isOpen ? 'right-[320px]' : 'right-4'
          }`}
        onClick={(e) => {
          // 防止點擊按鈕時觸發外部的關閉事件
          e.stopPropagation();
        }}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <div
            onClick={onToggle}
            className="w-9 h-9 rounded-full bg-white border border-gray-300 shadow-md hover:bg-black transition-colors duration-300 flex items-center justify-center cursor-pointer group"
          >
            <Image
              src="/assets/modal-sidepanel-arrow.svg"
              alt="modal-sidepanel-arrow"
              width={20}
              height={20}
              className={`${isOpen ? 'rotate-0' : 'rotate-180'
                } ${isOpen ? 'translate-x-[1px]' : '-translate-x-[1px]'
                } group-hover:invert duration-300 transition-all`}
            />
          </div>
        </div>
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