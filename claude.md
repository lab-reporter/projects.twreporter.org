# 報導者十週年回顧 2D 版本開發規範

## 📌 專案總覽

### 基本資訊
- **專案名稱**: 報導者十週年回顧網站 (2D 版本)
- **技術架構**: Next.js 15 + TypeScript + Tailwind CSS + GSAP
- **開發分支**: `dev-2d`
- **開發環境**: http://localhost:3001
- **GitHub**: https://github.com/itisalongway574/r3f-10th-repo

### 專案定位
- **技術路線**: 2D CSS/JS 動畫（取代原 3D WebGL 版本）
- **目標受眾**: 支援更多低階設備，提升載入速度
- **核心價值**: 降低技術複雜度，提高維護性

### 章節架構
1. **Opening** - 開場動畫區塊（Fixed 背景）
2. **Reports** - 影響力報導展示（3D 輪播）
3. **Innovations** - 多元創新展示（深度動畫）
4. **Challenges** - 挑戰與成長故事（水平滾動）
5. **Feedbacks** - 贊助者證言
6. **Support** - 贊助支持頁面

## 🗂️ 檔案架構

```
r3f-10th-recap/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # 首頁（唯一路由）
│   │   └── layout.tsx         # 全域佈局
│   ├── components/
│   │   ├── sections/          # 各章節組件
│   │   ├── modal/             # Modal 系統
│   │   └── shared/            # 全域共用組件
│   ├── hooks/                 # 自定義 Hooks
│   ├── stores/                # Zustand 狀態管理
│   │   └── slices/           # 各狀態切片
│   ├── lib/                   # 工具函數
│   └── styles/               # 全域樣式
├── public/                    # 靜態資源
├── CLAUDE.md                  # AI 助手開發規範（本檔案）
├── DEVELOPMENT_LOG.md         # 詳細開發紀錄
└── copy/                      # 參考程式碼（git ignored）
```

## 🤖 AI 助手工作規範

### ✅ 自動執行項目（不需詢問）
```
套件管理      建立檔案      編輯程式碼
pnpm install  新增組件      修復 bug
pnpm add      建立 Hook     重構功能
更新依賴      建立樣式      優化效能
```

### ❌ 需要確認項目（必須詢問）
```
刪除操作         Git 操作              破壞性變更
刪除檔案/目錄    git commit           重大架構調整
清空檔案內容     git push             移除重要功能
                git merge/rebase      變更核心邏輯
```

### ⚠️ 特別注意事項

#### Git 分支管理
- **絕對禁止**: dev-2d 直接合併到 main
- **必須確認**: 任何 merge 到 main 的操作
- **確認文字**: 「您確定要將 dev-2d 合併到 main 嗎？這會改變主分支的技術路線。」

#### 程式碼品質檢查
- **每次修改後**: 執行 `pnpm run lint`
- **功能完成後**: 執行 `pnpm run build`
- **部署前必做**: 執行完整測試流程

## 📝 開發規範

### Git 工作流程
```
main (穩定版本)
  └── dev-2d (2D 開發分支) ← 目前在此
       └── feature/* (功能分支)
```

### Git Commit 規範
```bash
# 格式: <type>: <繁體中文描述>
feat: 新增功能
fix: 修復問題
refactor: 重構程式碼
perf: 效能優化
style: 格式調整
docs: 文檔更新

# 範例
feat: 新增 Modal 動畫效果
fix: 修正滾動監聽記憶體洩漏
```

**嚴格禁止**: AI/Claude/助手等相關字詞

### 時間記錄規範
```bash
# 取得台北時區時間
TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M:%S %Z'
# 輸出: 2025-01-07 14:30:45 CST
```

使用場景：
- 開發紀錄更新
- 重要里程碑
- 問題解決記錄

### Console.log 規範
```typescript
// ✅ 開發環境限制
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// ❌ 避免生產環境輸出
console.log('This will show in production');
```

原則：
- 僅用於調試
- 完成後立即清理
- 保留必要的 console.error

## 💻 程式碼規範

