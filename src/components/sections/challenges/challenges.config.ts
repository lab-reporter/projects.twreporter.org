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