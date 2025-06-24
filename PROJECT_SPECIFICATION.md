# 🎯 R3F 10th Recap 專案規格書

> **專案願景**: 打造沉浸式 3D 體驗，展示報導者十年來的深度報導與創新成果  
> **技術架構**: Next.js 15 + React Three Fiber + Zustand + TypeScript  
> **開發目標**: 60 FPS 高效能 3D 互動網站

---

## 📋 專案概覽

### **技術目標**
- **裝置支援**: 桌面電腦、平板、手機全平台支援
- **效能指標**: 60 FPS 穩定運行，首屏載入 < 1 秒
- **相容性**: 支援 Chrome、Firefox、Safari、Edge 主流瀏覽器
- **響應式**: 完美適配各種螢幕尺寸

---

## 🎨 Section 設計規格

### **整體設定**
這個專案會分成多個section，因為主要的視覺元素都會透過r3f的3D場景來實現
為了效能最佳化，預想要將不同的3D元素，都建構在一個統一的3D場景
使用者向下捲動的過程，就是持續地移動鏡頭，看到不同的3D元素
這個專案的關鍵問題會在於，鏡頭不會只有單一方向的移動，可能在不同section會有不同的移動機制
那要怎麼讓鏡頭知道現在捲動到哪裡？現在應該怎麼移動？也包括play back的情況
預想的解法是，整個3D canvas會一直fixed在畫面中央，然後透過捲動到不同的HTML/DOM元素作為trigger，來讓整個專案知道現在捲動到哪裡了

#### **全域的component**
原本有一個sidepanel.jsx，但其實應該改叫modal可能比較合適
它的作用是，當我點擊畫面中有綁定sidepanel的元素時（可能是照片也可能是影片也可能是3D模型也可能是文字），會出現這個sidepanel在畫面中央，當出現時，body就不會被滾動了，滑鼠／手勢滾動會是滾動sidepanel裡面的內容
而當關掉sidepanel後，會精準地回到原本捲動的位置

然後還有在畫面右側的sectionNavigation，點擊的效果就是跳到特定的section，也會自動highlight當前的Section為何

### **Section 1: 開場動態 (Opening Animation)**

#### **功能描述**
邏輯上是loading progress，只是我們不是要做成進度條(0-100%)，而是播放一個動畫
這個動畫是要透過lottie/rive動畫來做，還是我們用js原生的動畫來做，可以再討論
但主要是希望載入速度很快、幾乎是立即播放，與此同時會預先載入後面section必要的資源
等於是一個緩衝機制，透過動畫播放讓使用者不會覺得在等待loading

#### **互動機制**
- **自動播放**: 載入頁面自動開始動畫
- **跳過功能**: 5秒＆確認後面資源載入完成後，後提供跳過按鈕，可以直接進入主要內容

#### **技術實作**
- **載入管理**: 在這段動畫播放的時候，預載入後面section必要的資源、避免等待
- **動畫引擎**: 需要再釐清是用lottie/rive還是js來處理
- **效能優化**: 動畫完成後清理不需要的資源

---

### **Section 2: 影響力報導 (Reports Gallery)**

#### **功能描述**
參考copy/codesanbox這個資料夾，去建立一個3D的card slider
總共會有12張card對應到12個報導
相機會跟隨滾動去旋轉，每次滾動都會剛好旋轉到下一個項目的面前（譬如有10個項目，就每次旋轉360/10=36度，這樣剛好旋轉一圈）
滑鼠移動在視窗會稍微改變相機的視角，以創造parallax的效果
會顯示在畫面中央的card的title和subtitle
點擊卡片會展開sidepanel，載入對應的內容

- **媒體支援**: 支援圖片和影片封面的動態載入
- **觸控支援**: 平板和手機支援滾動操作

---

### **Section 3: 多元創新 (Innovation Showcase)**

#### **功能描述**
這邊透過10個3D物件代表10個多元創新項目
這10個3D物件的位置是預先安排好的（會在Z軸上，有遠近的交錯排列）
透過滾動，會去讓相機的位置持續朝著Z軸向前（物件就會由遠而進出現），並根據物件的X,Y位置調整、依序移動到這10個3D物件前面（也就是物件會顯示在畫面中央）
在畫面比較遠處的3D物件看起來會有模糊景深的效果
點擊3D物件會展開sidepanel，載入對應的內容
滑鼠在視窗中移動時，會些微改變相機的角度以創造parallax的效果

---

### **Section 4: 非營利媒體之路 (Timeline Journey)**

#### **功能描述**
類似section3的效果，一樣是讓照片由遠而進出現，
只是與此同時，也會有文字標題從視窗右方以水平滾動的方式出現
這些文字可以點擊，點擊就會展開對應的sidepanel和載入對應的內容

---

