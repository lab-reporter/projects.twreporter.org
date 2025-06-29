# 🚀 報導者十週年回顧網站

基於純 2D CSS/JS 動畫的互動展示網站

## ✨ 技術特色

- **Next.js 15** + TypeScript + Tailwind CSS
- **GSAP + ScrollTrigger** 滾動動畫系統
- **Zustand** 狀態管理
- **Modal 系統** 動態內容載入
- **響應式設計** 支援各種設備

## 🎯 2D 版本特點

- **高兼容性** - 支援更多低階設備
- **快速載入** - 比 3D 版本載入速度快 50%+
- **易維護** - 降低技術複雜度
- **響應式** - 完整支援各螢幕尺寸

## 📋 Section 架構

1. **Opening** - 開場動畫區塊
2. **Reports** - 影響力報導展示
3. **Innovations** - 多元創新展示
4. **Challenges** - 挑戰與成長故事
5. **Feedbacks** - 贊助者證言
6. **Support** - 贊助支持頁面

## 🔧 開發指令

```bash
# 安裝依賴
npm install

# 開發模式 (http://localhost:3001)
npm run dev

# 建置專案
npm run build

# 啟動生產伺服器
npm start
```

## 🏗️ 專案架構

```
src/
├── components/
│   ├── sections/
│   │   ├── opening/
│   │   ├── reports/
│   │   ├── innovations/
│   │   ├── challenges/
│   │   ├── feedbacks/
│   │   └── support/
│   ├── modal/           # Modal 系統
│   ├── LoadingScreen.tsx
│   ├── Navigation.tsx
│   └── SectionNavigation.tsx
├── stores/              # Zustand 狀態管理
│   ├── slices/
│   └── index.ts
├── hooks/               # 自定義 Hooks
└── app/
    ├── data/           # 專案資料
    └── page.tsx        # 主頁面
```

## 🌳 開發分支

- **`main`** - 穩定的生產版本
- **`dev-2d`** - 2D 版本開發分支 (當前)
- **`dev-3d`** - 3D 版本開發分支 (保留)

### ⚠️ 分支合併限制
**dev-2d 分支不直接合併到 main**，保持作為 2D 技術方案的獨立開發分支。

## 📋 技術規範

### GSAP & ScrollTrigger 管理
- 每個 Section 使用唯一的 trigger ID
- 組件卸載時清理對應的 ScrollTrigger
- 避免不同 Section 的動畫衝突

### SectionNavigation 顯示規則
- Opening 區域時導航隱藏
- 從 Reports 區域開始顯示導航
- 與滾動位置同步更新狀態

### 效能優化
- 延遲載入非關鍵 Section
- GSAP 動畫適當節流控制
- 響應式設計支援各螢幕尺寸

## 🔧 開發規範

### Commit 格式
```bash
feat: 新增 Opening Section 開場動畫
fix: 修正 ScrollTrigger 衝突問題
refactor: 重構 Section 組件架構
perf: 優化 GSAP 動畫效能
style: 調整響應式樣式
docs: 更新開發文檔
```

### 程式碼規範
- 單一檔案超過 200 行時考慮拆分
- 每個 Section 組件保持獨立
- 相同邏輯出現 2-3 次時抽取為共用函數
- 保持「一個檔案一個職責」原則

## 📊 開發目標

- **載入速度提升** 50%+
- **設備兼容性** 覆蓋更多低階設備
- **開發效率** 新功能開發時間減少 70%
- **維護性** 降低技術複雜度

## 🎮 核心功能

### 滾動動畫系統
- GSAP ScrollTrigger 驅動
- 流暢的 Section 切換動畫
- 與導航系統同步

### Modal 互動系統
- 點擊元素開啟 Modal
- 動態內容載入
- 16+ 內容組件
- 導航控制系統

### 狀態管理
- Zustand 統一管理
- Section 進度追蹤
- 滾動狀態同步

---

*dev-2d 分支開發中 - 2025年6月*