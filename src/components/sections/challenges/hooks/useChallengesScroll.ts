import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { calculateScrollParams, SCROLL_CONFIG } from '../challenges.config';
import { ChallengeProject } from './useChallengesData';

interface UseChallengesScrollProps {
  challengeProjects: ChallengeProject[];
  onChallengeClick: (title: string) => void;
  onProjectIndexChange?: (index: number, progress: number) => void;
}

export const useChallengesScroll = ({
  challengeProjects,
  onChallengeClick,
  onProjectIndexChange
}: UseChallengesScrollProps) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const currentProjectIndexRef = useRef<number>(-1);
  const currentProgressRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const { CONTAINER_WIDTH_VW, moveDistance } = calculateScrollParams(challengeProjects.length);

    const titlesContainer = document.querySelector('[data-challenges-container]') as HTMLElement;

    if (!titlesContainer) return;

    // 設置容器寬度
    titlesContainer.style.width = `${CONTAINER_WIDTH_VW}vw`;

    // 等待卡片渲染完成
    setTimeout(() => {
      const cards = document.querySelectorAll('#section-challenges .card') as NodeListOf<HTMLElement>;

      // 設置卡片初始狀態
      cards.forEach((card) => {
        gsap.set(card, {
          z: -50000,
          scale: 0,
        });
      });

      // 為所有標題添加點擊事件
      const challengeTitles = document.querySelectorAll('#section-challenges .challengeTitle');
      challengeTitles.forEach((title) => {
        const clickHandler = () => onChallengeClick(title.textContent || '');
        title.addEventListener('click', clickHandler);

        // 儲存handler以便清理
        (title as HTMLElement & { _clickHandler?: () => void })._clickHandler = clickHandler;
      });

      // 創建 ScrollTrigger
      const scrollTrigger = ScrollTrigger.create({
        trigger: '#section-challenges',
        start: 'top top',
        end: 'bottom bottom',
        scrub: SCROLL_CONFIG.scrub,
        markers: false,
        id: 'challenges-horizontal-scroll',
        onUpdate: (self) => {
          const { startBuffer, endBuffer } = SCROLL_CONFIG;
          const activeRange = 1 - startBuffer - endBuffer;

          let adjustedProgress = 0;
          if (self.progress >= startBuffer && self.progress <= (1 - endBuffer)) {
            adjustedProgress = (self.progress - startBuffer) / activeRange;
          } else if (self.progress > (1 - endBuffer)) {
            adjustedProgress = 1;
          }

          // 計算當前項目索引和連續進度
          const totalProjects = challengeProjects.length;
          const rawProgress = adjustedProgress * totalProjects;
          const currentProjectIndex = Math.min(Math.floor(rawProgress), totalProjects - 1);
          
          // 更新進度值
          currentProgressRef.current = rawProgress;
          
          // 觸發回調（每次都更新以傳遞連續進度）
          if (onProjectIndexChange) {
            onProjectIndexChange(currentProjectIndex, rawProgress);
          }
          
          // 更新索引參考
          currentProjectIndexRef.current = currentProjectIndex;

          // 水平移動容器
          const xPosition = -moveDistance * adjustedProgress;
          gsap.set(titlesContainer, {
            x: xPosition,
          });

          // 計算速度效果
          const velocity = self.getVelocity();
          const normalizedVelocity = velocity / Math.abs(velocity) || 0;
          const maxOffset = 30;
          const currentSpeed = Math.min(Math.abs(velocity / 500), maxOffset);
          const isAtEdge = self.progress <= 0 || self.progress >= 1;

          // 標題動畫效果
          document.querySelectorAll('#section-challenges .challenge').forEach((titleContainer) => {
            const challengeTitle = titleContainer.querySelector('.challengeTitle') as HTMLElement;

            if (!challengeTitle) return;

            if (isAtEdge) {
              gsap.to(challengeTitle, {
                xPercent: -50,
                x: 0,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true,
              });
            } else {
              const baseOffset = normalizedVelocity * currentSpeed;
              gsap.to(challengeTitle, {
                xPercent: -50,
                x: `${baseOffset * 4}px`,
                duration: 0.2,
                ease: 'power1.out',
                overwrite: 'auto',
              });
            }
          });

          // 更新卡片位置（使用調整後的進度）
          cards.forEach((card, index) => {
            const staggerOffset = index * 0.075;
            const scaledProgress = (adjustedProgress - staggerOffset) * 3;
            const individualProgress = Math.max(0, Math.min(1, scaledProgress));
            const targetZ = index === cards.length - 1 ? 1500 : 2000;
            const newZ = -50000 + (targetZ + 50000) * individualProgress;
            const scaleProgress = Math.min(1, individualProgress * 10);
            const scale = Math.max(0, Math.min(1, scaleProgress));

            gsap.set(card, {
              z: newZ,
              scale: scale,
            });
          });
        },
      });

      scrollTriggerRef.current = scrollTrigger;
    }, 100);

    // 清理函數
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // 清理點擊事件
      const challengeTitles = document.querySelectorAll('#challenges-section .challengeTitle');
      challengeTitles.forEach((title) => {
        const titleElement = title as HTMLElement & { _clickHandler?: () => void };
        if (titleElement._clickHandler) {
          title.removeEventListener('click', titleElement._clickHandler);
          delete titleElement._clickHandler;
        }
      });
    };
  }, [challengeProjects, onChallengeClick, onProjectIndexChange]);

  return {
    scrollTriggerRef,
    getCurrentProjectIndex: useCallback(() => currentProjectIndexRef.current, [])
  };
};