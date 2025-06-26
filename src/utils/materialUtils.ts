// 材質系統代理檔案 - 向後兼容
// 實際功能已重構至 material-system/ 組件群組

export {
  // 主要 API
  applyMaterialConfig,
  
  // 系統組件
  MaterialApplicator,
  MaterialMatcher,
  TextureManager,
  MaterialConfigManager,
  MaterialDebugger,
  
  // 配置
  defaultMaterialConfigs,
  
  // 調試函數（向後兼容）
  debugModelStructure
} from './material-system';

// 類型導出
export type {
  MaterialConfig,
  TextureConfig,
  MaterialProperties,
  PartialMaterialConfig,
  MaterialMatchStrategy,
  MaterialMatchResult,
  MaterialApplicationContext,
  MaterialAnalysisResult,
  ConfigSuggestion
} from './material-system'; 