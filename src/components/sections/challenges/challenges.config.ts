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

// 照片位置配置
export const CARD_POSITIONS: PhotoPosition[] = [
  { top: "50%", left: "55%" },
  { top: "20%", left: "25%" },
  { top: "50%", left: "10%" },
  { top: "60%", left: "40%" },
  { top: "30%", left: "30%" },
  { top: "60%", left: "60%" },
  { top: "20%", left: "50%" },
  { top: "60%", left: "10%" },
  { top: "20%", left: "40%" },
  { top: "45%", left: "55%" },
  { top: "35%", left: "70%" },
  { top: "75%", left: "35%" },
  { top: "15%", left: "65%" },
  { top: "55%", left: "20%" },
  { top: "40%", left: "80%" }
];

// 滾動參數計算
export const calculateScrollParams = (projectCount: number) => {
  const contentSections = projectCount + 1; // +1 for intro section
  const CONTAINER_WIDTH_VW = contentSections * 100;
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
  endBuffer: 0.05,
  scrub: 1
};

// 生成隨機位置（效能優化：預先計算）
const generateRandomPosition = (index: number): PhotoPosition => {
  const positions = CARD_POSITIONS;
  return positions[index % positions.length];
};

// 照片動畫預設配置
const DEFAULT_ANIMATION_CONFIG: PhotoAnimationConfig = {
  startZ: -5000,  // 調整為更合理的值
  endZ: 1000,
  startScale: 0.1,  // 從 0.1 開始避免完全不可見
  endScale: 1
};

// 建立挑戰照片配置（讓照片平均分散在整個滾動範圍）
export const CHALLENGE_PHOTOS: PhotoItemConfig[] = [
  // Challenge 1 照片 - 在 0-1 的範圍內出現
  {
    id: 'challenge-1-photo-1',
    imagePath: '/assets/challenges/challenge-1/challenge-1-1.jpg',
    position: generateRandomPosition(0),
    triggerRange: { startIndex: 0, endIndex: 1 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-1-photo-2',
    imagePath: '/assets/challenges/challenge-1/challenge-1-2.jpg',
    position: generateRandomPosition(1),
    triggerRange: { startIndex: 0, endIndex: 1 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 2 照片 - 在 1-2 的範圍內出現
  {
    id: 'challenge-2-photo-1',
    imagePath: '/assets/challenges/challenge-2/challenge-2-1.jpg',
    position: generateRandomPosition(2),
    triggerRange: { startIndex: 1, endIndex: 2 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-2-photo-2',
    imagePath: '/assets/challenges/challenge-2/challenge-2-2.jpg',
    position: generateRandomPosition(3),
    triggerRange: { startIndex: 1, endIndex: 2 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 3 照片 - 在 2-3 的範圍內出現
  {
    id: 'challenge-3-photo-1',
    imagePath: '/assets/challenges/challenge-3/challenge-3-1.jpg',
    position: generateRandomPosition(4),
    triggerRange: { startIndex: 2, endIndex: 3 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-3-photo-2',
    imagePath: '/assets/challenges/challenge-3/challenge-3-2.jpg',
    position: generateRandomPosition(5),
    triggerRange: { startIndex: 2, endIndex: 3 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 4 照片 - 在 3-4 的範圍內出現
  {
    id: 'challenge-4-photo-1',
    imagePath: '/assets/challenges/challenge-4/challenge-4-1.jpg',
    position: generateRandomPosition(6),
    triggerRange: { startIndex: 3, endIndex: 4 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-4-photo-2',
    imagePath: '/assets/challenges/challenge-4/challenge-4-2.jpg',
    position: generateRandomPosition(7),
    triggerRange: { startIndex: 3, endIndex: 4 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 5 缺少照片，但仍保持連續性
  // Challenge 6 照片 - 在 5-6 的範圍內出現
  {
    id: 'challenge-6-photo-1',
    imagePath: '/assets/challenges/challenge-6/challenge-6-1.jpg',
    position: generateRandomPosition(8),
    triggerRange: { startIndex: 5, endIndex: 6 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-6-photo-2',
    imagePath: '/assets/challenges/challenge-6/challenge-6-2.jpg',
    position: generateRandomPosition(9),
    triggerRange: { startIndex: 5, endIndex: 6 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 7 照片 - 在 6-7 的範圍內出現
  {
    id: 'challenge-7-photo-1',
    imagePath: '/assets/challenges/challenge-7/challenge-7-1.jpg',
    position: generateRandomPosition(10),
    triggerRange: { startIndex: 6, endIndex: 7 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-7-photo-2',
    imagePath: '/assets/challenges/challenge-7/challenge-7-2.jpg',
    position: generateRandomPosition(11),
    triggerRange: { startIndex: 6, endIndex: 7 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 8 照片 - 在 7-8 的範圍內出現
  {
    id: 'challenge-8-photo-1',
    imagePath: '/assets/challenges/challenge-8/challenge-8-1.jpg',
    position: generateRandomPosition(12),
    triggerRange: { startIndex: 7, endIndex: 8 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-8-photo-2',
    imagePath: '/assets/challenges/challenge-8/challenge-8-2.jpg',
    position: generateRandomPosition(13),
    triggerRange: { startIndex: 7, endIndex: 8 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 9 照片 - 在 8-9 的範圍內出現
  {
    id: 'challenge-9-photo-1',
    imagePath: '/assets/challenges/challenge-9/challenge-9-1.jpg',
    position: generateRandomPosition(14),
    triggerRange: { startIndex: 8, endIndex: 9 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-9-photo-2',
    imagePath: '/assets/challenges/challenge-9/challenge-9-2.jpg',
    position: generateRandomPosition(15),
    triggerRange: { startIndex: 8, endIndex: 9 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  // Challenge 10 照片 - 在 9 的範圍內出現
  {
    id: 'challenge-10-photo-1',
    imagePath: '/assets/challenges/challenge-10/challenge-10-1.jpg',
    position: generateRandomPosition(16),
    triggerRange: { startIndex: 9, endIndex: 9 },
    animationConfig: DEFAULT_ANIMATION_CONFIG
  },
  {
    id: 'challenge-10-photo-2',
    imagePath: '/assets/challenges/challenge-10/challenge-10-2.jpg',
    position: generateRandomPosition(17),
    triggerRange: { startIndex: 9, endIndex: 9 },
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