/**
 * Innovation Section 組件群組統一導出
 * 
 * 提供完整的 3D 模型展示系統，包含：
 * - 3D 模型載入與材質處理
 * - 旋轉動畫與浮動效果
 * - 聚焦邏輯與滾動控制
 * - 光照系統配置
 * - 互動與 Modal 整合
 * 
 * 技術特色：
 * - GLTF + DRACO 模型載入
 * - Three.js 動畫系統
 * - 材質自動配置
 * - 錯誤處理與載入狀態
 * - TypeScript 嚴格類型
 */

// 主要組件
export { default as InnovationSection } from './InnovationSection';
export { default as InnovationModel } from './InnovationModel';
export { default as LightingSetup } from './LightingSetup';

// 功能模組
export { useModelLoader, cleanupModelResources } from './ModelLoader';
export { useModelAnimator, getAnimationConfig } from './ModelAnimator';
export { useFocusController, shouldItemBeFocused } from './FocusController';

// 類型定義
export type {
  ModelData,
  InnovationModelProps,
  InnovationSectionProps,
  ModelLoadState,
  FocusConfig
} from './types';

// 預設導出主組件
export { default } from './InnovationSection'; 