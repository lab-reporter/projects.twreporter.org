'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useStore } from '@/stores';
import { getContentComponentByProjectId } from './modal/contentMap';
import { getAdjacentProjects } from './modal/utils';
import projectsData from '@/app/data/projects.json';

export default function Modal() {
  const { modal, closeModal, openModal } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [modalDataSnapshot, setModalDataSnapshot] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [overScrollDistance, setOverScrollDistance] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const overScrollResetInterval = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef<number>(0);
  const resetStartDistance = useRef<number>(0);

  // 篩選所有報導項目用於 NavigationControls
  const allReports = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (Array.isArray(p.section) ? p.section.includes('reports') : p.section === 'reports')
    );
  }, []);

  // 計算相鄰項目 - 使用快照數據在動畫期間保持數據
  const adjacentProjects = useMemo(() => {
    const dataToUse = modalDataSnapshot || modal.data;
    if (!dataToUse || (!modal.isOpen && !shouldRender)) {
      return { prev: null, next: null };
    }
    return getAdjacentProjects(dataToUse, allReports as any);
  }, [modalDataSnapshot, modal.data, modal.isOpen, shouldRender, allReports]);

  // 處理導航
  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetProject = direction === 'prev' ? adjacentProjects.prev : adjacentProjects.next;
    if (targetProject) {
      openModal(targetProject.id, targetProject);
    }
  };

  // 當 Modal 內容改變時，重置滾動位置到頂部
  useEffect(() => {
    if (modal.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setScrollProgress(0);
      setOverScrollDistance(0);
      setIsAtBottom(false);

      // 清理計時器
      if (overScrollResetInterval.current) {
        clearInterval(overScrollResetInterval.current);
        overScrollResetInterval.current = null;
      }

      console.log('🔄 Modal 滾動位置已重置到頂部');
    }
  }, [modal.data?.id, modal.contentId, modal.isOpen]);

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

  // 處理滾動進度和過度滾動關閉機制
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !modal.isOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;

      // 計算滾動進度
      let progress = 0;
      if (maxScroll > 0) {
        progress = scrollTop / maxScroll;
      }
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      setScrollProgress(clampedProgress);

      // 檢測是否到達底部（容許1px誤差）
      const atBottom = scrollTop >= maxScroll - 1;
      setIsAtBottom(atBottom);

      // 如果不在底部，重置過度滾動距離
      if (!atBottom) {
        setOverScrollDistance(0);
        if (overScrollResetInterval.current) {
          clearInterval(overScrollResetInterval.current);
          overScrollResetInterval.current = null;
        }
      }
    };

    // 處理過度滾動（在底部時的滾輪事件）
    const handleWheel = (e: WheelEvent) => {
      if (!isAtBottom) return;

      // 只處理向下滾動
      if (e.deltaY > 0) {
        e.preventDefault(); // 阻止默認滾動行為

        // 更新最後滾動時間
        lastScrollTime.current = Date.now();

        const newDistance = overScrollDistance + Math.abs(e.deltaY);
        setOverScrollDistance(newDistance);

        // 檢查是否達到關閉閾值（100vh）
        const viewportHeight = window.innerHeight;
        if (newDistance >= viewportHeight) {
          console.log('🚀 過度滾動達到閾值，關閉 Modal');
          closeModal();
          return;
        }
      }
    };

    // 監聽滾動事件
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // 監聽滾輪事件（用於過度滾動檢測）
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    // 監聽容器大小變化，當內容載入完成後重新計算
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(handleScroll, 50);
    });

    resizeObserver.observe(scrollContainer);

    // 初始化進度
    setTimeout(handleScroll, 100);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();

      // 清理計時器
      if (overScrollResetInterval.current) {
        clearInterval(overScrollResetInterval.current);
        overScrollResetInterval.current = null;
      }
    };
  }, [modal.isOpen, modalDataSnapshot, isAtBottom, overScrollDistance, closeModal]);

  // 管理過度滾動重置計時器 - 在滾動停止500ms後開始重置
  useEffect(() => {
    if (overScrollDistance > 0 && isAtBottom) {
      // 啟動檢查計時器，每100ms檢查一次是否停止滾動
      const checkTimer = setInterval(() => {
        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollTime.current;

        // 如果停止滾動超過500ms，開始重置
        if (timeSinceLastScroll > 500) {
          // 清理檢查計時器
          clearInterval(checkTimer);

          // 啟動重置計時器 - 平滑減少
          if (!overScrollResetInterval.current) {
            // 使用 ref 記錄開始重置時的初始距離
            resetStartDistance.current = overScrollDistance;
            const resetStartTime = Date.now();
            const resetDuration = 200; // 2秒完全歸零

            overScrollResetInterval.current = setInterval(() => {
              const elapsed = Date.now() - resetStartTime;
              const progress = Math.min(elapsed / resetDuration, 1); // 0-1
              const newDistance = resetStartDistance.current * (1 - progress); // 線性減少

              if (progress >= 1 || newDistance < 1) {
                // 時間到或距離很小時直接重置並清理計時器
                setOverScrollDistance(0);
                resetStartDistance.current = 0;
                if (overScrollResetInterval.current) {
                  clearInterval(overScrollResetInterval.current);
                  overScrollResetInterval.current = null;
                }
              } else {
                setOverScrollDistance(newDistance);
              }
            }, 16); // 約60fps，更平滑
          }
        }
      }, 100);

      return () => {
        clearInterval(checkTimer);
      };
    } else {
      // 如果不在底部或沒有過度滾動，清理重置計時器
      if (overScrollResetInterval.current) {
        clearInterval(overScrollResetInterval.current);
        overScrollResetInterval.current = null;
      }
    }
  }, [overScrollDistance, isAtBottom]); // 保留 overScrollDistance 依賴但透過 ref 避免重複初始化

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

  // Modal 開啟/關閉動畫
  useEffect(() => {
    const modalBody = modalBodyRef.current;

    if (modal.isOpen) {
      // 保存當前 modal 數據快照
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
          projectData={dataToUse}
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
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] backdrop-blur-lg transition-opacity duration-300"
        onClick={closeModal}
      />

      {/* 側邊欄主體 - 帶有動畫效果 */}
      <div
        ref={modalBodyRef}
        className="fixed top-[4vh] left-[4vw] h-[92vh] w-[92vw] backdrop-blur-lg z-[9999]"
      >

        {/* 內容區域 */}
        <div
          className="relative h-full overflow-y-auto bg-gray-100 shadow-2xl rounded-md [&::-webkit-scrollbar]:hidden"
          style={{
            scrollBehavior: 'auto',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
          ref={scrollContainerRef}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 滾動進度條 */}
          <div className="sticky top-0 left-0 mb-[-4px] w-full h-1 bg-transparent z-20">
            <div
              className="h-full bg-red-70 transition-all duration-300 ease-out"
              style={{
                width: `${scrollProgress * 100}%`
              }}
            ></div>
          </div>

          {/* 內容 */}
          <div className="sidepanel-content">
            {renderContent()}
          </div>
        </div>

        {/* 關閉按鈕與過度滾動進度圓環 */}
        <div className="fixed top-[2vh] right-[2vw] z-[10000]">
          <div className="relative w-12 h-12">
            {/* 過度滾動進度圓環 - 顯示在按鈕後方 */}
            {isAtBottom && overScrollDistance > 0 && (() => {
              const radius = 20;
              const circumference = 2 * Math.PI * radius;
              const progress = Math.min(overScrollDistance / window.innerHeight, 1);
              const strokeDashoffset = circumference - (progress * circumference);

              return (
                <svg
                  className="absolute inset-0 w-12 h-12 -rotate-90"
                  viewBox="0 0 44 44"
                >
                  {/* 背景圓環 */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  {/* 進度圓環 */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="#C40D23"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-100 ease-out"
                  />
                </svg>
              );
            })()}

            {/* 關閉按鈕 */}
            <button
              onClick={closeModal}
              className="group absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.25)] shadow-md hover:bg-black transition-colors duration-300"
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