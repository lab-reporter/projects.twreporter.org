'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import ChallengePhoto from './ChallengePhoto';
import { PHOTO_CONFIG, CARD_POSITIONS, PhotoPosition } from './challenges.config';
import { useProgressiveLoading } from './hooks/useProgressiveLoading';

interface ChallengesBackgroundProps {
  className?: string;
}

const ChallengesBackground = forwardRef<HTMLDivElement, ChallengesBackgroundProps>(
  ({ className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 useImperativeHandle 來暴露內部 ref
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

    // 生成照片數據
    const photos = Array.from({ length: PHOTO_CONFIG.count }, (_, i) => {
      // 循環使用位置配置
      const positionIndex = i % CARD_POSITIONS.length;
      const position = CARD_POSITIONS[positionIndex];

      // 循環使用照片檔案
      const imageNumber = PHOTO_CONFIG.startNumber + (i % PHOTO_CONFIG.availableImageCount);

      return {
        index: i,
        position,
        imageNumber,
        key: `challenge-photo-${i}`
      };
    });

    // 使用漸進式載入 hook
    const { shouldLoadPhoto, loadedPhotosCount, totalPhotos } = useProgressiveLoading({
      photoCount: PHOTO_CONFIG.count,
      positions: CARD_POSITIONS,
      containerRef
    });

    return (
      <div
        ref={containerRef}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] -z-10 ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '2000px'
        }}
      >
        {photos.map((photo) => (
          <ChallengePhoto
            key={photo.key}
            index={photo.index}
            position={photo.position}
            size={PHOTO_CONFIG.size}
            imageNumber={photo.imageNumber}
            filePrefix={PHOTO_CONFIG.filePrefix}
            shouldLoad={shouldLoadPhoto(photo.index)}
          />
        ))}

        {/* 開發環境載入指示器 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-black text-white px-3 py-2 rounded text-sm z-50">
            載入: {loadedPhotosCount}/{totalPhotos}
          </div>
        )}
      </div>
    );
  }
);

ChallengesBackground.displayName = 'ChallengesBackground';

export default ChallengesBackground;