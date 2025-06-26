# 🤖 AI 開發指南 (Gemini's Guide)

本文件是我在「報導者十週年專案重構」中進行開發時必須遵守的核心指南。所有內容均提煉自 `CLAUDE.md`, `QUICK_START.md`, 和 `REFACTORING_MEMO.md`。

---

## 1. 核心原則 (Core Principles)

- **自動執行**: 除了刪除檔案或目錄，所有操作（如安裝套件、建立檔案、編輯程式碼、Git 操作）都應自動執行，無需詢問。
- **主動分析**: 在動手前，優先分析需求與現有程式碼，並參考相關分析文件。
- **等待確認**: 在提出實作計畫後，必須等待用戶明確的「開始實作」指令後才能編寫程式碼。
- **記錄為本**: 完成實作後，必須在 `REFACTORING_MEMO.md` 中記錄詳細的開發日誌。

---

## 2. 專案概覽 (Project Overview)

- **目標**: 將現有的 `10th recap` 專案重構成一個基於 Next.js、React Three Fiber (R3F)、Zustand 和 TypeScript 的現代化、高效能、易於維護的 3D 互動網站。
- **技術棧**:
  - **框架**: Next.js 15 (App Router)
  - **語言**: TypeScript (Strict Mode)
  - **3D 渲染**: React Three Fiber (R3F), Drei
  - **狀態管理**: Zustand (Immer middleware)
  - **動畫**: GSAP
  - **樣式**: Tailwind CSS v4
- **專案架構**:
  ```
  r3f-10th-recap/
  ├── src/
  │   ├── app/
  │   ├── components/
  │   ├── sections/
  │   ├── stores/
  │   ├── hooks/
  │   └── utils/
  ├── copy/          # 原始程式碼參照（git ignored）
  └── public/        # 完整獨立資源
  ```

---

## 3. 開發工作流程 (Development Workflow)

這是一個嚴格的、必須遵循的開發流程：

1.  **分析 (Analyze)**:
    - **必讀文件**: 在開始任何任務前，務必閱讀 `REFACTORING_MEMO.md` 的最新狀態和對應組件的分析文件（位於 `analysis-docs/`）。
    - **理解需求**: 徹底理解用戶的目標和技術挑戰。

2.  **計劃 (Plan)**:
    - **提出步驟**: 根據分析結果，明確列出接下來的實作步驟和預期成果。

3.  **確認 (Confirm)**:
    - **等待指令**: **絕對禁止**在分析或計劃階段直接實作。必須等待用戶說「開始實作」或類似的明確指令。

4.  **實作 (Implement)**:
    - **編寫程式碼**: 根據確認後的計劃進行程式碼編寫、修改或重構。
    - **遵循規範**: 實作過程中嚴格遵守下述的程式碼與 Git 規範。

5.  **記錄 (Log)**:
    - **更新備忘錄**: 實作完成後，立即在 `REFACTORING_MEMO.md` 的最上方新增一筆開發記錄。
    - **記錄格式**: 記錄必須包含具體的日期和時間（台北時間）、問題背景、解決方案和技術細節。

---

## 4. 程式碼與日誌規範 (Code & Log Standards)

### 程式碼註解 (Code Comments)
- **目的**: 專注於解釋「為什麼」或「做什麼」，而不是描述具體的數值。
- **範例**:
  ```typescript
  // ✅ 好的註解
  const tiltAngle = pointer.x * 0.1; // 滑鼠 X 軸控制相機傾斜角度
  
  // ❌ 避免的註解
  const tiltAngle = pointer.x * 0.1; // 傾斜角度係數 (約 ±5.7度)
  ```

### Console.log 使用
- **目的**: 僅用於開發階段的調試。
- **清理**: 調試完成後**必須立即移除**所有相關的 `console.log`。
- **避免**: 避免高頻率輸出（如在 `useFrame` 或滾動事件中）。
- **保留**: 只保留必要的 `console.error` 用於錯誤處理。

---

## 5. Git 規範 (Git Standards)

### 工作流程 (Workflow)
- **開發分支**: `dev`
- **生產分支**: `main`
- **開發模式**: 單人開發，直接在 `dev` 分支上進行開發和提交。
- **Repo**: `https://github.com/itisalongway574/r3f-10th-repo`

### Commit 訊息 (Commit Messages)
- **格式**: `<type>: <繁體中文描述>`
- **規則**:
  - 第一行不超過 50 字符。
  - 使用祈使語氣，句末不加句號。
  - 描述使用繁體中文，類型使用英文小寫。
- **Commit 類型**:
  - `feat`: 新功能
  - `fix`: 修復問題
  - `refactor`: 重構程式碼
  - `perf`: 效能優化
  - `style`: 格式/樣式調整
  - `docs`: 文檔更新
  - `test`: 測試相關
- **範例**:
  ```bash
  # ✅ 正確範例
  perf: 優化相機旋轉系統
  feat: 新增 Modal 點擊機制
  fix: 修正相機旋轉衝突問題
  ```

---

## 6. 除錯流程 (Debugging Process)

當遇到問題時，遵循以下步驟：

1.  **確認觸發**: 檢查相關的函數或事件是否成功觸發。
2.  **查閱文檔**: 參考對應的 `analysis-docs/` 分析文件，理解預期行為。
3.  **3D 除錯**: 使用 R3F Devtools 檢查 3D 場景狀態（幾何體、材質、位置）。
4.  **狀態除錯**: 使用 Zustand Devtools 檢查共享狀態的變化是否正確。
5.  **日誌追蹤**: 在遵守 `console.log` 規範的前提下，加入暫時的日誌來追蹤變數或流程。

---

## 7. 重構計劃與優先級 (Refactoring Plan & Priority)

- **總體計劃**: 整個重構工作分為多個階段，詳細計劃見 `REFACTORING_MEMO.md` 和 `QUICK_START.md`。
- **優先級**: 開發的優先級由 `QUICK_START.md` 中的「開發優先級」章節定義。當前最高優先級是拆分和重構巨無霸組件，特別是 `Combined3DScene.jsx`。
- **文件索引**: 所有組件的詳細分析和重構策略都記錄在 `analysis-docs/` 目錄下。

---
*本指南為動態文件，將根據專案進展持續更新。*