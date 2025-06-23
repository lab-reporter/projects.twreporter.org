# 🚀 十週年專案重構 - 快速開始指南

> **目標**：基於詳細組件分析的 Next.js + R3F 架構重構  
> **📊 完整分析**：[analysis-docs/](./analysis-docs/) | **📋 總覽**：[REFACTORING_MEMO.md](./REFACTORING_MEMO.md)

## 🗂️ 專案架構（確定版）

### **目錄結構**
```
上層資料夾/
├── 10th recap/        # 原始專案（獨立 git repo）
└── r3f/               # 新專案（獨立 git repo，唯一開發目標）
    ├── src/           # 新的 R3F 程式碼
    ├── copy/          # 原始程式碼副本（參照用，git ignore）
    ├── public/        # 完整獨立資源
    └── .gitignore     # 忽略 copy/ 資料夾
```

### **核心原則**
- **完全獨立專案** - r3f 可隨時整包移出部署
- **copy/ 作為參照** - 本地參考原始程式碼，不進版控
- **簡化開發流程** - 每天 push/deploy 無需額外步驟
- **IDE 只開啟 r3f** - 不需要開啟上層或多個專案

## 📦 立即開始（5 分鐘設置）

### **1. 建立完全獨立的新專案**
```bash
# 回到上層目錄
cd ..

# 建立新 R3F 專案（與原專案平行）
npx create-next-app@latest r3f --typescript --tailwind --eslint --app

# 進入新專案
cd r3f

# 安裝核心依賴
npm install @react-three/fiber @react-three/drei zustand immer gsap three @types/three
```

### **2. 設置參照和資源**
```bash
# 建立原始程式碼參照資料夾
mkdir copy

# 複製原始程式碼（用於參照）
cp -r "../10th recap/src" copy/
cp -r "../10th recap/public" copy/
cp "../10th recap/package.json" copy/

# 複製所有資源（完全獨立）
cp -r "../10th recap/public/assets" public/
cp -r "../10th recap/src/app/data" src/app/  # 如果有資料檔案

# 設定 .gitignore 忽略 copy 資料夾
echo "copy/" >> .gitignore
```

### **3. 設置便利腳本**
```json
// 在 package.json 中加入
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "setup": "mkdir -p copy && cp -r '../10th recap/src' copy/ && cp -r '../10th recap/public' copy/ && cp '../10th recap/package.json' copy/",
    "sync-copy": "rm -rf copy && npm run setup"
  }
}
```

### **4. 建立獨立 Git Repo**
```bash
# 初始化新的 Git repository
git init
git remote add origin <你的新 r3f repo URL>

# 第一次提交
git add .
git commit -m "Initial commit: R3F project setup with copy reference"
git push -u origin main
```

## 🎯 開發優先級（基於分析結果）

> **📊 重構統計**：12個組件，共 ~3,500行程式碼，預期減少 60-80%  
> **⚡ 效能提升**：FPS +33-100%，首屏載入 -44%，記憶體使用 -40%

### **🚨 極高優先級：巨無霸組件（第1週）**

#### **Combined3DScene.jsx** - 立即重構
- **📏 規模**：1,374行 / 58.4KB（最大技術債務）
- **⚠️ 風險等級**：極高（24個 useRef + 8個 useState）
- **🔧 重構策略**：拆分為 Reports + Innovation 兩個獨立場景
- **📈 預期效果**：程式碼減少 85%（1,374行 → 200行）
- **⏱️ 實施時間**：Day 1-5
- **🔗 詳細分析**：[COMBINED3D_REFACTOR_ANALYSIS.md](./analysis-docs/COMBINED3D_REFACTOR_ANALYSIS.md)

### **🔥 極高優先級：複雜 3D 組件（第2週）**

