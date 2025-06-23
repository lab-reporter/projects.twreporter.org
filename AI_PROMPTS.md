# 🤖 AI 開發指令

THREE.js 到 React Three Fiber 重構專案。開始前讀 REFACTORING_MEMO.md 和 analysis-docs/ 對應分析。

## 架構原則
- 只開發 `r3f/` 新專案，參考用 `r3f/copy/`
- 完全獨立運作，可隨時移出部署

## 技術優先級
**R3F：** drei 組件優先，InstancedMesh 批次渲染，useFrame 動畫，60 FPS 目標  
**狀態：** Zustand + slice 架構取代 Context，immer 不可變更新  
**效能：** GPU > DOM，視錐體剔除，dispose() 記憶體管理，3 秒載入  
**風格：** 繁體中文註解，TypeScript 嚴格模式，Tailwind CSS

## 工作流程
檢查組件風險等級 → 參考 CodeSandbox 驗證架構 → 確保視覺 100% 一致 → TodoWrite 追蹤 → 更新檢查清單

## 除錯重點
R3F/Zustand Devtools 監控，動畫用 useFrame，記憶體 dispose()，事件系統檢查，資源大小優化

## 衝突處理
與 memo 衝突時：說明原計劃 → 分析影響 → 提供方案 → 用戶決定 → 更新記錄

**核心：** 視覺一致性最高優先級，更新時間戳記 `*最後更新：YYYY-MM-DD HH:MM (台北時間)*`

---

*建立日期：2025-06-18 23:33 (台北時間)*  
*最後更新：2025-06-18 23:44 (台北時間)* 