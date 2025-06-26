'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/stores';
import { X } from 'lucide-react';
import { getContentComponentByProjectId } from './modal/contentMap';
import { getAdjacentProjects } from './modal/utils';
import { NavigationControls } from './modal/shared';
import projectsData from '@/app/data/projects.json';

export default function Modal() {
  const { modal, closeModal, openModal } = useStore();
  
  // 篩選所有報導項目用於導航
  const allReports = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (Array.isArray(p.section) ? p.section.includes('reports') : p.section === 'reports')
    );
  }, []);
  
  // 計算相鄰項目
  const adjacentProjects = useMemo(() => {
    if (!modal.data || !modal.isOpen) {
      return { prev: null, next: null };
    }
    return getAdjacentProjects(modal.data, allReports as any);
  }, [modal.data, modal.isOpen, allReports]);
  
  // 處理導航
  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetProject = direction === 'prev' ? adjacentProjects.prev : adjacentProjects.next;
    if (targetProject) {
      openModal(targetProject.id, targetProject);
    }
  };

  // ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.isOpen, closeModal]);

  // 阻止背景滾動
  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.style.overflow = 'auto';
      document.body.removeAttribute('data-modal-open');
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.removeAttribute('data-modal-open');
    };
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  const renderContent = () => {
    if (!modal.data) return null;

    // 使用動態內容組件系統
    const ContentComponent = getContentComponentByProjectId(modal.data.id || modal.contentId || '');
    
    return (
      <div>
        <ContentComponent
          projectData={modal.data}
          onClose={closeModal}
          onNavigate={handleNavigate}
          adjacentProjects={adjacentProjects}
        />
      </div>
    );
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
        onClick={closeModal}
      />

      {/* 側邊欄主體 - 完全模仿 SidePanel 樣式 */}
      <div className={`fixed top-0 right-0 h-full w-full px-[5vw] py-[5vh] backdrop-blur-lg z-[9999] transform transition-transform duration-300 ease-in-out ${modal.isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* 內容區域 */}
        <div
          className="relative h-full overflow-y-auto bg-gray-100 shadow-2xl rounded-md"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* 內容 */}
          <div className="sidepanel-content">
            {renderContent()}
          </div>
        </div>

        {/* 關閉按鈕 - 固定在視窗位置，完全模仿 SidePanel */}
        <div className="fixed top-[7vh] right-[6vw] z-[10000]">
          <div className="relative w-12 h-12">
            <button
              onClick={closeModal}
              className="group absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.25)] backdrop-blur-xl shadow-md hover:bg-black transition-colors duration-300"
              aria-label="關閉側邊欄"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-current group-hover:stroke-white"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}