#### **ReportsThree.jsx** - 3D 圓柱畫廊
- **📏 規模**：775行 / 31KB  
- **⚠️ 挑戰**：複雜彎曲幾何體 + 多媒體載入 + 聚光燈系統
- **🎯 核心重構**：彎曲平面幾何 174行 → 30行 R3F 組件
- **📈 預期效果**：滾動控制簡化 95%，FPS 提升 100%
- **⏱️ 實施時間**：Day 6-10
- **🔗 詳細分析**：[REPORTS_THREE_REFACTOR_ANALYSIS.md](./analysis-docs/REPORTS_THREE_REFACTOR_ANALYSIS.md)

#### **Path.jsx** - 水平滾動系統  
- **📏 規模**：312行 / 中等複雜度
- **⚠️ 挑戰**：GSAP ScrollTrigger + 3D 照片動畫同步
- **🎯 核心重構**：36張照片的深度動畫效能優化
- **⚙️ 風險控制**：需要 fallback 機制和效能監控
- **⏱️ 實施時間**：Day 11-14
- **🔗 詳細分析**：[PATH_REFACTOR_ANALYSIS.md](./analysis-docs/PATH_REFACTOR_ANALYSIS.md)

### **⚡ 高優先級：核心功能組件（第3週）**

#### **Innovation.jsx** - 3D 模型序列
- **📏 規模**：661行 / 複雜 3D 邏輯
- **🎯 重構要點**：11個 3D 模型的滾動序列控制
- **⚙️ 技術挑戰**：GLTF 載入 + 動畫混合器整合
- **📈 預期效果**：載入效能提升 150%
- **🔗 詳細分析**：[INNOVATION_REFACTOR_ANALYSIS.md](./analysis-docs/INNOVATION_REFACTOR_ANALYSIS.md)

#### **背景效果系統重構**
- **BackgroundBlocks** → GPU 實例化（100個方塊）
- **BackgroundParticles** → 完全移除 OGL 依賴  
- **Open 序列動畫** → 200個方塊的 3D 化
- **🔗 分析文件**：[OPEN_REFACTOR_ANALYSIS.md](./analysis-docs/OPEN_REFACTOR_ANALYSIS.md)、[CALLTOACTION_REFACTOR_ANALYSIS.md](./analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md)

### **📋 中等優先級：UI 系統組件（第4週）**

#### **Preloader.jsx** - 預載系統
- **📏 規模**：253行 / 中等複雜度
- **🎯 功能**：FlipClock + 資源預載整合
- **⚠️ 風險等級**：中等（主要為功能保持 + 可選增強）
- **🔗 詳細分析**：[PRELOADER_REFACTOR_ANALYSIS.md](./analysis-docs/PRELOADER_REFACTOR_ANALYSIS.md)

#### **Support.jsx** - 支持募集系統
- **📏 規模**：277行 / 重要功能
- **🎯 功能**：數字動畫 + 表單 + 彩帶效果 + 3D 背景
- **⚠️ 風險等級**：中等（重要功能 + 視覺升級機會）
- **🔗 詳細分析**：[SUPPORT_REFACTOR_ANALYSIS.md](./analysis-docs/SUPPORT_REFACTOR_ANALYSIS.md)

### **✅ 低優先級：簡單 UI 組件（第4週）**

#### **Feedback.jsx** - 用戶見證展示
- **📏 規模**：127行 / 簡單內容展示
- **🎯 功能**：Swiper → 3D 卡片展示（39則見證）
- **⚠️ 風險等級**：低（內容展示 + 可選 3D 增強）
- **🔗 詳細分析**：[FEEDBACK_REFACTOR_ANALYSIS.md](./analysis-docs/FEEDBACK_REFACTOR_ANALYSIS.md)

#### **CallToAction.jsx** - 行動呼籲區
- **📏 規模**：25行 / 最簡單組件
- **🎯 功能**：簡單容器 + BackgroundBlocks 動態方塊效果
- **⚠️ 風險等級**：低（簡單效果 + 視覺增強機會）
- **🔗 詳細分析**：[CALLTOACTION_REFACTOR_ANALYSIS.md](./analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md)

