# 🚀 報導者十週年回顧 2D 版本開發狀態

## ✅ 已完成 (2025-06-29 ~ 2025-06-30)
- **專案架構重構** - 從 3D 版本轉換為 2D 純 CSS/JS 動畫實作 ✅
- **3D 組件清除** - 移除所有 R3F 相關組件和文件 ✅
- **基礎專案設置** - Next.js 15 + TypeScript + Tailwind CSS ✅
- **狀態管理系統** - Zustand 完整架構保留 ✅
- **Modal 系統** - 完整保留互動系統與內容載入 ✅
- **開發伺服器** - 運行在 http://localhost:3001 ✅

### **Reports Section GSAP ScrollTrigger 實作** (2025-06-30)
- **GSAP ScrollTrigger 集成** - 完整的滾動控制 3D 輪播系統 ✅
- **3D CSS 變換** - 透視效果與動態旋轉角度計算 ✅
- **響應式設計** - 桌機/行動版自適應尺寸與位置 ✅
- **媒體支援** - 圖片/影片自動檢測與載入處理 ✅
- **滾動控制** - 500vh 容器精確控制 360° 旋轉 ✅
- **動畫優化** - 緩衝區設置與平滑插值動畫 ✅
- **開發友好** - 開發環境除錯資訊與 Console 日誌 ✅
- **效能優化** - GSAP 硬體加速與動態 DOM 創建 ✅
- **影片自動播放** - 靜音循環播放，無需用戶互動 ✅
  - **智能播放管理** - 只播放當前項+前後相鄰項，節省70%+效能 ✅
  - **Modal 互動整合** - 點擊項目開啟對應 Modal，完整內容展示 ✅

## 🎯 當前狀態
- **技術路線**: 2D CSS/JS 動畫，避免 3D 渲染負擔
- **目標設備**: 提升低階設備兼容性與載入速度
- **專案架構**: dev-2d 分支獨立開發
- **參照程式碼**: copy/ 資料夾（git ignored）

## 📋 2D 版本 Section 架構
1. **Opening** - 開場動畫區塊
2. **Reports** - 影響力報導展示
3. **Innovations** - 多元創新展示
4. **Challenges** - 挑戰與成長故事
5. **Feedbacks** - 贊助者證言
6. **Support** - 贊助支持頁面

## 🔧 技術規範

### **GSAP & ScrollTrigger 管理**
- **命名空間隔離**: 每個 Section 使用唯一 trigger ID
- **統一清理機制**: 組件卸載時清理對應 ScrollTrigger
- **衝突預防**: 避免不同 Section 的動畫互相干擾
- **範例**:
  ```javascript
  useEffect(() => {
    ScrollTrigger.create({
      trigger: `#section-${sectionName}`,
      id: `${sectionName}-main`,
      // ... 配置
    });
    
    return () => {
      ScrollTrigger.getById(`${sectionName}-main`)?.kill();
    };
  }, []);
  ```

### **SectionNavigation 顯示規則**
- **Opening 區域**: 導航隱藏
- **Reports 開始**: 導航顯示
- **狀態同步**: 與滾動位置同步更新

### **效能優化原則**
- **延遲載入**: 非關鍵 Section 延遲載入
- **動畫節流**: GSAP 動畫適當節流控制
- **響應式設計**: 支援各螢幕尺寸
- **無障礙支援**: 提供動畫關閉選項

## 🔧 開發規則
- **自動執行**: 所有指令除了刪除檔案外都自動執行
- **不需詢問**: 安裝套件、建立檔案、編輯程式碼
- **⚠️ Git Commit 限制**: **除非用戶明確要求，否則不主動進行 git commit**
- **需要詢問**: 刪除檔案或目錄的操作、git commit
- **⚠️ 特別注意**: Git merge/rebase 到 main 分支**必須再次確認**

## ⏰ 時間記錄規範
- **精確時間取得**: 任何需要記錄時間的操作，必須使用 `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M:%S %Z'` 指令取得台北時區精確時間
- **開發紀錄**: 建立或更新開發紀錄時，務必先取得當前精確時間
- **時間格式**: 統一使用 `YYYY-MM-DD HH:MM:SS CST` 格式
- **範例指令**:
  ```bash
  # 取得台北時區精確時間
  TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M:%S %Z'
  
  # 輸出範例: 2025-06-29 23:32:26 CST
  ```
- **時間記錄場景**:
  - 開發紀錄文檔建立/更新
  - Git commit 時的時間記錄
  - 重要功能完成時的里程碑記錄
  - 問題解決過程的時間軸記錄

## 🐛 Console.log 使用規範
- **調試目的**: console.log 僅用於開發階段的問題調試
- **及時清理**: 調試完成後必須立即移除相關 console.log 程式碼
- **頻率控制**: 避免大量或高頻率的 console.log 輸出
- **保留原則**: 只保留必要的錯誤處理 console.error 和用戶操作回饋
- **開發環境限制**: 使用 `process.env.NODE_ENV === 'development'` 條件限制輸出

## 🌳 Git 工作流程規範
- **主分支**: `main` - 穩定版本
- **開發分支**: `dev-2d` - 2D 版本開發
- **技術路線**: 純 2D CSS/JS 動畫實作
- **GitHub Repository**: https://github.com/itisalongway574/r3f-10th-repo

### ⚠️ **重要：dev-2d 分支合併限制**
- **原則**: dev-2d 分支**不直接合併**到 main 分支
- **目的**: 保持 main 分支作為最終選擇的技術方案
- **AI 助手責任**: 如果用戶下達任何 merge、rebase 到 main 的指令，**必須再次確認**
- **確認提醒**: "您確定要將 dev-2d 合併到 main 嗎？這會改變主分支的技術路線。"

