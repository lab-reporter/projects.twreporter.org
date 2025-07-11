'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import ChallengePhoto from './ChallengePhoto';
import { CHALLENGE_PHOTOS } from './challenges.config';

interface ChallengesBackgroundProps {
  className?: string;
  currentProjectIndex?: number;
  scrollProgress?: number;
}

const ChallengesBackground = forwardRef<HTMLDivElement, ChallengesBackgroundProps>(
  ({ className = '', currentProjectIndex = 0, scrollProgress = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 useImperativeHandle 來暴露內部 ref
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

    return (
      <div
        ref={containerRef}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] -z-10 ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '2000px'
        }}
      >
        {CHALLENGE_PHOTOS.map((photo, index) => {
          // 使用連續的 scrollProgress 來計算每張照片的進度
          const startProgress = photo.triggerRange.startIndex;
          const endProgress = photo.triggerRange.endIndex;
          
          // 計算照片在其觸發範圍內的進度
          let progress = 0;
          let hasPassedRange = false;
          
          if (scrollProgress >= startProgress && scrollProgress <= endProgress) {
            // 在範圍內：計算 0-1 的進度
            progress = (scrollProgress - startProgress) / (endProgress - startProgress);
          } else if (scrollProgress > endProgress) {
            // 已經通過：設定特殊值表示已通過
            progress = 1;
            hasPassedRange = true;
          }
          
          const isActive = progress > 0 && !hasPassedRange;

          return (
            <ChallengePhoto
              key={photo.id}
              photoConfig={photo}
              index={index}
              isActive={isActive}
              animationProgress={progress}
              hasPassedRange={hasPassedRange}
              scrollProgress={scrollProgress}
            />
          );
        })}

        {/* 開發環境載入指示器 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-black text-white px-3 py-2 rounded text-sm z-50">
            當前項目: {currentProjectIndex + 1}/10
          </div>
        )}
      </div>
    );
  }
);

ChallengesBackground.displayName = 'ChallengesBackground';

export default ChallengesBackground;