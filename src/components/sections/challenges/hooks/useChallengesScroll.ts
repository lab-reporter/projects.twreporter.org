import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { calculateScrollParams, SCROLL_CONFIG } from '../challenges.config';
import { ChallengeProject } from './useChallengesData';

interface UseChallengesScrollProps {
  challengeProjects: ChallengeProject[];
  onChallengeClick: (title: string) => void;
}

export const useChallengesScroll = ({ 
  challengeProjects, 
  onChallengeClick 
}: UseChallengesScrollProps) => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const { CONTAINER_WIDTH_VW, moveDistance, scrollHeight } = calculateScrollParams(challengeProjects.length);
    
    const titlesContainer = document.querySelector('[data-challenges-container]') as HTMLElement;
    
    if (!titlesContainer) return;
    
    // 設置容器寬度
    titlesContainer.style.width = `${CONTAINER_WIDTH_VW}vw`;

    // 等待卡片渲染完成
    setTimeout(() => {
      const cards = document.querySelectorAll('#challenges-section .card') as NodeListOf<HTMLElement>;
      
      console.log(`🎯 找到 ${cards.length} 張照片卡片`);
      
      // 設置卡片初始狀態
      cards.forEach((card) => {
        gsap.set(card, {
          z: -50000,
          scale: 0,
        });
      });

      // 為所有標題添加點擊事件
      const challengeTitles = document.querySelectorAll('#challenges-section .challengeTitle');
      challengeTitles.forEach((title) => {
        const clickHandler = () => onChallengeClick(title.textContent || '');
        title.addEventListener('click', clickHandler);
        
        // 儲存handler以便清理
        (title as any)._clickHandler = clickHandler;
      });

      // 創建 ScrollTrigger
      const scrollTrigger = ScrollTrigger.create({
        trigger: '#challenges-section',
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
          document.querySelectorAll('#challenges-section .challenge').forEach((titleContainer) => {
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
        if ((title as any)._clickHandler) {
          title.removeEventListener('click', (title as any)._clickHandler);
          delete (title as any)._clickHandler;
        }
      });
    };
  }, [challengeProjects, onChallengeClick]);

  return scrollTriggerRef;
};