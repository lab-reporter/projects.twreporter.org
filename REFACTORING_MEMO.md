# 📋 報導者十週年專案重構總覽

> **🎯 目標：基於詳細分析的現代化重構專案**  
> **技術架構：Next.js + R3F + Zustand + TypeScript**  
> **📖 快速開始：[QUICK_START.md](./QUICK_START.md)**  
> **📊 詳細分析：[analysis-docs/](./analysis-docs/)**

---

## 🔍 重構全貌總覽

### **基於完整分析的重構策略**

本專案已完成所有組件的深度分析，共計 **12 個組件 + 1 個狀態管理系統**：

#### **📊 分析統計**
- **極高風險組件**: 3 個（COMBINED3D、REPORTS_THREE、PATH）  
- **中等風險組件**: 4 個（INNOVATION、PRELOADER、OPEN、SUPPORT）
- **低風險組件**: 4 個（CALLTOACTION、FEEDBACK、SIDEPANEL 整合）
- **狀態管理系統**: 1 個（核心架構重構）

#### **💾 程式碼規模**
- **總行數**: ~3,500 行需重構程式碼
- **核心組件**: Combined3DScene.jsx（1,374 行巨無霸組件）
- **預期簡化**: 總體程式碼減少 60-80%

> **🔗 詳細分析索引**：每個組件的深度分析、R3F 重構方案、風險評估請參考 [analysis-docs/README.md](./analysis-docs/README.md)

---

## 🏗️ 新專案架構設計

### **專案結構（最終確定版）**
```
r3f-10th-recap/                    # 獨立新專案
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── components/            # 純 UI 組件（基於分析優化）
│   │   ├── sections/              # 頁面區段組件（12個重構組件）
│   │   ├── stores/                # Zustand 狀態管理（統一架構）
│   │   └── hooks/                 # React Hooks（R3F 整合）
│   ├── scenes/                    # R3F 3D 場景層
│   │   ├── shared/                # 共用 3D 組件
│   │   ├── reports/               # 報導圓柱場景
│   │   ├── innovation/            # 創新散佈場景  
│   │   └── path/                  # 水平滾動場景
│   └── utils/                     # 效能優化工具
├── copy/                          # 原始程式碼參照（git ignored）
└── public/                        # 完整獨立資源
```

### **技術棧升級**

| 層級 | 現有技術 | 重構目標 | 主要改進 |
|------|---------|---------|----------|
| **3D 渲染** | Three.js 手動管理 | React Three Fiber | 開發效率 +300% |
| **狀態管理** | Context + useRef 散佈 | Zustand 統一架構 | 可維護性 +250% |
| **動畫系統** | GSAP + 手動同步 | GSAP + R3F useFrame | 效能 +150% |
| **型別安全** | JavaScript | TypeScript 嚴格模式 | 開發品質 +200% |
| **組件架構** | 巨無霸組件 | 模組化小組件 | 協作效率 +200% |

---

## 🚀 實施計劃（基於風險分析）

### **Phase 1: 基礎建設 (Day 1-3)**
**目標**：建立堅實的開發基礎，確保後續開發順暢

#### **專案架構建設**
- [ ] **獨立專案設置**：完全獨立的 r3f 專案，可隨時部署
  - [ ] 建立 Next.js 14 + TypeScript 專案
  - [ ] 配置 Tailwind CSS + ESLint + Prettier
  - [ ] 設置 copy/ 資料夾參照系統
  - [ ] 配置 .gitignore 忽略參照檔案
  
- [ ] **TypeScript 嚴格配置**：完整型別定義和編譯檢查
  - [ ] 配置 tsconfig.json 嚴格模式
  - [ ] 建立基礎型別定義檔案
  - [ ] 設置 TypeScript 編譯檢查流程
  - [ ] 配置 IDE 型別提示和自動完成
  
- [ ] **R3F 核心安裝**：@react-three/fiber + drei + postprocessing
  - [ ] 安裝 @react-three/fiber, @react-three/drei
  - [ ] 安裝 three.js 和相關型別定義
  - [ ] 配置 R3F 開發工具和除錯器
  - [ ] 建立基礎 Canvas 和 Scene 組件
  
