# 📊 媒體載入優化分析報告

> **撰寫日期**：2025-01-03  
> **狀態**：分析完成，待後續實作  
> **優先級**：中等（功能開發完成後執行）

## 🎯 摘要

本文件分析報導者十週年回顧網站的媒體載入現況，識別效能瓶頸並提供優化建議。主要發現：當前初始載入量約 50MB，透過智慧載入策略可減少至 15MB，整體效能提升 70%。

---

## 📋 當前媒體載入現況分析

### **1. ChallengesSection** ✅ **已優化**
**檔案位置**：`src/components/sections/challenges/`

**現有機制**：
- ✅ 視窗緩衝區：1.5倍視窗大小
- ✅ 時間批次：每100ms載入3張照片
- ✅ 優先載入：前3張照片必載
- ✅ 節流機制：使用 requestAnimationFrame
- ✅ LRU快取：根據視窗位置管理載入

**實作檔案**：
```
hooks/useProgressiveLoading.ts - 漸進式載入邏輯
hooks/useChallengesScroll.ts   - 滾動控制
ChallengesBackground.tsx       - 背景照片管理
```

### **2. ReportsSection** ⚠️ **部分優化**
**檔案位置**：`src/components/sections/reports/`

**現有機制**：
- ✅ 播放控制：只播放當前+前後相鄰影片
- ✅ 載入狀態：基本的 loading state 管理
- ⚠️ 預載入策略：`preload="auto"` 導致所有媒體立即載入

**問題識別**：
```typescript
// ReportsSwiperItem.tsx - 第 95 行
<video
  preload="auto"  // ❌ 所有12個項目同時載入
  src={path}
  // ...
/>

// 影響：
// - 12個媒體檔案（包含 webm 影片）同時開始下載
// - 初始載入時間過長
// - 頻寬浪費：用戶可能不會看完所有項目
```

**載入量統計**：
- 總項目：12個報導
- 影片項目：5個 (webm 格式，平均 2-3MB)
- 圖片項目：7個 (webp 格式，平均 200-400KB)
- 估計總載入量：~20MB

### **3. InnovationsSection** ❌ **需要大幅優化**
**檔案位置**：`src/components/sections/innovations/`

**現有機制**：
- ❌ 無載入控制：10個 webm 影片全部同時載入
- ❌ 無視窗檢測：即使項目不在視野內也載入
- ❌ 無優先級管理：所有項目同等優先級

**問題識別**：
```typescript
// InnovationsSection.tsx - 第 170+ 行
{innovationItems.map((item, index) => (
  <div>
    <video
      src={item.path}  // ❌ 10個影片同時載入
      autoPlay
      loop
      muted
      // 無任何載入控制
    />
  </div>
))}

// 影響：
// - 10個 webm 影片同時載入（約 20-30MB）
// - 3D 動畫期間，視野外的項目仍在載入
// - 低階設備可能記憶體不足
```

**載入量統計**：
- 總項目：10個創新展示
- 所有影片：webm 格式，平均 2-4MB
- 估計總載入量：~30MB

### **4. Modal 系統** ✅ **載入策略良好**
**檔案位置**：`src/components/modal/`

**現有機制**：
- ✅ 按需載入：只在開啟 Modal 時載入媒體
- ✅ 錯誤處理：完整的載入錯誤處理機制
- ✅ 載入狀態：良好的使用者回饋

---

## ⚡ 頻繁載入/卸載效能分析

### **❌ 不適合激進卸載的場景**
1. **快速來回滾動**：
   - 用戶快速滑動會造成載入→卸載→重新載入的循環
   - 增加網路請求次數，反而降低效能

2. **小螢幕設備**：
   - 行動裝置記憶體有限
   - 頻繁的 DOM 操作影響更大

3. **網路不穩定環境**：
   - 重新載入失敗率增加
   - 用戶體驗下降

### **✅ 建議的智慧載入策略**
```typescript
const SMART_LOADING_STRATEGY = {
  // 基礎配置
  viewportBuffer: 1.5,     // 視窗緩衝倍數
  preloadRange: 2,         // 預載入前後項目數
  cacheSize: 8,            // LRU快取大小
  
  // 載入優先級
  priority: {
    current: 'immediate',   // 當前項目立即載入
    adjacent: 'high',       // 相鄰項目高優先級
    buffer: 'low',         // 緩衝區項目低優先級
    distant: 'unload'      // 遠距項目卸載
  },
  
  // 防抖設定（避免頻繁載入/卸載）
  debounce: {
    scrollDelay: 150,      // 滾動防抖延遲
    loadingDelay: 300,     // 載入操作延遲
    unloadDelay: 2000      // 卸載延遲（給予快速返回的時間）
  }
};
```

---

## 🚀 優化建議與實作計畫

### **階段一：Reports Section 優化** (高優先級)
**預期效果**：載入量減少 60-70%

```typescript
// 1. 修正預載入策略
// 檔案：ReportsSwiperItem.tsx
<video
  preload="none"  // 改為不預載入
  src={path}
  // 根據 shouldPlay 動態載入
/>

// 2. 實作 Intersection Observer
const useReportsLoading = (items: ReportItem[], currentIndex: number) => {
  const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
  
  // 載入當前項目 + 前後各2個
  const shouldLoad = useCallback((index: number) => {
    const range = 2;
    return Math.abs(index - currentIndex) <= range;
  }, [currentIndex]);
  
  // 延遲卸載：2秒後卸載遠距項目
  const shouldUnload = useCallback((index: number) => {
    const range = 4;
    return Math.abs(index - currentIndex) > range;
  }, [currentIndex]);
};

// 3. LRU 快取機制
class MediaCache {
  private cache = new Map<string, HTMLVideoElement>();
  private maxSize = 8;
  
  get(src: string): HTMLVideoElement | null {
    // LRU 快取邏輯
  }
  
  set(src: string, element: HTMLVideoElement): void {
    // 快取管理邏輯
  }
}
```

