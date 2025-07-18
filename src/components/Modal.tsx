'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useStore } from '@/stores';
import { getContentComponentByProjectId } from './modal/contentMap';
import { useModalNavigation, useKeyboard } from './modal/hooks';
import ModalScrollManager from './modal/components/ModalScrollManager';

export default function Modal() {
  const { modal, closeModal } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [modalDataSnapshot, setModalDataSnapshot] = useState<unknown>(null);

  // 使用導航和鍵盤 hooks
  const { adjacentProjects, handleNavigate } = useModalNavigation();
  useKeyboard();

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

  // Modal 開啟/關閉動畫 和 數據變更處理
  useEffect(() => {
    const modalBody = modalBodyRef.current;
    let openTween: gsap.core.Tween | null = null;
    let closeTween: gsap.core.Tween | null = null;
    let rafId: number | null = null;

    if (modal.isOpen) {
      // 更新數據快照（包含導航時的數據變更）
      setModalDataSnapshot(modal.data);

      // 立即顯示組件
      setShouldRender(true);

      // 等待下一幀再開始動畫，確保 DOM 已渲染
      rafId = requestAnimationFrame(() => {
        if (!modalBody) return;

        // 設定初始狀態（隱藏）
        gsap.set(modalBody, {
          opacity: 0.5,
          scale: 0.25,
          rotateY: 90,
          transformOrigin: 'center center',
          transformPerspective: 500  // 加入透視深度
        });

        // 開啟動畫：從隱藏狀態到完全顯示
        openTween = gsap.to(modalBody, {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          transformPerspective: 500,  // 保持透視深度
          duration: 0.6,
          ease: 'back.in(1.7)'
        });
      });
    } else if (shouldRender) {
      // 關閉動畫：回到隱藏狀態
      if (modalBody) {
        closeTween = gsap.to(modalBody, {
          opacity: 0.5,
          scale: 0.25,
          rotateY: 90,
          transformPerspective: 500,  // 保持透視深度
          duration: 0.3,
          ease: 'back.in(1.7)',
          onComplete: () => {
            // 動畫完成後隱藏組件並清除快照
            setShouldRender(false);
            setModalDataSnapshot(null);
          }
        });
      }
    }

    // 清理函數：確保動畫和 RAF 被正確清除
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      openTween?.kill();
      closeTween?.kill();
    };
  }, [modal.isOpen, modal.data, shouldRender]);

  if (!shouldRender) return null;

  const renderContent = () => {
    // 使用快照數據，在動畫期間保持內容顯示
    const dataToUse = modalDataSnapshot || modal.data;
    if (!dataToUse) return null;

    // 類型檢查：確保 dataToUse 符合 ReportData 介面
    const projectData = dataToUse as {
      id?: string;
      path?: string;
      title?: string;
      subtitle?: string;
      section?: string[];
      bgColor?: string;
    };

    // 提供默認值以符合 ReportData 介面
    const safeProjectData = {
      id: projectData.id || modal.contentId || '',
      path: projectData.path || '',
      title: projectData.title || '',
      subtitle: projectData.subtitle || '',
      section: projectData.section || [],
      bgColor: projectData.bgColor
    };

    // 使用動態內容組件系統
    const ContentComponent = getContentComponentByProjectId(safeProjectData.id);

    return (
      <div>
        <ContentComponent
          projectData={safeProjectData} onClose={closeModal} onNavigate={handleNavigate}
          adjacentProjects={adjacentProjects} scrollContainer={scrollContainerRef.current}
        />
      </div>
    );
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed z-[9998] top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)] backdrop-blur-lg transition-opacity duration-800" onClick={closeModal} />

      {/* 側邊欄主體 - 帶有動畫效果 */}
      <div ref={modalBodyRef} className="fixed top-[4vh] left-[4vw] h-[92vh] w-[92vw] z-[9999] rounded-xl shadow-lg overflow-hidden">
        {/* 滾動管理組件 - 包含滾動容器、進度條、過度滾動和關閉按鈕 */}
        <ModalScrollManager
          scrollContainer={scrollContainerRef}
          isModalOpen={modal.isOpen}
          modalDataId={(modal.data as { id?: string })?.id}
          modalContentId={modal.contentId || undefined}
          onClose={closeModal}
        >
          <div className="sidepanel-content bg-gray-100">{renderContent()}</div>
        </ModalScrollManager>
      </div>
    </>
  );
}