- [ ] **狀態管理架構**：Zustand + Immer 不可變狀態
  - [ ] 安裝 zustand, immer, zustand/middleware
  - [ ] 建立基礎 store 架構和 slice 結構
  - [ ] 配置 Redux DevTools 整合
  - [ ] 實作狀態持久化機制
  
- [ ] **開發工具配置**：ESLint + Prettier + Git Hooks
  - [ ] 配置 ESLint 規則和 React/TypeScript 檢查
  - [ ] 設置 Prettier 程式碼格式化
  - [ ] 配置 pre-commit hooks 自動檢查
  - [ ] 建立 GitHub Actions CI/CD 流程

> **詳細配置步驟**：參考 [QUICK_START.md](./QUICK_START.md)

### **Phase 2: 狀態管理系統 (Day 4-6)**
**目標**：建立統一的狀態管理架構，為所有組件提供基礎

#### **Zustand 核心架構**
- [ ] **滾動狀態管理**：統一的滾動進度追蹤和區段檢測
  - [ ] 實作 scrollSlice 基礎結構
  - [ ] 建立滾動進度計算邏輯 (0-1 範圍)
  - [ ] 實作區段檢測和切換機制
  - [ ] 整合 ScrollTrigger 與 Zustand 狀態
  - [ ] 建立滾動速度和方向追蹤
  
- [ ] **3D 場景狀態**：相機、載入進度、效能監控
  - [ ] 實作 sceneSlice 相機狀態管理
  - [ ] 建立 3D 資源載入進度追蹤
  - [ ] 實作效能監控 (FPS, 記憶體使用)
  - [ ] 建立場景品質動態調整機制
  - [ ] 實作相機位置和目標狀態管理
  
- [ ] **UI 狀態協調**：導航、側邊欄、主題模式
  - [ ] 遷移現有 UiContext 到 Zustand
  - [ ] 實作 uiSlice 導航和側邊欄狀態
  - [ ] 建立主題模式和使用者偏好管理
  - [ ] 實作響應式斷點狀態管理
  - [ ] 建立載入和錯誤狀態管理
  
- [ ] **專案資料管理**：資料載入、快取、篩選
  - [ ] 實作 dataSlice 專案資料管理
  - [ ] 建立資料載入和快取機制
  - [ ] 實作專案篩選和搜尋功能
  - [ ] 建立資料驗證和錯誤處理
  - [ ] 實作資料預載入策略

> **詳細架構設計**：參考 [analysis-docs/STATE_MANAGEMENT_ANALYSIS.md](./analysis-docs/STATE_MANAGEMENT_ANALYSIS.md)

### **Phase 3: 核心 3D 場景重構 (Day 7-12)**
**目標**：重構最複雜的核心組件，建立 R3F 開發模式

#### **Combined3DScene 拆分重構（最高優先級）**
- [ ] **Reports 圓柱場景**：基於 CodeSandbox 驗證的簡化架構
  - [ ] 建立基礎 ReportsCylinderR3F 組件 (Day 7)
  - [ ] 實作彎曲平面幾何體 BentPlaneGeometry (174行→30行)
  - [ ] 整合圓柱體佈局算法和位置計算
  - [ ] 實作滾動控制和旋轉動畫 (100行→2行)
  - [ ] 測試基本圓柱畫廊功能
  
- [ ] **Innovation 散佈場景**：3D 模型載入和序列控制
  - [ ] 建立 InnovationScene 組件架構 (Day 8)
  - [ ] 實作 GLTF 模型載入系統
  - [ ] 建立動畫混合器管理機制
  - [ ] 實作模型序列控制和聚焦系統
  - [ ] 整合滾動觸發的模型切換
  
- [ ] **場景切換系統**：相機過渡和狀態同步
  - [ ] 實作多階段滾動區間控制 (Day 9)
  - [ ] 建立相機 FOV 動態切換 (120°→45°)
  - [ ] 實作場景顯示/隱藏切換邏輯
  - [ ] 建立 GSAP 角度插值動畫系統
  - [ ] 整合聚光燈跟隨相機系統
  