### 架構原則
| 原則 | 說明 | 標準 |
|------|------|------|
| 功能獨立 | Section 組件互不依賴 | 各自獨立運作 |
| 檔案大小 | 超過 200 行要拆分 | 保持可讀性 |
| 程式重用 | 重複 2-3 次要抽取 | 建立共用函數 |
| 單一職責 | 一檔一功能 | 明確責任劃分 |

### 註解規範

#### ✅ 好的註解
```typescript
// 防止滾動時重複觸發昂貴的計算
const debouncedHandler = useMemo(...)

// TODO: 待後端 API 完成後串接真實資料
const mockData = [...]

// 使用 IntersectionObserver 實現懶加載以提升效能
const [isVisible, setIsVisible] = useState(false);
```

#### ❌ 不好的註解
```typescript
// 設定狀態
const [state, setState] = useState();

// 引入 React
import React from 'react';

// 這是一個函數
function doSomething() {}
```

#### 註解原則
- 解釋「為什麼」而非「做什麼」
- 使用繁體中文
- 放在程式碼上方
- 讓非技術人員也能理解

## 🎯 技術架構

### 核心技術棧
| 類別 | 技術 | 用途 |
|------|------|------|
| 框架 | Next.js 15 | App Router + RSC |
| 語言 | TypeScript | 型別安全 |
| 樣式 | Tailwind CSS | 原子化 CSS |
| 動畫 | GSAP 3 | 高效能動畫 |
| 狀態 | Zustand | 輕量級狀態管理 |

### 動畫系統架構
```
GSAP Timeline (主時間軸)
├── ScrollTrigger (滾動驅動)
├── Mouse Tracking (滑鼠追蹤)
└── Performance Monitor (效能監控)
    ├── FPS Detection
    ├── Auto Degradation
    └── DOM Cache
```

### 3D 效果實現（純 CSS）
- `transform3d` + `perspective` 營造深度
- `preserve-3d` 保持 3D 空間
- 動態 `perspectiveOrigin` 追蹤滑鼠
- 硬體加速 `will-change` 優化

### 狀態管理結構
```typescript
Zustand Store
├── scrollSlice      // 滾動進度、方向、當前章節
├── uiSlice         // UI 狀態、載入、互動
├── modalSlice      // Modal 開關、內容、動畫
└── dataSlice       // 專案資料、快取管理
```

### 效能目標
- **載入速度**: < 3秒首屏
- **動畫流暢**: > 30 FPS
- **兼容性**: 支援 2019+ 設備
- **Lighthouse**: > 80 分

## 🚀 部署指南

### 部署前檢查清單
```bash
# 1. 清理快取
rm -rf .next node_modules/.cache

# 2. 重新安裝
pnpm install

# 3. 類型檢查
pnpm run type-check

# 4. Lint 檢查
pnpm run lint

# 5. 構建測試
pnpm run build

# 6. 本地預覽
pnpm run start
```

### 常見錯誤處理

#### 1. Lockfile 不同步
```bash
# 錯誤: ERR_PNPM_OUTDATED_LOCKFILE
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: 更新 pnpm-lock.yaml"
```

#### 2. TypeScript 類型錯誤
```typescript
// ❌ 錯誤寫法
const id = modal.data.id; // unknown 類型

// ✅ 正確寫法
const id = (modal.data as { id?: string })?.id || '';
```

#### 3. ESLint 問題
```typescript
// ❌ 未使用的變數
const unused = 'value';

// ✅ 移除或使用
// 直接刪除未使用的程式碼
```

### 效能檢測標準
- **Lighthouse**: > 80 分
- **首屏載入**: < 3 秒
- **動畫 FPS**: > 30
- **累積版面位移**: < 0.1

## 📚 相關資源
- **開發紀錄**: [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)
- **GitHub**: https://github.com/itisalongway574/r3f-10th-repo
- **設計稿**: [Figma 連結]
- **API 文件**: [後端文件連結]

---
*最後更新: 2025-07-07*
*維護者: 報導者技術團隊*