### **🔧 系統整合：狀態管理（全期間）**

#### **Zustand 統一架構**
- **🎯 目標**：替換散佈的 Context + useRef 架構
- **📈 預期效果**：可維護性提升 250%，除錯效率提升 250%
- **🔗 完整架構設計**：[STATE_MANAGEMENT_ANALYSIS.md](./analysis-docs/STATE_MANAGEMENT_ANALYSIS.md)

## 🔧 關鍵技術選型

| 領域 | 現有方案 | 新方案 | 預期改進效果 |
|------|---------|--------|-------------|
| **3D 渲染** | 原生 THREE.js 手動管理 | React Three Fiber | 開發效率 +300% |
| **狀態管理** | Context + useRef 散佈 | Zustand + TypeScript | 可維護性 +200% |
| **動畫系統** | GSAP 手動同步 | GSAP + R3F useFrame | 效能 +150% |
| **組件架構** | 巨無霸組件（1,374行） | 模組化小組件（<200行） | 協作效率 +200% |
| **記憶體管理** | 手動清理和 useRef | R3F 自動資源管理 | 穩定性 +300% |

## 📊 量化預期成果

### **程式碼品質改善**
| 指標 | 現況 | 目標 | 改進幅度 |
|------|------|------|----------|
| **總行數** | 3,500+ 行 | 1,200 行 | **-65%** |
| **最大組件** | 1,374 行 | < 200 行 | **-85%** |
| **useRef 數量** | 30+ 個 | < 10 個 | **-70%** |
| **組件數量** | 12 個複雜組件 | 20+ 個模組化組件 | **+60% 復用率** |

### **效能提升預期**
| 指標 | 現況基準 | 目標 | 改進幅度 |
|------|---------|------|----------|
| **FPS 穩定性** | 30-45 FPS | 55-60 FPS | **+33-100%** |
| **首屏載入** | 3.2s | 1.8s | **-44%** |
| **記憶體使用** | 基準 | -40% | **更輕量** |
| **Bundle 大小** | 基準 | -25% | **更小巧** |

### **開發體驗改善**
| 指標 | 現況 | 目標 | 改進幅度 |
|------|------|------|----------|
| **新功能開發** | 2-3 天 | 0.5-1 天 | **-70% 時間** |
| **Bug 修復** | 基準 | -60% | **更快速** |
| **組件復用** | 30% | 80% | **+150%** |
| **型別安全** | 0%（JavaScript） | 95%（TypeScript） | **質量革命** |

## ⚠️ 風險控制與成功標準

### **技術風險評估**
- **極高風險**（3個組件）：Combined3D、ReportsThree、Path
  - **控制策略**：分階段重構，每階段都有可部署版本
  - **成功標準**：效能監控通過，視覺效果100%還原

- **中等風險**（4個組件）：Innovation、Preloader、Open、Support
  - **控制策略**：漸進式增強，保持向下兼容
  - **成功標準**：功能完整性 + 額外的視覺提升

- **低風險**（4個組件）：CallToAction、Feedback、UI整合類
  - **控制策略**：快速重構，重點在架構整合
  - **成功標準**：程式碼簡化 + 維護性提升

### **關鍵成功指標**
- **效能達標**：60 FPS 穩定運行，Lighthouse 90+ 分數
- **功能完整**：所有原有功能100%還原 + 額外增強
- **程式碼品質**：TypeScript 覆蓋率 95%，ESLint 零警告
- **開發體驗**：新功能開發時間減少 70%

## 🚀 日常開發流程

### **開發前必讀**
1. **📖 先讀對應分析文件** - [analysis-docs/](./analysis-docs/) 中找到組件分析
2. **🔍 理解技術挑戰** - 查看風險評估和重構建議
3. **💡 參考程式碼範例** - 使用分析中提供的 R3F 重構代碼
4. **✅ 遵循驗收標準** - 確保功能、視覺、效能標準都達成

