// 主要導出 - 外部使用的入口
export { default } from './UnifiedScene';

// 子組件導出 - 供測試或特殊情況使用
export { default as CameraController } from './CameraController';
export { default as DebugPanel } from './DebugPanel';
export { default as SectionRenderer } from './SectionRenderer';

// 常數和類型導出
export * from './SceneConstants';

/**
 * UnifiedScene 組件群組
 * 
 * 主要組件：UnifiedScene - 3D 場景協調者
 * 
 * 子組件架構：
 * - CameraController: 相機控制與動畫系統 (201行)
 * - DebugPanel: 開發偵錯面板 (171行)
 * - SectionRenderer: Section 組件渲染管理 (60行)
 * - SceneConstants: 場景常數與配置 (121行)
 * 
 * 重構成果：
 * - 原始 UnifiedScene.tsx: 459行 → 107行 (-77%)
 * - 拆分為 5個專責組件，最大檔案 201行
 * - 所有硬編碼數值集中管理
 * - 符合單一職責原則
 * 
 * 使用方式：
 * ```typescript
 * import UnifiedScene from '@/components/unified-scene';
 * import { SCENE_CONFIG } from '@/components/unified-scene';
 * ```
 * 
 * 內部組件單獨使用（測試專用）：
 * ```typescript
 * import { CameraController } from '@/components/unified-scene';
 * ```
 */ 