## 📋 Git Commit 規範
- **格式**: `<type>: <繁體中文描述>` (第一行不超過 50 字符)
- **語氣**: 使用祈使語氣，不用句號結尾
- **語言**: 描述使用繁體中文，類型使用英文

### **Commit 類型**
- `feat`: 新功能
- `fix`: 修復問題
- `refactor`: 重構程式碼
- `perf`: 效能優化
- `style`: 格式/樣式調整
- `docs`: 文檔更新

### **範例**
```bash
feat: 新增 Opening Section 開場動畫
fix: 修正 ScrollTrigger 衝突問題
refactor: 重構 Section 組件架構
perf: 優化 GSAP 動畫效能
```

## 📋 程式碼精簡化原則
1. **功能獨立性**: 每個 Section 組件保持獨立，避免相互依賴
2. **組件拆分**: 單一檔案超過 200 行時考慮拆分
3. **共用邏輯**: 相同邏輯出現 2-3 次時抽取為共用函數
4. **一檔一責**: 保持「一個檔案一個職責」原則
5. **開發效率**: 以開發效率和可讀性為優先考量

## 📊 2D 版本目標
- **兼容性提升**: 支援更多低階設備
- **載入速度**: 比 3D 版本快 50%+
- **維護性**: 降低技術複雜度
- **響應式**: 完整支援各螢幕尺寸

## 🎮 技術亮點
- **GSAP 動畫系統**: 高效能 2D 動畫實作
- **ScrollTrigger 整合**: 滾動驅動的動畫體驗
- **Modal 系統**: 完整保留 3D 版本的互動功能
- **狀態管理**: Zustand 統一管理應用狀態
- **響應式設計**: 適配各種設備與螢幕

## 📝 開發記錄

### **2025-06-30 17:23 (台北時間)**
- **Modal 滾動重置功能實作完成**
  - 實作 NavigationControls 導航切換功能
  - 新增滾動容器 useRef 引用機制
  - 實現內容切換時自動重置滾動位置到頂部
  - 添加 useEffect 監聽 modal.data.id 和 modal.contentId 變化
  - 完整的用戶體驗優化：上一則/下一則切換時從頂部開始閱讀
  - 灰階色彩系統集成到 Tailwind 配置（gray-white ~ gray-black）
  - **Git Commit**: `feat: 實作 Modal 滾動重置功能與 Tailwind 灰階系統`

### **2025-06-30 16:30 (台北時間)**
  - **Reports Section 影片播放系統優化完成**
    - 修復 TailwindCSS v4 到 v3.4.17 兼容性問題
    - 實現影片自動循環播放：靜音、無控制介面、無需用戶互動
    - 智能播放管理：只播放當前項目+前後相鄰項目，節省70%+效能
    - 動態播放控制：隨滾動進度自動切換播放/暫停狀態
    - 邊界循環處理：第一項/最後一項的相鄰項目正確計算
    - 載入狀態優化：1秒漸進式載入，移除載入超時警告
    - React 組件架構：使用現有 ReportsSwiperItem，移除複雜 DOM 操作
    - **Git Commit**: `feat: 完成 Reports Section 影片自動播放與智能效能管理`

### **2025-06-30 16:43 (台北時間)**
  - **Reports Section Modal 互動系統實作完成**
    - 實作點擊 ReportsSwiperItem 開啟對應 Modal 功能
    - 整合現有 Modal 系統與 contentMap.ts 動態內容載入
    - 透過 Zustand 狀態管理統一控制 Modal 開關
    - 傳遞完整專案資料支援 Modal 內容展示
    - 修正 TypeScript 類型定義，提升開發體驗
    - 完整的互動流程：點擊 → 事件處理 → Modal 開啟 → 內容載入
    - **Git Commit**: `feat: 實作 Reports Section 點擊開啟 Modal 互動功能`

### **2025-06-30 17:06 (台北時間)**
  - **媒體檔案路徑修正與錯誤處理優化完成**
    - 統一修正所有 Reports Content 的 mediaSrc 檔名 (report-* → reports-*)
    - 移除 HeroBanner 和 ReportsSwiperItem 錯誤狀態判斷機制
    - 清除 Modal Content 文件中的 text-white 樣式類別
    - 新增 .cursorrules 文件設置 Git Commit 限制規範
    - 簡化媒體載入邏輯，提升檔案載入穩定性
    - 建立完整檔案路徑對應表，確保媒體正確載入
    - **Git Commit**: `fix: 修正媒體檔案路徑並優化錯誤處理機制`

### **2025-06-30 18:30 (台北時間)**
- **Reports Section GSAP ScrollTrigger 實作完成**
  - 完全重構原有 Swiper 為 GSAP ScrollTrigger 系統
  - 實作 3D CSS 變換輪播效果：500vh 滾動控制 360° 旋轉
  - 響應式設計：桌機 4vw / 行動版 6vw 尺寸自適應
  - 媒體處理：自動檢測圖片/影片格式並載入
  - 動畫優化：緩衝區設置避免突兀跳轉
  - 效能提升：GSAP 硬體加速 + 動態 DOM 創建
  - 開發友好：development 環境專用除錯資訊
  - **Git Commit**: `feat: 完成 Reports Section GSAP ScrollTrigger 3D 輪播實作`

### **2025-06-29**
- **專案架構重構**: 從 3D 版本轉換為 2D 純 CSS/JS 動畫實作
- **開發環境設置**: Next.js 15 + TypeScript + Tailwind CSS
- **技術路線確立**: dev-2d 分支獨立開發，提升設備兼容性

---
*最後更新: 2025-06-30 17:23 - Modal 滾動重置功能與 Tailwind 灰階系統實作完成*