- [ ] **效能優化實施**：GPU 實例化、記憶體管理
  - [ ] 實作 InstancedMesh 批次渲染 (Day 10-11)
  - [ ] 建立視錐體剔除和 LOD 系統
  - [ ] 實作自動記憶體清理機制
  - [ ] 建立效能監控和動態品質調整
  - [ ] 完整測試和錯誤處理機制 (Day 12)

> **詳細重構方案**：參考 [analysis-docs/COMBINED3D_REFACTOR_ANALYSIS.md](./analysis-docs/COMBINED3D_REFACTOR_ANALYSIS.md)

#### **Reports 圓柱畫廊（極高風險）**
- [ ] **彎曲幾何體重構**：從 174 行手動創建改為 30 行 R3F 組件
  - [ ] 分析現有 createCurvedPlane 複雜邏輯
  - [ ] 實作 R3F BentPlaneGeometry 自定義類別
  - [ ] 驗證彎曲度和 UV 映射正確性
  - [ ] 效能測試和優化調整
  
- [ ] **多媒體支援系統**：圖片 + 影片統一載入管理
  - [ ] 實作智能媒體格式檢測機制
  - [ ] 建立影片 VideoTexture 載入系統
  - [ ] 實作載入錯誤處理和佔位紋理
  - [ ] 建立媒體載入進度追蹤
  
- [ ] **聚光燈跟隨效果**：動態光照與滾動同步
  - [ ] 實作聚光燈動態跟隨當前項目
  - [ ] 建立光錐角度和強度控制
  - [ ] 實作邊緣軟化 penumbra 效果
  - [ ] 整合環境光和方向光系統
  
- [ ] **射線檢測整合**：R3F 原生事件系統
  - [ ] 替換手動射線檢測為 R3F 事件
  - [ ] 實作點擊圖片開啟側邊欄功能
  - [ ] 建立影片播放/暫停控制
  - [ ] 實作懸停游標狀態管理

> **詳細實作分析**：參考 [analysis-docs/REPORTS_THREE_REFACTOR_ANALYSIS.md](./analysis-docs/REPORTS_THREE_REFACTOR_ANALYSIS.md)

### **Phase 4: 特殊挑戰組件 (Day 13-16)**
**目標**：解決最具挑戰性的功能組件

#### **Path 水平滾動（極高風險）**
- [ ] **R3F 滾動系統**：ScrollControls + 3D 場景整合
  - [ ] 實作 R3F ScrollControls 水平滾動 (Day 13)
  - [ ] 建立 1:1 滾動比例控制機制
  - [ ] 實作前後 5% 緩衝區域設計
  - [ ] 整合觸控設備滾動支援
  
- [ ] **3D 照片動畫**：36 張照片的深度動畫優化
  - [ ] 實作照片從遠景到近景移動動畫 (Day 14)
  - [ ] 建立縮放效果 (0→1) 和錯開時序 (0.075s)
  - [ ] 實作最終 Z 軸位置控制 (1500/2000)
  - [ ] 優化 36 張照片的動畫效能
  
- [ ] **效能優化策略**：視錐體剔除、實例化渲染
  - [ ] 實作視錐體剔除減少渲染負擔 (Day 15)
  - [ ] 建立照片 LOD (Level of Detail) 系統
  - [ ] 實作實例化渲染提升效能
  - [ ] 建立低端設備降級方案
  
- [ ] **同步機制建立**：GSAP ScrollTrigger 與 R3F 協調
  - [ ] 整合 GSAP ScrollTrigger 與 R3F useFrame (Day 16)
  - [ ] 建立文字偏移效果同步機制
  - [ ] 實作挑戰標題點擊功能
  - [ ] 完整測試和效能驗證

> **風險評估和解決方案**：參考 [analysis-docs/PATH_REFACTOR_ANALYSIS.md](./analysis-docs/PATH_REFACTOR_ANALYSIS.md)

#### **背景效果系統重構**
- [ ] **BackgroundBlocks R3F 化**：從 DOM 動畫改為 GPU 實例化
  - [ ] 分析現有 BackgroundBlocks 動畫邏輯
  - [ ] 實作 InstancedMesh 支援 1000+ 方塊
  - [ ] 建立生命週期動畫 (appear→stable→disappear)
  - [ ] 實作隨機位置和旋轉效果
  
