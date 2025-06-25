# 🛠️ 開發指南

## 🌳 Git 工作流程

### 分支說明
- **`main`**: 穩定的生產版本，用於發布
- **`dev`**: 主要開發分支，所有日常開發都在此進行

### 日常開發流程

```bash
# 1. 確保在 dev 分支
git checkout dev

# 2. 拉取最新代碼（如果是協作開發）
git pull origin dev

# 3. 進行開發工作
# ... 編輯代碼 ...

# 4. 提交變更
git add .
git commit -m "feat: 新功能描述"

# 5. 推送到遠端
git push origin dev
```

### 發布穩定版本

```bash
# 1. 切換到 main 分支
git checkout main

# 2. 合併 dev 分支的變更
git merge dev

# 3. 推送到遠端
git push origin main

# 4. 切回 dev 繼續開發
git checkout dev
```

## 📝 Commit 訊息規範

### 類型標籤
- `feat`: 新功能
- `fix`: 修復 bug
- `refactor`: 重構程式碼
- `perf`: 效能優化
- `style`: 樣式調整
- `docs`: 文檔更新
- `chore`: 建構工具或輔助工具的變動

### 格式範例
```bash
git commit -m "feat: 新增 Modal 動畫效果"
git commit -m "fix: 修正相機旋轉衝突問題"
git commit -m "refactor: 重構 ReportsSection 組件"
git commit -m "style: 調整 Navigation 樣式"
git commit -m "docs: 更新 README 說明"
```

## 🔧 開發環境

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
# 開啟 http://localhost:3001
```

### 建置專案
```bash
npm run build
```

### 類型檢查
```bash
npx tsc --noEmit
```

## 📂 專案結構

```
src/
├── components/           # 核心組件
│   ├── sections/        # 6個主要區塊
│   ├── modal/           # Modal 系統
│   ├── Navigation.tsx   # 導航組件
│   ├── Modal.tsx        # Modal 主組件
│   └── UnifiedScene.tsx # 統一 3D 場景
├── stores/              # Zustand 狀態管理
│   └── slices/         # 狀態切片
├── hooks/               # 自定義 Hooks
└── app/                # Next.js App Router
    ├── globals.css     # 全域樣式
    └── page.tsx        # 主頁面
```

## 🎯 開發重點

### 效能優化
- 使用 `useMemo` 和 `useCallback` 優化渲染
- 3D 場景使用相機旋轉而非物件旋轉
- Modal 內容組件動態載入

### 狀態管理
- 使用 Zustand 進行狀態管理
- 分為 4 個 slice：dataSlice, sceneSlice, scrollSlice, uiSlice

### 樣式規範
- 使用 Tailwind CSS
- 程式碼註解以繁體中文撰寫
- 避免在註解中寫死具體數值

---

*Repository: https://github.com/itisalongway574/r3f-10th-repo* 