### **簡化的開發體驗**
```bash
# 1. 開啟 IDE（只需開啟 r3f 專案）
code r3f

# 2. 開發
npm run dev  # http://localhost:3001

# 3. 提交（標準流程，無額外步驟）
git add .
git commit -m "新功能開發"
git push origin main

# 4. Vercel 自動部署（零配置）
```

### **除錯和問題解決流程**
1. **檢查 function 是否成功觸發**
2. **參照對應的 analysis-docs 分析檔案**
3. **使用 R3F Devtools 檢查 3D 場景狀態**
4. **檢查 Zustand Devtools 的狀態變化**
5. **建立適當的 console.log 來追蹤問題**

### **組件開發標準流程**
1. **📋 查看組件分析** - 在 [analysis-docs/](./analysis-docs/) 中找到對應檔案
2. **🎯 理解重構目標** - 查看預期效果和技術挑戰
3. **💻 參考重構程式碼** - 使用提供的 R3F 範例做為起點
4. **🧪 執行驗收測試** - 使用分析中的驗收標準
5. **📝 更新進度** - 在 [REFACTORING_MEMO.md](./REFACTORING_MEMO.md) 中標記完成狀態

### **參照原始程式碼**
```bash
# 當需要參考原始程式碼時
# 直接在 IDE 中開啟 copy/ 資料夾內的檔案

# 如果原始專案有重要更新
npm run sync-copy  # 重新同步 copy/ 資料夾
```

## 📚 文件索引（按開發順序）

### **第1週：極高優先級**
- [COMBINED3D_REFACTOR_ANALYSIS.md](./analysis-docs/COMBINED3D_REFACTOR_ANALYSIS.md) - 巨無霸組件拆分
- [STATE_MANAGEMENT_ANALYSIS.md](./analysis-docs/STATE_MANAGEMENT_ANALYSIS.md) - Zustand 架構建立

### **第2週：極高風險組件**  
- [REPORTS_THREE_REFACTOR_ANALYSIS.md](./analysis-docs/REPORTS_THREE_REFACTOR_ANALYSIS.md) - 3D 圓柱畫廊
- [PATH_REFACTOR_ANALYSIS.md](./analysis-docs/PATH_REFACTOR_ANALYSIS.md) - 水平滾動系統

### **第3週：高優先級組件**
- [INNOVATION_REFACTOR_ANALYSIS.md](./analysis-docs/INNOVATION_REFACTOR_ANALYSIS.md) - 3D 模型序列
- [OPEN_REFACTOR_ANALYSIS.md](./analysis-docs/OPEN_REFACTOR_ANALYSIS.md) - 開場動畫

### **第4週：系統整合**
- [SIDEPANEL_REFACTOR_ANALYSIS.md](./analysis-docs/SIDEPANEL_REFACTOR_ANALYSIS.md) - 側邊欄系統
- [PRELOADER_REFACTOR_ANALYSIS.md](./analysis-docs/PRELOADER_REFACTOR_ANALYSIS.md) - 預載系統
- [SUPPORT_REFACTOR_ANALYSIS.md](./analysis-docs/SUPPORT_REFACTOR_ANALYSIS.md) - 支持募集
- [FEEDBACK_REFACTOR_ANALYSIS.md](./analysis-docs/FEEDBACK_REFACTOR_ANALYSIS.md) - 用戶見證
- [CALLTOACTION_REFACTOR_ANALYSIS.md](./analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md) - 行動呼籲

### **總覽參考**
- [analysis-docs/README.md](./analysis-docs/README.md) - 完整分析總覽
- [REFACTORING_MEMO.md](./REFACTORING_MEMO.md) - 專案重構總覽

---

**🎯 記住**：這不只是技術重構，而是一次架構革命。每個決策都基於詳細分析，每個改進都有量化指標。透過模組化設計和現代工具鏈，我們將建立一個高效能、易維護、可擴展的 3D 互動網站。