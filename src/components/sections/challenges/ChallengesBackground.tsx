'use client';

import { forwardRef } from 'react';
import ChallengePhoto from './ChallengePhoto';
import { PHOTO_CONFIG, CARD_POSITIONS, PhotoPosition } from './challenges.config';

interface ChallengesBackgroundProps {
  className?: string;
}

const ChallengesBackground = forwardRef<HTMLDivElement, ChallengesBackgroundProps>(
  ({ className = '' }, ref) => {
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

    return (
      <div
        ref={ref}
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
          />
        ))}
      </div>
    );
  }
);

ChallengesBackground.displayName = 'ChallengesBackground';

export default ChallengesBackground;