- [ ] **BackgroundParticles 移除**：清理 OGL 依賴，建立 R3F 替代方案
  - [ ] 完全移除 OGL 依賴和相關程式碼
  - [ ] 建立 R3F 粒子系統替代方案
  - [ ] 實作更高效的 GPU 粒子動畫
  - [ ] 整合統一的背景效果管理
  
- [ ] **Open 序列動畫**：200 個方塊的 3D 序列動畫
  - [ ] 實作 200 個方塊的 3D 序列動畫
  - [ ] 建立複雜的出現時序控制
  - [ ] 實作 SSR 兼容性和客戶端渲染
  - [ ] 整合滾動觸發和狀態管理

> **實作細節**：參考 [analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md](./analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md) 和 [analysis-docs/OPEN_REFACTOR_ANALYSIS.md](./analysis-docs/OPEN_REFACTOR_ANALYSIS.md)

### **Phase 5: UI 系統整合 (Day 17-20)**
**目標**：整合 UI 組件和互動系統

#### **SidePanel 系統整合**
- [ ] **動態內容載入**：contentMap.js 路由系統保持
  - [ ] 保持現有 contentMap.js 路由映射 (Day 17)
  - [ ] 實作動態組件載入機制
  - [ ] 建立內容預載入策略
  - [ ] 整合 Zustand 狀態管理
  
- [ ] **3D 場景協調**：側邊欄開啟時的場景狀態調整
  - [ ] 實作側邊欄開啟時的 3D 場景暫停 (Day 18)
  - [ ] 建立場景模糊或暗化效果
  - [ ] 實作相機狀態保存和恢復
  - [ ] 整合滾動狀態鎖定機制
  
- [ ] **動畫系統統一**：Framer Motion + R3F 動畫協調
  - [ ] 統一 Framer Motion 和 R3F 動畫時序
  - [ ] 建立動畫衝突避免機制
  - [ ] 實作流暢的進入/退出過渡
  - [ ] 整合手勢和觸控操作

> **系統架構分析**：參考 [analysis-docs/SIDEPANEL_REFACTOR_ANALYSIS.md](./analysis-docs/SIDEPANEL_REFACTOR_ANALYSIS.md)

#### **其他 UI 組件重構**
- [ ] **Preloader 系統**：FlipClock + 資源預載整合
  - [ ] 保持 FlipClock 動畫和時序控制 (Day 19)
  - [ ] 整合 3D 資源預載入進度追蹤
  - [ ] 實作可選的 3D FlipClock 增強效果
  - [ ] 建立最小載入時間和隨機延遲機制
  
- [ ] **Support 互動系統**：數字動畫 + 彩帶效果 + 3D 背景
  - [ ] 實作數字計數動畫 (0→7,964) 和進度條
  - [ ] 建立彩帶效果觸發機制和顏色系統
  - [ ] 實作 3D 進度條和浮動數字效果
  - [ ] 整合捐款表單和外部連結功能
  
- [ ] **Feedback 展示系統**：Swiper 替代為 3D 卡片展示
  - [ ] 實作 3D 卡片展示替代 Swiper (Day 20)
  - [ ] 建立 39 則用戶見證的 3D 佈局
  - [ ] 實作中文文字 3D 渲染和可讀性
  - [ ] 建立互動導航和動畫效果

### **Phase 6: 最佳化與測試 (Day 21-22)**
**目標**：確保生產環境品質

#### **效能最佳化**
- [ ] **Bundle 分析與優化**：動態導入、Tree shaking
  - [ ] 使用 webpack-bundle-analyzer 分析包大小 (Day 21)
  - [ ] 實作組件動態導入和程式碼分割
  - [ ] 優化 Tree shaking 移除未使用程式碼
  - [ ] 建立 CDN 資源和靜態資源優化
  
- [ ] **3D 場景效能優化**：LOD 系統、Frustum Culling
  - [ ] 實作 LOD (Level of Detail) 距離控制
  - [ ] 建立視錐體剔除 (Frustum Culling) 系統
  - [ ] 實作物件池 (Object Pooling) 重用機制
  - [ ] 建立自適應品質調整系統
  
