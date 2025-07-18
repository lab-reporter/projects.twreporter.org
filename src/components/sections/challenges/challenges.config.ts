// Challenges Section 配置文件

export interface PhotoPosition {
  top: string;
  left: string;
}

export interface PhotoConfig {
  count: number;
  filePrefix: string;
  startNumber: number;
  size: { width: number; height: number };
  randomizePositions: boolean;
  availableImageCount: number;
}

export interface PhotoAnimationConfig {
  startZ: number;
  endZ: number;
  startScale: number;
  endScale: number;
}

export interface PhotoItemConfig {
  id: string;
  imagePath: string;
  position: PhotoPosition;
  triggerRange: {
    startIndex: number;  // 從第幾個項目開始出現（0-9）
    endIndex: number;    // 到第幾個項目結束（0-9）
  };
  animationConfig: PhotoAnimationConfig;
}

// 照片配置
export const PHOTO_CONFIG: PhotoConfig = {
  count: 36, // 12個挑戰 × 3
  filePrefix: 'img',
  startNumber: 1,
  size: { width: 200, height: 200 },
  randomizePositions: false,
  availableImageCount: 30
};

// 滾動參數計算
export const calculateScrollParams = (projectCount: number) => {
  const contentSections = projectCount + 1; // +1 for intro section
  const extraSections = 1; // +1 for extra space
  const CONTAINER_WIDTH_VW = (contentSections + extraSections) * 100;
  const moveDistanceVW = CONTAINER_WIDTH_VW - 100;

  return {
    CONTAINER_WIDTH_VW,
    moveDistanceVW,
    get moveDistance() {
      return (window.innerWidth * moveDistanceVW) / 100;
    },
    get scrollHeight() {
      // 原始版本的邏輯：滾動高度等於容器寬度（保持1:1比例）
      return window.innerHeight * (CONTAINER_WIDTH_VW / 100);
    }
  };
};

// ScrollTrigger 配置
export const SCROLL_CONFIG = {
  startBuffer: 0.05,
  endBuffer: 0,  // 移除結尾緩衝區，讓動畫可以完整執行到最後
  scrub: 1
};

// 照片動畫預設配置
const DEFAULT_ANIMATION_CONFIG: PhotoAnimationConfig = {
  startZ: -10000,   // 從較遠的位置開始
  endZ: 10000,      // 到達前景位置
  startScale: 0.3, // 從較小比例開始
  endScale: 1.2    // 最終放大到 1.2 倍
};

