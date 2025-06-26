// 場景相機位置配置類型
export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// 相機插值係數配置
export interface InterpolationConfig {
  position: number;
  rotation: number;
  innovationFocus: number;
  innovationRotation: number;
  reportsX: number;
  reportsZ: number;
  reportsY: number;
  otherSections: number;
}

// 場景基礎配置
export interface SceneConfig {
  camera: {
    near: number;
    far: number;
    defaultFov: number;
    defaultPosition: [number, number, number];
  };
  reports: {
    radius: number;
    rotationBuffer: number;
    mouseInfluenceY: number;
    tiltInfluenceX: number;
  };
  innovation: {
    focusDistance: number;
  };
  otherSections: {
    mouseInfluenceX: number;
    mouseInfluenceY: number;
  };
  debug: {
    updateInterval: number;
    axesSize: number;
    gridSize: number;
    gridDivisions: number;
  };
}

// 每個 Section 的相機位置配置 - Z 軸遞減實現向前推進
export const CAMERA_POSITIONS: Record<string, CameraConfig> = {
  reports: { position: [0, 0, 1050], target: [0, 0, 1000], fov: 80 }, // 從遠處開始，寬視角
  innovation: { position: [0, 0, 880], target: [0, 0, 500], fov: 45 }, // 確保大於聚焦時的相機位置
  timeline: { position: [0, 5, 600], target: [0, 0, 650], fov: 75 }, // 繼續向前
  feedback: { position: [0, 0, 400], target: [0, 0, 450], fov: 45 }, // 持續向前
  support: { position: [0, 0, 200], target: [0, 0, 250], fov: 45 } // 最近位置
};

// 相機動畫插值係數配置
export const INTERPOLATION_CONFIG: InterpolationConfig = {
  position: 0.05, // 一般位置移動速度
  rotation: 0.005, // 旋轉插值速度（避免劇烈旋轉）
  innovationFocus: 0.05, // Innovation 聚焦時的位置插值
  innovationRotation: 0.005, // Innovation 聚焦時的旋轉插值
  reportsX: 0.1, // Reports X 軸插值速度
  reportsZ: 0.09, // Reports Z 軸插值速度（創造視覺落差）
  reportsY: 0.1, // Reports Y 軸插值速度
  otherSections: 0.02 // 其他 Section 的插值速度
};

// 場景基礎配置
export const SCENE_CONFIG: SceneConfig = {
  camera: {
    near: 0.1,
    far: 10000,
    defaultFov: 45,
    defaultPosition: [0, 0, 10]
  },
  reports: {
    radius: 8, // 相機距離圓柱中心的半徑
    rotationBuffer: 0.05, // 5% 的緩衝區，控制最後項目的停留時間
    mouseInfluenceY: 2, // 滑鼠 Y 軸對相機高度的影響係數
    tiltInfluenceX: 0.1 // 滑鼠 X 軸對相機傾斜的影響係數
  },
  innovation: {
    focusDistance: 20 // 聚焦時相機在物件後方的距離
  },
  otherSections: {
    mouseInfluenceX: 0.5, // 滑鼠 X 軸視差影響係數
    mouseInfluenceY: 0.5 // 滑鼠 Y 軸視差影響係數
  },
  debug: {
    updateInterval: 1, // 偵錯資訊更新間隔（秒）
    axesSize: 10, // 座標軸輔助線大小
    gridSize: 3000, // 網格大小
    gridDivisions: 300 // 網格分割數
  }
};

// 光照配置
export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.3,
    color: '#ffffff'
  },
  directional: {
    position: [10, 10, 10] as [number, number, number],
    intensity: 1,
    color: '#ffffff',
    castShadow: true
  }
};

// Orbit 控制配置
export const ORBIT_CONFIG = {
  zoomSpeed: 0.5,
  panSpeed: 0.5,
  rotateSpeed: 0.5,
  minDistance: 5,
  maxDistance: 500,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI
}; 