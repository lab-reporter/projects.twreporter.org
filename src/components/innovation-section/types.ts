/**
 * InnovationSection 相關類型定義
 * 
 * 包含 3D 模型資料、組件 Props 等類型定義
 */

import * as THREE from 'three';

// 3D 模型資料結構
export interface ModelData {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  section: string[];
  position: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  is3DModel: boolean;
}

// 單個創新模型組件的 Props
export interface InnovationModelProps {
  modelData: ModelData;
  focused: boolean;
  onClick: (item: ModelData) => void;
  onHover: () => void;
  onUnhover: () => void;
}

// InnovationSection 主組件的 Props
export interface InnovationSectionProps {
  visible: boolean;
  progress: number;
  onFocusedItemChange?: (item: ModelData | null) => void;
  onCurrentProjectChange?: (project: any) => void;
}

// 模型載入狀態
export interface ModelLoadState {
  isLoading: boolean;
  error: Error | null;
  model: THREE.Group | null;
  mixer: THREE.AnimationMixer | null;
}

// 聚焦控制器配置
export interface FocusConfig {
  bufferStart: number;    // 前緩衝區比例
  bufferEnd: number;      // 後緩衝區比例
  rotationSpeed: {
    normal: number;       // 正常旋轉速度
    focused: number;      // 聚焦時旋轉速度
  };
  floatAmplitude: number; // 浮動幅度
} 