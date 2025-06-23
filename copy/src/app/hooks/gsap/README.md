# GSAP 動畫模組使用說明

這個目錄包含模組化的 GSAP 動畫效果，每個動畫效果都是獨立的模組，可以單獨使用或通過統一的 Hook 一起使用。

## 目錄結構

```
gsap/
  ├── index.js               # 統一的動畫 Hook 和導出
  ├── useSplitTextBottom.js  # 文字拆分由下往上動畫
  ├── useFadeIn.js           # 淡入動畫
  └── ... (其他動畫模組)
```

## 使用方法

### 方法一：使用統一的 Hook

這種方式會自動處理頁面上所有帶有 `data-gsap` 屬性的元素：

```jsx
import useGsapAnimation from '../hooks/gsap';

function MyComponent() {
  // 啟用所有 GSAP 動畫
  useGsapAnimation();
  
  return (
    <div>
      <h1 data-gsap="split-text-bottom">標題文字</h1>
      <p data-gsap="fade-in">段落內容</p>
    </div>
  );
}
```

### 方法二：只使用特定動畫模組

如果你只需要某一種動畫效果，可以直接導入該模組：

```jsx
import { useEffect, useRef } from 'react';
import { useSplitTextBottom } from '../hooks/gsap';

function MyComponent() {
  const headingRef = useRef(null);
  
  useEffect(() => {
    if (headingRef.current) {
      // 手動應用動畫效果到特定元素
      const cleanup = useSplitTextBottom(headingRef.current);
      
      // 組件卸載時清理
      return cleanup;
    }
  }, []);
  
  return (
    <div>
      <h1 
        ref={headingRef}
        data-duration="0.8"
        data-stagger-total="1.2"
      >
        標題文字
      </h1>
    </div>
  );
}
```

## 可用的動畫類型

### split-text-bottom

將文字拆分為單個字元，並逐個由下往上出現。

```jsx
<h1 
  data-gsap="split-text-bottom"
  data-duration="0.5"        // 單個字元動畫時長 (秒)
  data-stagger-total="0.5"   // 字元間總延遲時間 (秒)
  data-trigger-start="50% 40%" // 滾動觸發位置
  data-markers="false"       // 是否顯示標記
>
  標題文字
</h1>
```

### fade-in

元素淡入效果，帶有輕微上移。

```jsx
<div 
  data-gsap="fade-in"
  data-duration="0.8"      // 動畫時長 (秒)
  data-delay="0.2"         // 延遲時間 (秒)
  data-trigger="scroll"    // 觸發方式：'scroll' (預設) 或 'immediate'
  data-trigger-start="top 80%" // 滾動觸發位置 (只在 scroll 模式有效)
  data-markers="false"     // 是否顯示標記 (只在 scroll 模式有效)
  data-ease="power2.out"   // 緩動函數
>
  內容
</div>
```

**觸發方式說明：**
- `data-trigger="scroll"` (預設)：當元素滾動進入畫面時觸發動畫
- `data-trigger="immediate"` 或 `data-trigger="auto"`：組件載入後立即觸發動畫，不等待滾動

## 擴展新的動畫效果

要添加新的動畫效果，請按照以下步驟：

1. 在 `gsap/` 目錄下創建新的文件，如 `useZoomIn.js`
2. 實現動畫邏輯並返回清理函數
3. 在 `index.js` 中導入並添加到 switch 語句中
4. 更新文檔說明新動畫的使用方法

## 注意事項

- 所有動畫模組都已處理伺服器端渲染 (SSR) 兼容性
- 動畫清理函數確保不會發生記憶體洩漏
- 可以通過 data 屬性自定義每個動畫的行為 