// 主要導出 - 外部使用的入口在 sections/ReportsSection.tsx

// 子組件導出 - 供測試或特殊情況使用
export { default as CylinderCarousel } from './CylinderCarousel';
export { default as ReportCard } from './ReportCard';
export { default as VideoCard } from './VideoCard';
export { BentPlaneGeometry } from './BentPlaneGeometry';

// 類型導出
export type { ReportData, VideoCardProps } from './VideoCard';
export type { ReportCardProps } from './ReportCard';
export type { CylinderCarouselProps } from './CylinderCarousel';

/**
 * ReportsSection 組件群組
 * 
 * 主要組件：ReportsSection - 3D 圓柱畫廊協調者（位於 ../sections/ReportsSection.tsx）
 * 
 * 子組件架構：
 * - BentPlaneGeometry: 彎曲平面 3D 幾何體 (50行)
 * - VideoCard: 影片卡片處理系統 (120行)
 * - ReportCard: 報導卡片統一管理 (100行)
 * - CylinderCarousel: 圓柱畫廊核心邏輯 (60行)
 * 
 * 重構成果：
 * - 原始 ReportsSection.tsx: 408行 → 70行 (-83%)
 * - 拆分為 4個專責子組件，最大檔案 120行
 * - 3D 幾何體、影片處理、卡片邏輯、畫廊算法各自獨立
 * - 影片載入系統與圖片系統完全分離
 * - 符合單一職責原則
 * 
 * 技術特色：
 * - 自訂 BentPlaneGeometry 實現圓柱面貼合
 * - 複雜的影片載入與錯誤處理機制
 * - 動態尺寸計算與圓柱位置算法
 * - 支援多種影片格式自動檢測
 * 
 * 使用方式：
 * ```typescript
 * // 主組件已位於 sections/ 中，直接導入即可
 * import ReportsSection from '@/components/sections/ReportsSection';
 * 
 * // 子組件單獨使用（測試專用）
 * import { VideoCard, CylinderCarousel } from '@/components/reports-section';
 * ```
 */ 