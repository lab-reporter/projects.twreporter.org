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
  const [modalDataSnapshot, setModalDataSnapshot] = useState<any>(null);

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

    if (modal.isOpen) {
      // 更新數據快照（包含導航時的數據變更）
      setModalDataSnapshot(modal.data);

      // 立即顯示組件
      setShouldRender(true);

      // 等待下一幀再開始動畫，確保 DOM 已渲染
      requestAnimationFrame(() => {
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
        gsap.to(modalBody, {
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
        gsap.to(modalBody, {
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
  }, [modal.isOpen, shouldRender]);

  if (!shouldRender) return null;

  const renderContent = () => {
    // 使用快照數據，在動畫期間保持內容顯示
    const dataToUse = modalDataSnapshot || modal.data;
    if (!dataToUse) return null;

    // 使用動態內容組件系統
    const ContentComponent = getContentComponentByProjectId(dataToUse.id || modal.contentId || '');

    return (
      <div>
        <ContentComponent
          projectData={dataToUse} onClose={closeModal} onNavigate={handleNavigate}
          adjacentProjects={adjacentProjects} scrollContainer={scrollContainerRef.current}
        />
      </div>
    );
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed z-[9998] transition-opacity duration-800" onClick={closeModal} />

      {/* 側邊欄主體 - 帶有動畫效果 */}
      <div ref={modalBodyRef} className="fixed top-[4vh] left-[4vw] h-[92vh] w-[92vw] z-[9999] rounded-xl shadow-lg overflow-hidden">
        {/* 滾動管理組件 - 包含滾動容器、進度條、過度滾動和關閉按鈕 */}
        <ModalScrollManager
          scrollContainer={scrollContainerRef}
          isModalOpen={modal.isOpen}
          modalDataId={modal.data?.id}
          modalContentId={modal.contentId || undefined}
          onClose={closeModal}
        >
          <div className="sidepanel-content bg-white">{renderContent()}</div>
        </ModalScrollManager>
      </div>
    </>
  );
}