- [ ] **記憶體管理優化**：資源清理、垃圾收集
  - [ ] 實作完整的資源清理生命週期
  - [ ] 建立紋理和幾何體記憶體管理
  - [ ] 實作垃圾收集觸發和監控
  - [ ] 建立記憶體洩漏檢測機制
  
- [ ] **響應式效能調整**：不同裝置的品質設定
  - [ ] 建立設備效能檢測和分級系統
  - [ ] 實作高/中/低端設備品質預設
  - [ ] 建立動態品質調整機制
  - [ ] 實作降級方案和 fallback UI

#### **品質保證**
- [ ] **跨瀏覽器測試**：Chrome、Firefox、Safari、Edge
  - [ ] Chrome 最新版本完整功能測試 (Day 22)
  - [ ] Firefox WebGL 兼容性和效能測試
  - [ ] Safari 移動端和桌面端測試
  - [ ] Edge 基本功能和效能驗證
  
- [ ] **設備相容性測試**：桌面、平板、手機
  - [ ] 桌面端高解析度和多螢幕測試
  - [ ] 平板端觸控操作和響應式測試
  - [ ] 手機端效能和基本功能測試
  - [ ] 不同 GPU 和硬體配置測試
  
- [ ] **Lighthouse 分數優化**：目標 90+ 分數
  - [ ] Performance 指標優化 (FCP, LCP, CLS)
  - [ ] Accessibility 無障礙性檢查和修正
  - [ ] Best Practices 最佳實踐檢查
  - [ ] SEO 搜尋引擎優化檢查
  
- [ ] **無障礙測試**：鍵盤導航、螢幕閱讀器
  - [ ] 鍵盤導航完整流程測試
  - [ ] 螢幕閱讀器 (NVDA, JAWS) 兼容性
  - [ ] 色彩對比度和視覺可訪問性
  - [ ] 動畫減少偏好設定支援

---

## 📊 預期改進效果

### **量化指標目標**

| 指標類別 | 現況 | 目標 | 改進幅度 |
|---------|------|------|----------|
| **程式碼品質** |
| 總行數 | 3,500+ 行 | 1,200 行 | **-65%** |
| 最大組件 | 1,374 行 | < 200 行 | **-85%** |
| useRef 數量 | 30+ 個 | < 10 個 | **-70%** |
| **效能指標** |
| FPS 穩定性 | 30-45 FPS | 55-60 FPS | **+50%** |
| 首屏載入 | 3.2s | 1.8s | **-44%** |
| 記憶體使用 | 基準 | -40% | **更輕量** |
| **開發體驗** |
| 新功能開發 | 2-3 天 | 0.5-1 天 | **-70%** |
| Bug 修復時間 | 基準 | -60% | **更快速** |
| 組件復用率 | 30% | 80% | **+150%** |

### **技術債務清理成果**
- **巨無霸組件** → 模組化小組件（可維護性 +400%）
- **混合架構** → 統一 R3F 架構（學習成本 -60%）
- **手動記憶體管理** → 自動資源管理（穩定性 +300%）
- **散佈狀態管理** → Zustand 統一管理（除錯效率 +250%）

---

## 🔧 開發環境與工具

### **專案獨立性**
- **完全獨立運行**：r3f 專案可隨時移出部署
- **原始程式碼參照**：copy/ 資料夾提供對比參考（git ignored）
- **零依賴衝突**：不影響原始專案的任何運行

### **開發工具鏈**
- **TypeScript 嚴格模式**：完整型別檢查和 IntelliSense
- **ESLint + Prettier**：程式碼品質和風格統一
- **R3F Devtools**：3D 場景除錯和效能監控
- **Zustand Devtools**：狀態變化追蹤和時間旅行

### **部署策略**
- **Vercel 零配置部署**：直接連接 Git 自動部署
- **環境變數管理**：開發/生產環境分離
- **效能監控**：Web Vitals 自動追蹤
- **錯誤追蹤**：Sentry 整合（可選）

---

## 🎯 成功關鍵因素

