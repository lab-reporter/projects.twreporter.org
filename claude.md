# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概覽

**報導者十週年回顧網站 (2D 版本)**
- 技術架構: Next.js 15 + TypeScript + Tailwind CSS + GSAP
- 開發分支: `dev-2d`
- 開發環境: http://localhost:3001
- GitHub: https://github.com/itisalongway574/r3f-10th-repo

### 章節架構
1. **Opening** - 開場動畫（照片立方體效果）
2. **Reports** - 影響力報導（3D 輪播）
3. **Innovations** - 多元創新（深度動畫）
4. **Challenges** - 挑戰故事（水平滾動）
5. **Feedbacks** - 贊助者證言
6. **Support** - 支持頁面

## 開發指令

```bash
# 開發伺服器（Turbopack，port 3001）
pnpm dev

# 建置專案
pnpm build

# 執行生產版本
pnpm start

# ESLint 檢查
pnpm lint

# 類型檢查（無預設腳本，手動執行）
npx tsc --noEmit
```

## 高階架構

### 狀態管理 (Zustand + Immer)
```
src/stores/
├── scrollSlice    # 滾動狀態（進度、方向、章節）
├── uiSlice        # UI 狀態（導航、Modal、主題）
├── dataSlice      # 資料管理（專案、篩選、載入）
└── sceneSlice     # 場景狀態（相機、效能監控）
```

### 動畫系統
- **主時間軸**: `useMainTimeline` 管理開場動畫
- **滾動驅動**: GSAP ScrollTrigger
- **滑鼠追蹤**: `useMouseTracking3D` 建立 3D 透視效果
- **效能監控**: `usePerformanceMonitor` 自動降級

### Modal 系統
- 32 個內容組件（12 Reports + 10 Innovations + 10 Challenges）
- 動態載入: `src/components/modal/content/[contentId].tsx`
- 鍵盤導航與相鄰項目切換支援

### 專案資料結構
```typescript
// src/app/data/projects.json
interface Project {
  id: string;           // "reports-1", "innovation-1"
  path: string;         // 媒體路徑
  title: string;        // 標題
  subtitle?: string;    // 副標題
  section: string[];    // ["reports"] 或多個章節
  bgColor?: string;     // 背景色
}
```

## AI 助手工作規範

### ✅ 自動執行（不需詢問）
- pnpm install/add
- 建立檔案/組件
- 編輯程式碼
- 修復 bug
- 重構功能

### ❌ 需要確認（必須詢問）
- 刪除檔案/目錄
- git commit/push
- git merge/rebase
- **重要**: dev-2d 合併到 main 需特別確認

### Git Commit 規範
```bash
<type>: <繁體中文描述>

# 類型:
feat: 新增功能
fix: 修復問題
refactor: 重構程式碼
perf: 效能優化
style: 格式調整
docs: 文檔更新
revert: 恢復版本

# 禁止: AI/Claude/助手等字詞
```

## 程式碼規範

### 架構原則
- Section 組件互不依賴
- 檔案超過 200 行要拆分
- 重複 2-3 次的邏輯要抽取
- 一檔一功能原則

### 註解規範
- 使用繁體中文
- 解釋「為什麼」而非「做什麼」
- 置於程式碼上方
- 讓非技術人員也能理解

### Console 輸出
```typescript
// 僅開發環境
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

## 效能目標與部署

### 目標指標
- Lighthouse: > 80 分
- 首屏載入: < 3 秒
- 動畫 FPS: > 30
- CLS: < 0.1

### 部署前檢查
```bash
# 清理快取
rm -rf .next node_modules/.cache

# 重新安裝
pnpm install

# 類型檢查
npx tsc --noEmit

# Lint 檢查
pnpm lint

# 建置測試
pnpm build

# 本地預覽
pnpm start
```

## 常見問題處理

### ScrollTrigger 衝突
- 使用唯一 ID 識別每個觸發器
- 組件卸載時確實清理
- 避免巢狀 ScrollTrigger

### TypeScript 類型處理
```typescript
// 處理 unknown 類型
const id = (modal.data as { id?: string })?.id || '';
```

### Lockfile 同步
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: 更新 pnpm-lock.yaml"
```

## 相關資源
- 開發紀錄: [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)
- GitHub: https://github.com/itisalongway574/r3f-10th-repo