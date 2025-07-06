# 📋 Dev-2D 開發紀錄

## 🎯 專案轉型說明
從 React Three Fiber (R3F) 3D 網站架構轉型為 2D CSS/JS 動畫實作，目標提升設備兼容性與載入效能。

---

## 📅 2025-06-29 開發紀錄

### ⏰ 19:00-20:00 專案架構重構
**任務**: 清除 R3F 相關組件，建立 2D 架構基礎

**刪除的檔案**:
- `src/components/Scene.tsx`
- `src/components/unified-scene/` 整個目錄
- `src/components/innovation-section/` 整個目錄  
- `src/components/reports-section/` 整個目錄
- `src/components/material-system/` 整個目錄
- `src/utils/materialUtils.ts`
- 其他 3D 相關工具函數

**保留的系統**:
- Modal 系統 (`src/components/Modal.tsx` + `modal/` 子目錄)
- Zustand 狀態管理 (`src/stores/`)
- UI 組件庫 (`src/components/ui/`)
- Navigation 系統

### ⏰ 20:00-20:30 文檔重寫
**更新檔案**:
- `CLAUDE.md`: 移除 3D 技術說明，加入 2D 開發原則
- `README.md`: 更新專案描述與技術堆疊
- `QUICK_START.md`: 重寫快速開始指南
- 加入分支保護警告：dev-2d 不得直接合併到 main

### ⏰ 20:30-21:30 Section 組件建立
**建立 6 個 Section 組件**:
1. `src/components/sections/opening/OpeningSection.tsx`
2. `src/components/sections/reports/ReportsSection.tsx`
3. `src/components/sections/innovations/InnovationsSection.tsx`
4. `src/components/sections/challenges/ChallengesSection.tsx`
5. `src/components/sections/feedbacks/FeedbacksSection.tsx`
6. `src/components/sections/support/SupportSection.tsx`

**技術實作**:
- 每個 Section 統一使用 `bg-white text-black` 樣式
- 高度設定為 `h-screen` 確保全螢幕顯示
- GSAP ScrollTrigger 整合準備

### ⏰ 21:30-22:30 ScrollTrigger 系統實作
**建立 `src/hooks/useScrollTrigger.ts`**:
- 解決 "context is not a function" 初始化錯誤
- 實作異步 GSAP 載入機制
- 加入適當的清理函數避免記憶體洩漏
- 支援自訂觸發點與延遲設定

**主頁面重構 `src/app/page.tsx`**:
- 移除所有 R3F 相關 import
- 移除 3D Scene 組件
- 加入 6 個 Section 組件
- 加入 GSAP 全域初始化邏輯

### ⏰ 22:30-23:00 Navigation 簡化
**問題**: 用戶反映不需要 Navigation 隱藏機制
**解決**: 完全移除所有 show/hide 條件邏輯，簡化為永遠顯示的固定導航

**Navigation.tsx 最終版本**:
```tsx
const Navigation = () => {
  return (
    <div className="w-full fixed top-4 right-auto left-auto flex justify-center items-center z-[9999] text-black">
      <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
        <img className="h-10 w-auto" src="/assets/nav_logo--light.svg" alt="Logo" />
      </div>
    </div>
  );
};
```

### ⏰ 23:00-23:30 滾動偵測問題修復
**問題**: SectionNavigation 在快速滾動時顯示錯誤的當前區塊
**原因**: 缺少雙向滾動偵測 (`onEnterBack` callback)

**解決方案**:
- 在 `useScrollTrigger.ts` 加入 `onEnterBack` 處理
- 調整觸發點為 "top 80%" / "bottom 20%" 提升精確度
- 加入開發環境除錯 console.log

