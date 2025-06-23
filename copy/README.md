# 報導者十週年回顧網站

這是一個使用 [Next.js](https://nextjs.org) 建立的互動式網站專案，展示報導者十年來的影響力報導、創新歷程與成就。

## 🚀 快速開始

首先，啟動開發伺服器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打開 [http://localhost:3000](http://localhost:3000) 即可在瀏覽器中檢視結果。

## 📁 專案架構

### 核心目錄結構

```
10th-recap/
├── src/app/                   # Next.js App Router 主要目錄
│   ├── components/            # 可重用 UI 組件
│   ├── section/               # 頁面區塊組件
│   ├── context/               # React Context 狀態管理
│   ├── hooks/                 # 自定義 React Hooks
│   ├── data/                  # 靜態資料文件
│   ├── sidepanel-contents/    # 側邊欄內容組件
│   ├── utils/                 # 工具函數與輔助模組
│   ├── globals.css            # 全域樣式
│   ├── layout.js              # 根佈局組件
│   ├── page.js                # 首頁組件
│   └── not-found.js           # 404 錯誤頁面
├── public/                    # 靜態資源目錄
│   └── assets/                # 圖片、圖標等素材
├── archive/                   # 封存的舊版本檔案
├── scripts/                   # 工具腳本
└── 配置文件                    # 各種設定檔案
```

### 🧩 組件架構詳解

#### `/src/app/components/` - 通用 UI 組件
- **`Navigation.jsx`** - 主導航欄組件，包含響應式選單與平滑滾動功能
- **`SidePanel.jsx`** - 側邊欄組件，用於顯示專案詳細資訊
- **`SectionIntro.jsx`** - 區塊介紹組件，統一的標題與描述樣式
- **`BackgroundParticles.jsx`** - 背景粒子效果組件
- **其他工具組件** - `BackButton.jsx`、`InfoContainer.jsx` 等

#### `/src/app/section/` - 頁面區塊組件
- **`Preloader.jsx`** - 頁面載入動畫
- **`Reports.jsx`** - 3D 輪播展示影響力報導
- **`Innovation.jsx`** - 多元創新展示區塊
- **`Path.jsx`** - 非營利之路時間軸
- **`Feedback.jsx`** - 支持者證言展示
- **`Support.jsx`** - 支持我們行動呼籲
- **`CallToAction.jsx`** - 包裝行動呼籲區塊的容器

#### `/src/app/context/` - 狀態管理
- **`UiContext.js`** - 全域 UI 狀態管理，控制：
  - 背景色彩過渡
  - 側邊欄開關狀態
  - 預載動畫狀態

#### `/src/app/hooks/` - 自定義 Hooks
- **`useScrollManager.js`** - 滾動狀態管理，控制：
  - 導航欄顯示/隱藏
  - 暗色模式切換
  - 滾動方向偵測
- **`/gsap/`** - GSAP 動畫相關 Hooks

#### `/src/app/data/` - 資料管理
- **`projects.json`** - 專案資料庫，包含：
  - 影響力報導資訊
  - 創新專案資料
  - 背景色彩配置

#### `/src/app/sidepanel-contents/` - 側邊欄內容
- **`/projects/`** - 專案專屬的側邊欄內容
- **`/shared/`** - 共用的側邊欄組件

#### `/src/app/utils/` - 工具函數與輔助模組
- **`materialUtils.js`** - 材質配置相關工具函數

### 🎨 技術特色

#### 1. **響應式設計**
- 使用 Tailwind CSS 建構
- 客製化色票系統（red-10 到 red-90 等）
- 移動端優先的設計理念

#### 2. **動畫與互動**
- GSAP ScrollTrigger 實現滾動動畫
- 3D 視覺效果與粒子系統
- 平滑的顏色過渡效果

#### 3. **效能優化**
- Next.js App Router 架構
- 組件懶載入
- 圖片優化與壓縮

#### 4. **狀態管理**
- React Context 全域狀態
- 自定義 Hooks 封裝邏輯
- 統一的滾動與 UI 管理

### 🛠 開發工具與腳本

```bash
npm run dev          # 開發模式
npm run dev:fast     # Turbo 模式開發
npm run dev:clean    # 清除快取後啟動
npm run build        # 建構生產版本
npm run start        # 啟動生產伺服器
npm run lint         # 程式碼檢查
npm run lint:fix     # 自動修復程式碼問題
```

### 📦 主要依賴套件

- **Next.js 15** - React 框架
- **React 19** - UI 函式庫
- **Tailwind CSS** - CSS 框架
- **GSAP** - 動畫函式庫
- **Three.js & React Three Fiber** - 3D 圖形
- **Canvas Confetti** - 慶祝動畫效果

### 🗃 Archive 目錄說明

`/archive/` 目錄保存了開發過程中的舊版本檔案：
- **`unused-components/`** - 未使用的組件
- **`data/`** - 舊版資料檔案
- **`garage/`** - 實驗性功能
- **`dragon/`** - 特殊效果相關檔案

### 🎯 特殊功能

1. **智慧滾動管理** - 根據滾動方向自動顯示/隱藏導航欄
2. **動態背景色彩** - 依據內容區塊自動調整頁面背景色
3. **雙向滾動支援** - 支援向上與向下滾動的完整體驗
4. **404 頁面** - 具備倒數計時與自動跳轉功能
5. **側邊欄系統** - 彈性的內容展示系統

### 🎮 3D動畫支援與壓縮解密

#### 最新更新 (v2025.06.04)

**3D 模型動畫播放**
- 自動檢測並播放 GLB 文件中的動畫
- AnimationMixer 系統管理多個動畫軌道
- 循環播放與效能優化的動畫更新機制

**Draco 壓縮支援**
- 整合 DRACOLoader 支援 Google Draco 壓縮格式
- 使用官方 CDN 解碼器 (v1.5.6) 確保相容性
- 大幅減少 3D 模型檔案大小，提升載入效能

**材質配置系統**
- 模組化材質管理系統 (`/src/app/utils/materialUtils.js`)
- 支援 JSON 配置和預設材質模板
- 彈性的材質屬性設置（發光、金屬度、粗糙度等）

**即時陰影渲染**
- 啟用 WebGL 陰影映射技術，提供真實的光影效果
- 使用 PCF 軟陰影算法，呈現平滑的陰影邊緣
- 優化陰影相機範圍與解析度，平衡視覺效果與效能
- 自動為所有 3D 模型設置投射與接收陰影屬性

**技術實作**
```javascript
// 支援 Draco 壓縮的 GLB 載入
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(dracoLoader);

// 動畫系統
const mixer = new THREE.AnimationMixer(model);
gltf.animations.forEach(clip => mixer.clipAction(clip).play());

// 材質配置應用
const materialConfig = modelData.material || defaultMaterialConfigs[modelData.id];
applyMaterialConfig(model, materialConfig);

// 陰影系統設置
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512); // 平衡質量與效能
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.bias = -0.0005;
```

**材質配置範例**
```json
// projects.json 中的材質設定
{
  "id": "innovation-2",
  "material": {
    "emissive": "#0066ff",
    "emissiveIntensity": 0.2,
    "metalness": 0.8,
    "roughness": 0.2
  }
}
```

---

**開發團隊：報導者 The Reporter**  
