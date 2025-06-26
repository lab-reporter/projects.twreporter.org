// 材質系統組件群組導出
export { MaterialApplicator } from './MaterialApplicator';
export { MaterialMatcher } from './MaterialMatcher';
export { TextureManager } from './TextureManager';
export { defaultMaterialConfigs, MaterialConfigManager } from './MaterialConfigs';
export { MaterialDebugger, debugModelStructure } from './MaterialDebugger';

// 主要 API 導出 (向後兼容)
export { applyMaterialConfig } from './MaterialApplicator';

// 類型導出
export type {
  MaterialConfig,
  TextureConfig,
  MaterialProperties,
  PartialMaterialConfig,
  MaterialMatchStrategy,
  MaterialMatchResult,
  MaterialApplicationContext
} from './types';

// 調試相關類型導出
export type {
  MaterialAnalysisResult,
  ConfigSuggestion,
  MaterialInfo,
  MeshInfo,
  AnalysisSummary
} from './MaterialDebugger'; 