### **Section 5: 贊助者證言 Supporters' Feedback**

#### **功能描述**
從section4滾動到這個section5，整個3D scene的場景會慢慢從淺灰色變成黑色
背景會漂浮非常多張3D卡片（隨機均勻分佈在一個3D空間裡，有遠有近）
中央會有一排卡片排列，他們上面會顯示捐款者對報導者回饋的文字
使用者可以透過grab的方式去切換，這個切換是loop的、不會有盡頭

如果使用者繼續往下滾動到下一個section6，背景的3D卡片會慢慢凝聚，變成一個具體的大3D圖形(以particles的方式呈現)

---

### **Section 6: 贊助支持**
這邊的呈現就跟原本的差不多
會需要有一些文案＆有選擇贊助的按鈕
前面section5的背景卡片到了section6會慢慢凝聚成一個巨大的3D圖形
也會持續出現在這個區塊



---

## 🏗️ 統一 Scene 開發原則

### **架構優勢**
- **WebGL Context 重用**: 避免多 Canvas 的 Context 切換開銷
- **平滑過渡體驗**: Section 間無縫的相機移動，無載入中斷
- **資源共享**: 材質、幾何體、紋理可在 Section 間共享
- **記憶體效率**: 比分離 Scene 節省 30-40% 記憶體使用

### **三層顯示控制策略**

#### **Loaded 層級 (資源載入)**
```typescript
// 預載入相鄰 Section 的必要資源
const sectionStates = {
  current: 'active',    // 當前 Section: 完全載入
  adjacent: 'loaded',   // 相鄰 Section: 資源已載入但未顯示
  distant: 'unloaded'   // 遠距 Section: 資源未載入
}
```

#### **Visible 層級 (渲染控制)**
```typescript
// 只渲染當前和相鄰 Section 的物件
const renderControl = {
  current: { visible: true, renderOrder: 1 },
  previous: { visible: true, renderOrder: 0, opacity: 0.3 },
  next: { visible: true, renderOrder: 0, opacity: 0.3 },
  others: { visible: false }
}
```

#### **Active 層級 (互動控制)**
```typescript
// 只有當前 Section 可互動
const interactionControl = {
  current: { interactive: true, clickable: true },
  others: { interactive: false, clickable: false }
}
```

### **相機管理策略**

#### **Section-based 相機狀態**
```typescript
interface CameraState {
  position: Vector3;
  target: Vector3;
  fov: number;
  mode: 'orbit' | 'fly' | 'fixed' | 'follow';
  constraints?: CameraConstraints;
}
```

#### **滾動映射系統**
- **DOM Trigger**: HTML 元素作為滾動觸發器
- **Progress Mapping**: 滾動進度 (0-1) 映射到相機參數
- **Smooth Interpolation**: GSAP 驅動的平滑相機移動
- **Bidirectional**: 支援向上/向下滾動的精準控制

### **效能優化策略**

#### **漸進式載入**
```typescript
const loadingStrategy = {
  immediate: ['Section1', 'currentSection'],
  preload: ['nextSection', 'previousSection'],
  lazy: ['distantSections'],
  unload: ['farSections']
}
```

#### **動態品質調整**
```typescript
const qualityLevels = {
  high: { shadows: true, reflections: true, particles: 'full' },
  medium: { shadows: true, reflections: false, particles: 'reduced' },
  low: { shadows: false, reflections: false, particles: 'minimal' }
}
```

#### **記憶體管理**
- **自動清理**: 距離當前 Section 超過 2 個位置的資源自動釋放
- **資源池**: 常用材質和幾何體使用對象池復用
- **垃圾回收**: 定期檢查和清理未使用的 3D 物件

### **實作指導原則**

#### **相機控制器設計**
```typescript
class UnifiedSceneController {
  // 單一相機實例，所有 Section 共享
  private camera: PerspectiveCamera;
  
  // Section 狀態管理
  private sectionManager: SectionManager;
  
  // 滾動到相機的映射
  private scrollToCameraMapper: ScrollMapper;
  
  // 平滑過渡系統
  private transitionSystem: TransitionSystem;
}
```

#### **資源管理器**
```typescript
class ResourceManager {
  // 分層載入管理
  loadSection(sectionId: string, priority: 'immediate' | 'preload' | 'lazy');
  
  // 智能卸載
  unloadDistantSections(currentSection: string, keepDistance: number);
  
  // 記憶體監控
  monitorMemoryUsage(): MemoryStats;
}
```

#### **效能監控**
```typescript
class PerformanceMonitor {
  // FPS 監控
  trackFPS(): number;
  
  // 記憶體使用監控
  trackMemoryUsage(): MemoryStats;
  
  // 自動品質調整
  adjustQuality(currentFPS: number): QualityLevel;
}
```