### **階段二：Innovations Section 優化** (中優先級)
**預期效果**：載入量減少 70-80%

```typescript
// 1. 根據 3D 滾動進度控制載入
// 檔案：InnovationsSection.tsx
useEffect(() => {
  ScrollTrigger.create({
    onUpdate: (self) => {
      const progress = self.progress;
      
      // 計算當前焦點項目
      innovationItems.forEach((item, index) => {
        const itemProgress = calculateItemProgress(progress, index);
        const shouldLoad = itemProgress > -0.2 && itemProgress < 1.2;
        
        if (shouldLoad && !loadedItems.has(index)) {
          loadMediaItem(index);
        } else if (!shouldLoad && loadedItems.has(index)) {
          // 延遲卸載
          setTimeout(() => unloadMediaItem(index), 2000);
        }
      });
    }
  });
}, []);

// 2. 動態載入媒體
const loadMediaItem = (index: number) => {
  const element = document.getElementById(`innovation-item-${index}`);
  const video = element?.querySelector('video');
  
  if (video && !video.src) {
    video.src = innovationItems[index].path;
    video.load();
  }
};
```

### **階段三：統一載入管理器** (低優先級)
**目標**：建立可重用的載入管理系統

```typescript
// 檔案：src/hooks/useSmartLoading.ts
interface SmartLoadingConfig {
  strategy: 'viewport' | 'proximity' | 'sequential';
  bufferSize: number;
  cacheSize: number;
  unloadDelay: number;
  debounceDelay: number;
}

export const useSmartLoading = <T extends MediaItem>(
  items: T[],
  currentIndex: number,
  config: SmartLoadingConfig
) => {
  // 統一的載入邏輯
  // LRU 快取管理  
  // 防抖和節流
  // 錯誤重試機制
  
  return {
    shouldLoadItem: (index: number) => boolean,
    loadedItems: Set<number>,
    loadingItems: Set<number>,
    errorItems: Set<number>,
  };
};
```

---

## 📊 效能影響評估

### **載入量比較**
| 區塊 | 當前載入量 | 優化後載入量 | 減少比例 | 估計提升 |
|------|------------|--------------|----------|----------|
| Reports | ~20MB (12項) | ~6MB (3-5項) | 70% | 大幅提升 |
| Innovations | ~30MB (10項) | ~6MB (2-3項) | 80% | 顯著提升 |
| **整體** | **~50MB** | **~15MB** | **70%** | **明顯提升** |

### **使用者體驗改善**
- ⚡ **初始載入時間**：預期減少 3-5 秒
- 📱 **行動裝置體驗**：記憶體使用量大幅減少
- 🌐 **網路友善**：適合低速網路環境
- 🔋 **電池壽命**：減少不必要的網路活動

### **開發維護性**
- ✅ **模組化設計**：可重用的載入管理器
- ✅ **統一配置**：集中式載入策略管理
- ✅ **錯誤處理**：完整的失敗重試機制
- ✅ **監控能力**：載入狀態追蹤和分析

---

## 🔧 實作優先級建議

### **立即執行**（開發完成後）
1. **Reports Section 優化**
   - 修改 `preload="auto"` 為 `preload="none"`
   - 實作基於 `currentSlide` 的動態載入

### **短期執行**（1-2週內）
2. **Innovations Section 優化**
   - 實作基於 ScrollTrigger 的載入控制
   - 添加延遲卸載機制

### **長期規劃**（1個月內）
3. **統一載入管理器**
   - 設計可重用的 `useSmartLoading` Hook
   - 建立載入效能監控機制

---

## 📝 實作檢查清單

### **Reports Section**
- [ ] 修改 `ReportsSwiperItem.tsx` 預載入策略
- [ ] 實作 `useReportsLoading` Hook
- [ ] 添加 Intersection Observer
- [ ] 建立 LRU 快取機制
- [ ] 測試載入效能改善

### **Innovations Section**  
- [ ] 修改 `InnovationsSection.tsx` 載入邏輯
- [ ] 整合 ScrollTrigger 載入控制
- [ ] 實作延遲卸載機制
- [ ] 測試 3D 動畫期間載入行為

### **統一管理器**
- [ ] 設計 `useSmartLoading` Hook 介面
- [ ] 實作 LRU 快取管理
- [ ] 添加錯誤重試機制
- [ ] 建立載入效能監控
- [ ] 整合到現有區塊

### **測試與驗證**
- [ ] 載入時間測試（桌面/行動）
- [ ] 記憶體使用量測試
- [ ] 網路使用量測試
- [ ] 用戶體驗測試（快速滾動）

---

## 🎯 成功指標

**效能指標**：
- 初始載入時間減少 > 60%
- 記憶體使用量減少 > 50%
- 網路流量減少 > 70%

**用戶體驗指標**：
- 頁面互動性提升
- 滾動流暢度改善
- 行動裝置體驗優化

**技術指標**：
- 程式碼可維護性
- 載入錯誤率 < 1%
- 快取命中率 > 80%

---

*本分析將在所有功能開發完成後執行，預期為專案帶來顯著的效能提升和用戶體驗改善。* 