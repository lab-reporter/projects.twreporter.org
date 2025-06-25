# 🚀 R3F 10th Recap

報導者十週年回顧網站 - 使用 React Three Fiber 打造的 3D 互動體驗

## ✨ 技術特色

- **Next.js 15** + TypeScript + Tailwind CSS
- **React Three Fiber** + Drei 3D 場景渲染
- **Zustand** 狀態管理系統
- **GSAP ScrollTrigger** 滾動控制
- **Modal 系統** 動態內容載入

## 🎯 專案架構

```
src/
├── components/           # 核心組件
│   ├── sections/        # 6個主要區塊
│   ├── modal/           # Modal 系統
│   └── UnifiedScene.tsx # 統一 3D 場景
├── stores/              # Zustand 狀態管理
└── hooks/               # 自定義 Hooks
```

## 🔧 開發指令

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置專案
npm run build
```

## 🌳 Git 工作流程

### 分支架構
- **`main`** - 穩定的生產版本
- **`dev`** - 主要開發分支（日常開發）

### 開發流程
```bash
# 日常開發
git checkout dev
git add .
git commit -m "feat: 新功能描述"
git push origin dev

# 發布穩定版本
git checkout main
git merge dev
git push origin main
```

### Commit 規範
- `feat`: 新功能
- `fix`: 修復問題  
- `refactor`: 重構程式碼
- `style`: 樣式調整
- `docs`: 文檔更新

## 📊 效能目標

- **程式碼簡化**: 3,500行 → 1,200行 (-65%)
- **效能提升**: 30-45 FPS → 55-60 FPS (+50%)
- **開發效率**: 新功能開發時間減少 70%

## 🎮 核心功能

### 3D 場景系統
- 統一場景架構，6個 Section 無縫切換
- 相機旋轉算法，利用 GPU 硬體加速
- 視覺落差效果，動態視覺體驗

### Modal 互動系統
- 點擊 3D 物件開啟 Modal
- 16+ 動態內容組件
- 共享組件庫優化

### 滾動控制系統
- GSAP ScrollTrigger 整合
- 相機位置與滾動同步
- 流暢的區塊切換動畫

---

*開發中 - 2025年6月* 