---

## 🔧 技術實作規格

### **狀態管理架構**
```typescript
// 主要狀態分片
interface AppState {
  scroll: ScrollState      // 滾動進度和區段管理
  scene: SceneState       // 3D 場景和相機狀態  
  ui: UIState            // UI 顯示和互動狀態
  data: DataState        // 內容資料和載入狀態
}
```

### **統一 3D 場景架構**
- **核心理念**: 所有 3D 元素統一在單一 Canvas 中，透過相機移動實現場景切換
- **相機控制**: 滾動驅動的智能相機移動系統，支援多種移動模式（旋轉、前進、位置調整）
- **顯示控制**: 三層顯示管理 (loaded/visible/active)，只渲染當前和相鄰 Section
- **資源管理**: 漸進式載入、動態品質調整、智能記憶體管理

### **3D 渲染系統**
- **React Three Fiber**: 聲明式 3D 開發
- **統一場景管理**: 單一 WebGL Context，避免多 Canvas 的效能損耗
- **分層渲染**: 依據 Section 狀態動態控制物件顯示和渲染品質
- **效能優化**: LOD、Frustum Culling、Instance Rendering
- **記憶體管理**: 自動資源清理和垃圾回收

### **相機狀態機系統**
- **Section-based States**: 每個 Section 定義專屬的相機行為模式
- **平滑過渡**: Section 間的相機移動使用 GSAP 實現流暢過渡
- **滾動映射**: HTML DOM 滾動位置精確映射到 3D 相機位置
- **回退支援**: 支援向上滾動的精準回退到前一狀態

### **動畫系統**
- **GSAP Integration**: 與 R3F 的深度整合
- **Timeline Management**: 複雜動畫序列的統一管理
- **Performance Monitoring**: 即時 FPS 監控和調整

### **資料管理**
- **內容 API**: RESTful API 或 GraphQL 資料獲取
- **快取策略**: 智能快取和預載入機制
- **離線支援**: 基礎內容的離線可用性

---

## 📱 使用者體驗流程

### **進入流程**
1. **載入畫面**: 優雅的載入動畫，建立期待感
2. **開場序列**: 品牌展示和 3D 世界的介紹
3. **主要導覽**: 直覺的滾動導覽，清楚的進度指示
4. **內容探索**: 豐富的互動內容和詳細資訊
5. **行動呼籲**: 自然的支持和分享引導

### **導覽系統**
- **滾動導覽**: 主要的垂直滾動導覽
- **區段指示**: 清楚的當前位置和進度顯示
- **快速跳轉**: 導覽選單支援快速跳轉
- **返回頂部**: 便利的返回頂部功能

### **互動回饋**
- **即時回饋**: 所有互動都有即時視覺回饋
- **載入狀態**: 清楚的載入進度和狀態指示
- **錯誤處理**: 友善的錯誤訊息和復原機制
- **成功提示**: 操作成功的明確確認

---

## 🎯 效能和品質目標

### **效能指標**
- **FPS 穩定性**: 60 FPS 穩定運行，最低不低於 45 FPS
- **載入時間**: 首屏載入 < 1 秒，完整載入 < 5 秒
- **記憶體使用**: 峰值記憶體 < 512MB，平均 < 256MB
- **場景切換**: Section 間切換延遲 < 200ms，相機移動流暢無卡頓
- **資源效率**: 統一 Scene 記憶體使用比分離 Scene 節省 30-40%

### **品質標準**
- **視覺品質**: 高解析度紋理，流暢動畫，無視覺故障
- **互動響應**: 所有互動響應時間 < 100ms
- **跨裝置一致**: 各平台體驗一致，功能完整

### **測試策略**
- **效能測試**: 持續的效能監控和基準測試
- **使用者測試**: 真實使用者的可用性測試
- **裝置測試**: 各種裝置和瀏覽器的相容性測試

---

## 📈 成功衡量指標

### **技術指標**
- **Lighthouse 分數**: Performance > 90, Accessibility > 95
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **錯誤率**: JavaScript 錯誤率 < 0.1%
- **可用性**: 99.9% 的時間正常運行

### **使用者指標**
- **參與度**: 平均停留時間 > 3 分鐘
- **完成率**: 完整瀏覽所有區段的比例 > 60%
- **互動率**: 點擊互動元素的比例 > 40%
- **分享率**: 社群分享的比例 > 5%

### **業務指標**
- **品牌認知**: 提升報導者的品牌知名度
- **支持轉換**: 訪客轉為支持者的轉換率 > 2%
- **內容發現**: 使用者發現新報導的比例 > 30%
- **技術展示**: 展示報導者的技術創新能力

---

*專案規格書版本: 1.0*  
*最後更新: 2025-01-23*  
*狀態: 初版草案* 