// 建立挑戰照片配置（讓照片與對應的 challenge 同步）
export const CHALLENGE_PHOTOS: PhotoItemConfig[] = [
  // Challenge 1 照片 - 在 0.25-1.25 的範圍內出現（標題從右側進入到左側離開）
  {
    id: 'challenge-1-photo-1',
    imagePath: '/assets/challenges/challenge-1/challenge-1-1.jpg',
    position: { top: "55%", left: "55%" },
    triggerRange: { startIndex: 0.25, endIndex: 1.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-1-photo-2',
    imagePath: '/assets/challenges/challenge-1/challenge-1-2.jpg',
    position: { top: "40%", left: "45%" },
    triggerRange: { startIndex: 0.35, endIndex: 1.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 2 照片 - 在 1.25-2.25 的範圍內出現
  {
    id: 'challenge-2-photo-1',
    imagePath: '/assets/challenges/challenge-2/challenge-2-1.jpg',
    position: { top: "40%", left: "55%" },
    triggerRange: { startIndex: 1.25, endIndex: 2.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-2-photo-2',
    imagePath: '/assets/challenges/challenge-2/challenge-2-2.jpg',
    position: { top: "55%", left: "45%" },
    triggerRange: { startIndex: 1.35, endIndex: 2.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 3 照片 - 在 2.25-3.25 的範圍內出現
  {
    id: 'challenge-3-photo-1',
    imagePath: '/assets/challenges/challenge-3/challenge-3-1.jpg',
    position: { top: "55%", left: "55%" },
    triggerRange: { startIndex: 2.25, endIndex: 3.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-3-photo-2',
    imagePath: '/assets/challenges/challenge-3/challenge-3-2.jpg',
    position: { top: "40%", left: "45%" },
    triggerRange: { startIndex: 2.35, endIndex: 3.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 4 照片 - 在 3.25-4.25 的範圍內出現
  {
    id: 'challenge-4-photo-1',
    imagePath: '/assets/challenges/challenge-4/challenge-4-1.jpg',
    position: { top: "40%", left: "55%" },
    triggerRange: { startIndex: 3.25, endIndex: 4.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-4-photo-2',
    imagePath: '/assets/challenges/challenge-4/challenge-4-2.jpg',
    position: { top: "55%", left: "45%" },
    triggerRange: { startIndex: 3.35, endIndex: 4.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 5 缺少照片，但仍保持連續性
  // Challenge 6 照片 - 在 5.25-6.25 的範圍內出現
  {
    id: 'challenge-6-photo-1',
    imagePath: '/assets/challenges/challenge-6/challenge-6-1.jpg',
    position: { top: "40%", left: "55%" },
    triggerRange: { startIndex: 5.25, endIndex: 6.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-6-photo-2',
    imagePath: '/assets/challenges/challenge-6/challenge-6-2.jpg',
    position: { top: "55%", left: "45%" },
    triggerRange: { startIndex: 5.35, endIndex: 6.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 7 照片 - 在 6.25-7.25 的範圍內出現
  {
    id: 'challenge-7-photo-1',
    imagePath: '/assets/challenges/challenge-7/challenge-7-1.jpg',
    position: { top: "40%", left: "45%" },
    triggerRange: { startIndex: 6.25, endIndex: 7.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-7-photo-2',
    imagePath: '/assets/challenges/challenge-7/challenge-7-2.jpg',
    position: { top: "55%", left: "55%" },
    triggerRange: { startIndex: 6.35, endIndex: 7.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 8 照片 - 在 7.25-8.25 的範圍內出現
  {
    id: 'challenge-8-photo-1',
    imagePath: '/assets/challenges/challenge-8/challenge-8-1.jpg',
    position: { top: "55%", left: "45%" },
    triggerRange: { startIndex: 7.25, endIndex: 8.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-8-photo-2',
    imagePath: '/assets/challenges/challenge-8/challenge-8-2.jpg',
    position: { top: "40%", left: "55%" },
    triggerRange: { startIndex: 7.35, endIndex: 8.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 9 照片 - 在 8.25-9.25 的範圍內出現
  {
    id: 'challenge-9-photo-1',
    imagePath: '/assets/challenges/challenge-9/challenge-9-1.jpg',
    position: { top: "55%", left: "55%" },
    triggerRange: { startIndex: 8.25, endIndex: 9.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-9-photo-2',
    imagePath: '/assets/challenges/challenge-9/challenge-9-2.jpg',
    position: { top: "40%", left: "45%" },
    triggerRange: { startIndex: 8.35, endIndex: 9.35 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 10 照片 - 在 9.25-10.25 的範圍內出現
  {
    id: 'challenge-10-photo-1',
    imagePath: '/assets/challenges/challenge-10/challenge-10-1.jpg',
    position: { top: "40%", left: "55%" },
    triggerRange: { startIndex: 9.25, endIndex: 10.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-10-photo-2',
    imagePath: '/assets/challenges/challenge-10/challenge-10-2.jpg',
    position: { top: "55%", left: "45%" },
    triggerRange: { startIndex: 9.25, endIndex: 10.25 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  }
];

// 效能優化：預計算每個項目的照片索引
export const PHOTOS_BY_PROJECT_INDEX = CHALLENGE_PHOTOS.reduce((acc, photo, index) => {
  const projectIndex = photo.triggerRange.startIndex;
  if (!acc[projectIndex]) {
    acc[projectIndex] = [];
  }
  acc[projectIndex].push(index);
  return acc;
}, {} as Record<number, number[]>);