### **技術風險控制**
1. **漸進式重構**：保持每個階段都有可交付成果
2. **雙專案並行**：原版本作為 fallback 保障
3. **效能基準測試**：確保重構不影響用戶體驗
4. **完整測試覆蓋**：自動化測試保證品質

### **團隊協作優化**
1. **模組化開發**：不同開發者可並行開發不同組件
2. **統一架構標準**：所有組件遵循相同的 R3F 模式
3. **詳細文檔支援**：完整的分析文檔和實作指南
4. **程式碼審查機制**：確保品質和一致性

### **用戶體驗保障**
1. **視覺一致性**：確保重構後視覺效果與原版一致
2. **效能優先**：所有重構都以提升效能為目標
3. **無障礙支援**：保持並改善無障礙體驗
4. **跨設備兼容**：確保所有設備都能正常使用

---

## 📚 參考資源

### **核心文檔**
- **[QUICK_START.md](./QUICK_START.md)** - 立即開始開發指南
- **[CLAUDE.md](./CLAUDE.md)** - AI 助手開發規則
- **[analysis-docs/README.md](./analysis-docs/README.md)** - 分析文檔總覽

### **個別組件分析**
- **極高風險**：[COMBINED3D](./analysis-docs/COMBINED3D_REFACTOR_ANALYSIS.md)、[REPORTS_THREE](./analysis-docs/REPORTS_THREE_REFACTOR_ANALYSIS.md)、[PATH](./analysis-docs/PATH_REFACTOR_ANALYSIS.md)
- **中等風險**：[INNOVATION](./analysis-docs/INNOVATION_REFACTOR_ANALYSIS.md)、[PRELOADER](./analysis-docs/PRELOADER_REFACTOR_ANALYSIS.md)、[OPEN](./analysis-docs/OPEN_REFACTOR_ANALYSIS.md)、[SUPPORT](./analysis-docs/SUPPORT_REFACTOR_ANALYSIS.md)
- **低風險**：[CALLTOACTION](./analysis-docs/CALLTOACTION_REFACTOR_ANALYSIS.md)、[FEEDBACK](./analysis-docs/FEEDBACK_REFACTOR_ANALYSIS.md)
- **系統整合**：[STATE_MANAGEMENT](./analysis-docs/STATE_MANAGEMENT_ANALYSIS.md)、[SIDEPANEL](./analysis-docs/SIDEPANEL_REFACTOR_ANALYSIS.md)

---

---

## 📈 開發紀錄

### **2025-06-24 技術可行性驗證完成**
- **時間**: 2025-06-24 16:30 (台北時間)
- **狀態**: ✅ 技術可行性驗證成功
- **成果**: 完整的 6 個 Section 雛形，統一 3D 場景架構正常運行
- **伺服器**: http://localhost:3001 正常啟動
- **驗證項目**:
  - ✅ 統一 3D 場景架構 (單一 Canvas + DOM 觸發器)
  - ✅ 滾動控制相機移動系統
  - ✅ Modal 互動系統
  - ✅ 6 個 Section 基礎雛形實作
  - ✅ Zustand 狀態管理整合
  - ✅ R3F + GSAP 動畫系統

---

## 🔧 修復紀錄 - Carousel 旋轉問題 (2025-06-24 19:45)

### 問題描述
- ReportsSection 的 Carousel slider 沒有跟著捲動進度旋轉
- 滾動觸發器正常運作，但 3D 旋轉效果不明顯

### 修復措施
1. **增加旋轉範圍**: 從 1 圈增加到 3 圈 (Math.PI * 2 * 3)
2. **提升響應速度**: 有滾動時 lerp 速度從 0.1 提升到 0.3
3. **優化除錯輸出**: 減少不必要的 console 輸出，提升效能
4. **修復 Canvas 事件**: 將 pointer-events-none 改為 pointer-events-auto

### 預期效果
- Carousel 旋轉更明顯且即時響應
- 滾動體驗更流暢
- 除錯資訊更清楚且不影響效能

---
*最後更新：2025-06-24 19:45 (台北時間) - Carousel 旋轉問題修復完成*  
*重構目標：現代化 R3F 架構 + 85% 程式碼簡化*  
*當前狀態：技術可行性驗證完成 ✅*