**更新後的觸發器配置**:
```typescript
ScrollTrigger.create({
  trigger: `#${sectionId}`,
  start: "top 80%",
  end: "bottom 20%",
  onEnter: () => setCurrentSection(sectionName),
  onEnterBack: () => setCurrentSection(sectionName),
});
```

---

## 🔧 技術細節

### ScrollTrigger 整合策略
- **異步載入**: 避免 SSR 問題
- **命名空間**: 每個 Section 獨立的 ScrollTrigger ID
- **清理機制**: useEffect cleanup 確保無記憶體洩漏
- **延遲執行**: 200ms 延遲確保 GSAP 正確註冊

### 狀態管理保留
- **currentSection**: 追蹤當前顯示的 Section
- **Modal 系統**: 完整保留所有 Modal 功能
- **Navigation**: 簡化為純 UI 展示，移除所有邏輯

### 設計原則統一
- **顏色統一**: 所有 Section 使用 `bg-white text-black`
- **高度統一**: 所有 Section 使用 `h-screen`
- **字體統一**: 保持現有 Tailwind CSS 設定

---

## ⚠️ 重要注意事項

1. **分支保護**: dev-2d 分支不得直接合併到 main，需經過確認
2. **Console.log 清理**: 開發完成後需移除除錯訊息
3. **效能目標**: 2D 版本須達到比 3D 版本更好的效能表現
4. **響應式設計**: 確保在各種設備上的顯示效果

---

## 📊 開發狀態統計
- **檔案刪除**: ~20 個 3D 相關檔案
- **檔案新增**: 7 個新組件 (6 Section + 1 Hook)
- **檔案修改**: 4 個核心檔案 (page.tsx, Navigation.tsx, SectionNavigation.tsx, 各文檔)
- **程式碼行數**: 從 3,500+ 行縮減至約 800 行
- **載入時間**: 預期提升 60%+ (移除 R3F 依賴)

---

## 📅 2025-06-30 開發紀錄

### ⏰ 16:43 Reports Section Modal 互動系統實作
**任務**: 實作點擊 ReportsSwiperItem 開啟對應 Modal 功能

**主要修改**:
- **ReportsSwiperItem.tsx**: 
  - 新增 `projectData` 屬性接收完整專案資料
  - 導入 `useStore` 進行狀態管理
  - 實作 `handleClick` 點擊事件處理器
  - 呼叫 `openModal(id, projectData)` 開啟對應 Modal
- **ReportsSwiper.tsx**:
  - 傳遞完整 `item` 資料到 `ReportsSwiperItem`
  - 修正 `subtitle` 為可選屬性，解決 TypeScript 類型錯誤
  - 加入安全檢查 `item.subtitle || ''`

**技術整合**:
- 使用現有的 Modal 系統 (`src/components/Modal.tsx`)
- 透過 `contentMap.ts` 動態載入對應的內容組件
- Zustand 狀態管理：`openModal` 方法統一管理 Modal 狀態
- 完整的 Reports 1-12 內容組件支援

**互動流程**:
1. 用戶點擊 ReportsSwiperItem
2. 觸發 `handleClick` 事件處理器
3. 呼叫 `openModal` 傳遞項目 ID 和完整資料
4. Modal 系統根據 ID 從 `contentMap` 載入對應組件
5. 顯示完整的報導內容和互動功能

---

## 📅 2025-06-30 開發紀錄

### ⏰ 17:06 媒體檔案路徑修正與錯誤處理優化
**任務**: 修正所有媒體檔案路徑問題並優化錯誤處理機制

**主要修改**:
- **媒體檔案路徑統一**: 
  - 修正所有 Reports Content 文件的 `mediaSrc` 檔名
  - 統一格式：`report-*` → `reports-*` (對應實際 assets 檔案)
  - 涵蓋 Reports 1-12 共 12 個內容文件
- **錯誤處理機制簡化**:
  - 移除 `HeroBanner.tsx` 和 `ReportsSwiperItem.tsx` 的錯誤狀態判斷
  - 刪除 `mediaError`, `hasError` 狀態管理
  - 移除錯誤 UI 顯示組件
  - 簡化為純媒體類型判斷（影片/圖片）
- **樣式清理**:
  - 移除所有 Modal Content 文件中的 `text-white` 樣式類別
  - 保持 `space-y-4` 間距樣式
- **開發規範建立**:
  - 新增 `.cursorrules` 文件
  - 設置 Git Commit 限制規範
  - 禁止擅自 git commit 的安全機制

**技術優化**:
- 載入邏輯簡化：只處理成功載入，不處理失敗狀態
- 檔案路徑對應：根據 `/public/assets/` 實際檔名修正
- 效能提升：移除不必要的錯誤處理代碼
- 開發安全：防止意外 commit 操作

**檔案對應表**:
```
reports-1.jpg (2.9MB)   → Reports1Content.tsx
reports-2.mp4 (20MB)    → Reports2Content.tsx  
reports-3.mp4 (11MB)    → Reports3Content.tsx
reports-4.jpg (330KB)   → Reports4Content.tsx
reports-5.jpg (122KB)   → Reports5Content.tsx
reports-6.jpg (493KB)   → Reports6Content.tsx
reports-7.mp4 (13MB)    → Reports7Content.tsx
reports-8.mp4 (21MB)    → Reports8Content.tsx
reports-9.jpg (128KB)   → Reports9Content.tsx
reports-10.jpg (457KB)  → Reports10Content.tsx
reports-11.png (2.8MB)  → Reports11Content.tsx
reports-12.mp4 (14MB)   → Reports12Content.tsx
```

---

## 📅 2025-07-01 開發紀錄

### ⏰ 16:20 CustomCursor 客製化游標系統完成
- **全域客製化游標組件**：支援多種預設樣式和完全自定義配置
- **預設樣式配置**：explore、view、read、play 四種內建樣式
- **自定義配置支援**：data-cursor-text 和 data-cursor-class 屬性
- **嵌套元素支援**：任何深度的 DOM 嵌套都能正確觸發
- **動態切換機制**：可在不同區域使用不同游標樣式
- **原始游標隱藏**：徹底解決 cursor: none 隱藏問題
- **效能優化**：單一全域監聽器，無副作用設計
- **完整文檔**：CustomCursor.md 詳細使用說明
- **Reports Section 整合**：EXPLORE 游標效果完美運作

### ⏰ 11:42 Modal 系統互動體驗優化完成
- **GSAP 開啟/關閉動畫**：opacity 0.5→1、scale 0.25→1、rotateY 90°→0°
- **3D 透視效果**：transformPerspective 500px 增強視覺深度
- **滾動進度條**：紅色進度條即時顯示滾動位置
- **Overscroll 關閉機制**：滾動超過 100vh 觸發 Modal 關閉
- **圓環進度指示器**：SVG stroke-dasharray 技術顯示 overscroll 進度
- **背景點擊關閉**：修復事件冒泡問題，確保點擊背景正常關閉
- **Reset 機制優化**：調整重置時間為 200ms，符合用戶體驗需求
- **動畫數據快照**：防止關閉動畫期間內容消失，保持視覺連續性

### ⏰ 17:04 ChallengesSection 水平滾動系統完成
- **React 組件架構**：完全基於 React/TypeScript 實作，取代原始 DOM 操作
- **GSAP ScrollTrigger 整合**：水平滾動 + 背景照片 3D 動畫同步
- **模組化設計**：拆分為 ChallengesSlider、ChallengeItem、ChallengesBackground 等組件
- **Hook 系統**：useChallengesData 和 useChallengesScroll 分離邏輯
- **配置系統**：challenges.config.ts 集中管理照片位置與滾動參數
- **容器高度修正**：動態高度計算 + sticky positioning 架構
- **Modal 整合**：點擊挑戰項目開啟對應 Modal 內容
- **CustomCursor 支援**：VIEW 游標樣式整合
- **動畫同步**：文字水平滾動與背景照片 3D 變換完美同步
- **效能優化**：緩衝區設置與漸進式動畫避免突兀跳躍

---

## 📅 2025-07-04 開發紀錄

### ⏰ 17:54 InnovationsSection 3D 深度動畫系統與效能優化完成
**任務**: 實作 InnovationsSection 完整的 3D 深度動畫系統與效能優化機制

**主要功能實作**:
- **3D 深度動畫系統**：
  - 基於滾動進度的 Z 軸深度變化動畫
  - 物件從 -400vw 到 +200vw 的流暢移動
  - 透明度、模糊效果、縮放的漸進式變化
  - 錯位佈局系統：5x3 網格隨機分布效果
- **效能優化機制**：
  - `usePerformanceMonitor` 即時 FPS 監控
  - 低效能模式自動切換（FPS < 30）
  - `useIntersectionObserver` 可見性偵測
  - `useOptimizedMouseTracking` RAF 節流滑鼠追蹤
- **分層漸進式載入**：
  - 基於 SectionHeadings 可見性提前觸發 3D
  - 避免可見的 2D→3D 切換跳躍
  - 動畫分階段啟用，減少初始載入壓力
- **滑鼠追蹤 perspectiveOrigin**：
  - 動態透視中心點控制（40%-60% 範圍）
  - 16ms RAF 節流確保流暢度
  - 低效能時自動停用節省資源

**技術亮點**:
- **GSAP 元素快取**：避免重複 DOM 查詢
- **批次動畫操作**：降低渲染開銷
- **自適應動畫品質**：根據設備效能調整動畫複雜度
- **記憶體管理**：完整的 cleanup 機制

### ⏰ 17:54 Opening 照片動畫與 Navigation 同步系統完成
**任務**: 實作 Opening 照片與 Navigation LOGO 移動同步的淡出動畫

**核心功能**:
- **全域照片引用系統**：`openingPhotosRef` 跨組件共享
- **同步動畫控制**：Navigation ScrollTrigger onUpdate 回調
- **動態位置計算**：從原始位置線性插值到 -100%
- **淡出效果**：透明度從 1 到 0 同步變化
- **效能優化**：動畫完成後設定 visibility: hidden

**技術實作**:
- 導出 `photosData` 供 Navigation 組件使用
- ScrollTrigger 進度映射到照片位置變化
- 確保照片在正確狀態後觸發動畫

### ⏰ 17:54 滑鼠追蹤透視系統整合完成
**任務**: 將滑鼠控制 perspectiveOrigin 機制整合到 Reports 和 Innovations Section

**實作範圍**:
- **ReportsSwiper.tsx**：
  - 新增 `useOptimizedMouseTracking` 和 `useIntersectionObserver`
  - 動態 perspectiveOrigin 控制 3D 輪播透視
  - 範圍設定：40%-60%，避免極端透視角度
- **InnovationsSection.tsx**：
  - 完整的滑鼠追蹤 perspectiveOrigin 系統
  - 效能適應：低效能時自動停用
  - 參數註解：詳細說明每個配置的意義

**技術參數**:
- `enabled`: 客戶端已載入且章節可見時才啟用
- `throttleMs`: 16ms (約60fps) 更新頻率
- `rangeMin/Max`: 40%-60% 範圍避免極端透視角度

### ⏰ 17:54 章節導航系統與 ID 命名一致性完成
**任務**: 實作 NextSectionButton 跳轉功能並統一所有 Section ID 命名

**NextSectionButton 功能**:
- **智能顯示邏輯**：只在 Reports、Innovations、Challenges 三個 Section 顯示
- **自動跳轉映射**：
  - Reports → Innovations
  - Innovations → Challenges  
  - Challenges → Feedbacks
- **UI 設計**：右下角圓形按鈕，向下箭頭圖示
- **懸停效果**：縮放、顏色變化、提示文字

**ID 命名一致性修正**:
- **統一格式**：所有 Section 使用 `section-{name}` 格式
- **ChallengesSection 修正**：
  - ID: `challenges-section` → `section-challenges`
  - `useChallengesScroll` ScrollTrigger 觸發器同步更新
  - 所有 querySelector 選擇器同步修正
- **跳轉功能驗證**：SectionNavigation 和 NextSectionButton 正常跳轉

**解決的問題**:
- 修正突圍按鈕無法跳轉的問題
- 確保跳轉定位到 SectionHeadings 位置
- 恢復 ChallengesSection 背景照片動畫功能
- 修正水平滾動項目順序問題

**技術成果**:
- 完整的章節間導航體驗
- 一致的命名規範
- 穩定的滾動動畫系統
- 良好的用戶體驗流程

---

## 📅 2025-07-07 開發紀錄

### ⏰ 03:07:33 CST OpeningSection 照片動畫系統重構
**任務**: 統一照片數據結構並實現完整的 3D 立方體照片動畫系統

**主要改進**:
- **數據結構統一**: 
  - 將所有面的照片數據統一使用 `top/right` 參數管理
  - 移除 `left` 參數，簡化定位系統
  - 更新 `PhotoData` 類型定義為統一結構
- **動畫方向優化**:
  - 左面照片：從右方飛入中央
  - 右面照片：從左方飛入中央
  - 上面照片：從上方飛入中央
  - 下面照片：從下方飛入中央
- **GSAP 動畫統一管理**:
  - 重構動畫邏輯，統一管理四個面的照片動畫
  - 使用 `switch` 語句根據面的類型設定不同的初始位置
  - 分別控制 `right` 和 `top` 屬性的動畫

**技術實作**:
- **OpeningSection.tsx**:
  - 重新設計 `facesPhotosData` 結構
  - 統一照片引用管理 `openingPhotosRef`
  - 實作分層動畫邏輯（左右面控制 right，上下面控制 top）
  - 加入智能初始位置設定
- **Navigation.tsx**:
  - 更新滾動觸發的照片消失動畫
  - 實作四個方向的照片飛出效果
  - 左面往右飛出，右面往左飛出，上面往上飛出，下面往下飛出
  - 確保照片動畫與新的數據結構匹配

**動畫流程**:
1. **載入階段**: 照片從四個方向飛入中央
2. **顯示階段**: 照片保持在設定位置，響應滑鼠 3D 效果
3. **滾動階段**: 照片從中央往四個方向飛出並消失

**效能優化**:
- 統一的數據結構減少條件判斷
- 改進的動畫邏輯提升執行效率
- 保持原有的 3D 效果切換機制

**視覺效果**:
- 實現完整的 3D 立方體照片系統
- 所有面都有動態照片展示
- 照片動畫往中央集中，創造聚合效果
- 滾動時照片向四個方向散開，增強視覺層次

**相關檔案**:
- `src/components/sections/opening/OpeningSection.tsx`
- `src/components/Navigation.tsx`
- `public/assets/img*.png` (照片素材)

### ⏰ 03:16:39 CST OpeningSection 照片動畫系統重構與優化
**任務**: 創建專門的 hook 統一管理照片動畫，優化程式碼架構與效能

**問題分析**:
- 代碼重複：Navigation.tsx 中四個面的處理邏輯重複
- 職責分離：Navigation 組件承擔了太多照片動畫職責
- 維護困難：照片動畫邏輯分散在兩個檔案中
- 效能問題：ScrollTrigger onUpdate 沒有節流，高頻率執行

**創建新檔案**:
- **`src/hooks/useOpeningPhotosAnimation.ts`**:
  - 統一管理照片的入場和離場動畫
  - 使用配置物件 `ANIMATION_CONFIG` 集中管理動畫參數
  - 提供 `triggerEntranceAnimation` 入場動畫函數
  - 內建 ScrollTrigger 離場動畫，支援節流優化（60fps）
  - 自動清理機制避免記憶體洩漏

**重構檔案**:
- **OpeningSection.tsx**:
  - 移除複雜的動畫邏輯（約 80 行程式碼）
  - 使用 `useOpeningPhotosAnimation` hook
  - 簡化為只處理 3D 效果和照片渲染
  - 保持原有的效能優化功能
- **Navigation.tsx**:
  - 移除所有照片動畫相關邏輯（約 100 行程式碼）
  - 專注於導航位置動畫
  - 簡化 ScrollTrigger 配置
  - 移除對 OpeningSection 的依賴

**技術優化**:
- **統一配置管理**：所有動畫參數集中在 `ANIMATION_CONFIG`
- **代碼去重**：四個面的處理邏輯統一為一個函數
- **效能提升**：離場動畫加入節流控制（16ms 間隔）
- **職責分離**：照片動畫邏輯完全獨立於 Navigation
- **維護性提升**：動畫邏輯集中在單一檔案中

**動畫邏輯改進**:
- 入場動畫：從四個方向往中央聚合
- 離場動畫：從中央往四個方向散開
- 節流機制：確保動畫流暢且不影響效能
- 統一處理：所有面使用相同的處理邏輯

**程式碼統計**:
- 新增檔案：1 個（useOpeningPhotosAnimation.ts）
- 程式碼減少：約 180 行（去除重複邏輯）
- 效能提升：節流機制減少 CPU 使用
- 維護性：動畫邏輯集中管理，易於修改

**相關檔案**:
- `src/hooks/useOpeningPhotosAnimation.ts` ✨ 新增
- `src/components/sections/opening/OpeningSection.tsx` 🔧 重構
- `src/components/Navigation.tsx` 🔧 簡化

## 2025-07-07 03:26:13 CST - 修正 OpeningSection 照片動畫衝突問題

### 問題描述
- 往下滾動時離場動畫無法正確運作
- 滾動回到 opening section 時會重複觸發入場動畫
- 入場動畫和離場動畫相互打架，造成動畫異常

### 根本原因分析
1. **入場動畫重複觸發**：`isVisible` 變化時會重複觸發 `is3DEnabled`
2. **缺乏動畫狀態管理**：沒有追蹤動畫是否已執行過
3. **ScrollTrigger 回滾處理不足**：沒有 `onEnterBack` 處理回滾情況
4. **動畫衝突**：兩個動畫同時操作相同的 DOM 元素

### 修正方案

#### 1. 強化 `useOpeningPhotosAnimation.ts`
- **新增狀態管理**：
  - `entranceAnimationPlayedRef`：追蹤入場動畫是否已播放
  - `isExitAnimationActiveRef`：追蹤離場動畫是否進行中
- **動畫衝突預防**：
  - 入場動畫前檢查是否已播放或離場動畫進行中
  - 使用 `gsap.killTweensOf()` 停止進行中的動畫
- **ScrollTrigger 改進**：
  - 新增 `onEnterBack` 處理回滾時重置照片狀態
  - 新增 `onLeave` 確保離場動畫完成
- **新增輔助函數**：
  - `resetPhotosToInitialState()`：重置到入場前狀態
  - `resetPhotosToNormalState()`：重置到正常狀態
  - `resetAnimationState()`：重置動畫狀態

#### 2. 優化 `OpeningSection.tsx` 動畫觸發邏輯
- **初始化狀態管理**：
  - 新增 `hasInitialized` 防止重複初始化
  - 修改入場動畫觸發條件，只在第一次初始化時觸發
- **視窗可見性處理**：
  - 視窗不可見時完全重置動畫狀態
  - 為下次重新進入做準備

### 技術改進
1. **狀態管理**：完整追蹤動畫執行狀態，防止重複觸發
2. **衝突預防**：動畫執行前檢查狀態，避免同時執行衝突動畫
3. **回滾處理**：ScrollTrigger 完整支援正向和反向滾動
4. **記憶體管理**：適當的動畫清理和狀態重置

### 測試重點
- [x] 首次載入的入場動畫
- [x] 往下滾動的離場動畫
- [x] 往上滾動的回滾動畫
- [x] 重複滾動不會觸發重複動畫
- [x] 視窗可見性變化的處理

### 程式碼統計
- 修改檔案：2 個
- 新增程式碼：約 80 行
- 新增函數：3 個輔助函數
- 新增狀態：3 個 ref 狀態管理

這次修正徹底解決了動畫衝突問題，確保照片動畫系統的穩定性和使用者體驗。

---

*最後更新: 2025-07-04 17:54:04 CST (台北時間)*