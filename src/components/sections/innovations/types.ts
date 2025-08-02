// ============================
// 型別定義區塊
// ============================
// 創新項目的資料結構定義
export interface InnovationItem {
  // 項目唯一識別碼
  id: string;
  // 項目媒體檔案路徑
  path: string;
  // 項目標題
  title: string;
  // 項目副標題
  subtitle: string;
  // 項目 3D 空間位置
  position: { x: number; y: number; z: number };
  // 項目縮放比例
  scale: { x: number; y: number; z: number };
  [key: string]: unknown;
}

// 動畫狀態管理：定義項目在不同深度的視覺效果
export interface ItemState {
  // Z 軸深度值（決定前後層次）
  depth: number;
  // 透明度值
  opacity: number;
  // 模糊程度（創造景深效果）
  blur: number;
  // 縮放比例
  scale: number;
}

// 創新影片項目組件的屬性定義
export interface InnovationVideoItemProps {
  // 項目資料
  item: InnovationItem;
  // 項目索引
  index: number;
  // 項目是否在視窗中可見
  isVisible: boolean;
  // 是否啟用 3D 效果
  is3DEnabled: boolean;
  // 是否啟用動畫效果
  animationsEnabled: boolean;
  // 項目初始偏移位置
  offset: { x: number; y: number };
  // 項目初始深度
  initialDepth: number;
  // 項目點擊處理函數
  onItemClick: (item: InnovationItem) => void;
}