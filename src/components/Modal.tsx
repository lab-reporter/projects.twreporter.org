'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/stores';
import { X } from 'lucide-react';
import { getContentComponentByProjectId } from './modal/contentMap';
import { getAdjacentProjects } from './modal/utils';
import { NavigationControls } from './modal/shared';
import projectsData from '@/app/data/projects.json';
import { ReportData } from './modal/types';

export default function Modal() {
  const { modal, closeModal, openModal } = useStore();
  
  // 篩選所有報導項目用於導航
  const allReports = useMemo(() => {
    return projectsData.filter((p: ReportData) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);
  
  // 計算相鄰項目
  const adjacentProjects = useMemo(() => {
    if (!modal.data || !modal.isOpen) {
      return { prev: null, next: null };
    }
    return getAdjacentProjects(modal.data, allReports);
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
    const handleKeyDown = (e) => {
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
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
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
        />
        
        {/* 導航組件 */}
        <NavigationControls
          onNavigate={handleNavigate}
          onHome={closeModal}
          adjacentProjects={adjacentProjects}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal 內容 */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[85vh] w-full mx-4 overflow-hidden">
        {/* 關閉按鈕 */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* 內容區域 */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}