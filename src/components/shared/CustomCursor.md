# CustomCursor 組件使用說明

## 🎯 概述

`CustomCursor` 是一個全域客製化滑鼠游標組件，可以在滑鼠 hover 到特定元素時顯示自定義的文字提示，並隱藏原始游標。

## 🚀 快速開始

### 引入方式
組件已在 `src/app/layout.tsx` 中全域引入，無需額外配置。

### 基本使用
只需在任何 HTML 元素上添加 `data-custom-cursor` 屬性即可觸發客製化游標。

## 📋 使用方式

### 基本用法

直接在元素上添加 `data-custom-cursor` 屬性，值為要顯示的文字：

```tsx
// 顯示 EXPLORE
<div data-custom-cursor="EXPLORE">
  <img src="image.jpg" alt="圖片" />
</div>

// 顯示 VIEW
<div data-custom-cursor="VIEW">
  <img src="gallery.jpg" alt="查看圖片" />
</div>

// 顯示 READ MORE
<button data-custom-cursor="READ MORE">
  閱讀更多
</button>

// 顯示 PLAY
<video data-custom-cursor="PLAY">
  <source src="video.mp4" />
</video>
```

### 自定義樣式

如果需要自定義游標樣式，可以使用 `data-cursor-class` 屬性：

```tsx
// 使用自定義樣式
<div 
  data-custom-cursor="DOWNLOAD"
  data-cursor-class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
>
  下載檔案
</div>

// 使用 Tailwind CSS 創建獨特樣式
<button
  data-custom-cursor="BUY NOW"
  data-cursor-class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs uppercase tracking-wide rounded-full shadow-xl"
>
  購買商品
</button>
```

## 🎨 預設樣式

如果不指定 `data-cursor-class`，游標會使用以下預設樣式：
- 白色背景
- 黑色邊框
- 14px 字體
- 中等字重
- 陰影效果
- 82px 寬度 x 40px 高度
- 文字居中對齊

## 📝 HTML 屬性說明

- `data-custom-cursor="文字內容"` - 設定游標顯示的文字（必填）
- `data-cursor-class="CSS類別"` - 自定義樣式類別（選填，支援 Tailwind CSS）

## 💡 進階使用

### 嵌套元素支援
客製化游標支援任何深度的 DOM 嵌套：

```tsx
<div data-custom-cursor="EXPLORE">
  <div className="content-wrapper">
    <img src="photo.jpg" />
    <h3>標題</h3>
    <p>描述文字</p> {/* 這裡 hover 也會觸發 EXPLORE 游標 */}
  </div>
</div>
```

### 動態切換
可以在不同區域使用不同的游標樣式：

```tsx
<section>
  <div data-custom-cursor="EXPLORE">
    <img src="image1.jpg" />
  </div>
  
  <div data-custom-cursor="PLAY">
    <video src="video.mp4" />
  </div>
  
  <div data-custom-cursor="SPECIAL" data-cursor-class="bg-yellow-400 text-black">
    特殊區域
  </div>
</section>
```

### 與原始 cursor 隱藏
為了確保原始游標完全隱藏，需要在觸發元素上設置 `cursor: none`：

```tsx
// React 組件中
<div 
  data-custom-cursor="EXPLORE"
  style={{ cursor: 'none' }}
  className="hover-element"
>
  內容
</div>
```

## ⚠️ 注意事項

1. **游標隱藏**：確保觸發元素及其子元素都設置了 `cursor: none` 樣式
2. **z-index**：客製化游標使用 `z-[10001]`，確保不被其他元素覆蓋
3. **效能**：組件使用單一全域監聽器，效能優化良好
4. **嵌套優先級**：如果多個嵌套元素都有客製化游標屬性，會使用最接近的元素配置

## 🔧 技術特點

- **全域單例**：整個應用只有一個監聽器
- **即時響應**：滑鼠移動時即時檢測和切換
- **CSS 靈活性**：完全支援 Tailwind CSS 和自定義樣式
- **TypeScript 支援**：完整的類型定義
- **無副作用**：組件卸載時自動清理監聽器
- **平滑動畫**：使用 lerp 插值實現流暢的跟隨效果

## 📊 使用範例

### Reports Section 實際應用
```tsx
// src/components/sections/reports/ReportsSwiperItem.tsx
<div
  data-custom-cursor="EXPLORE"
  style={{ cursor: 'none' }}
  onClick={handleClick}
>
  <video src={mediaPath} />
  {/* 滑鼠 hover 時顯示 "EXPLORE" */}
</div>
```

### Modal 導航控制
```tsx
// src/components/modal/shared/NavigationControls.tsx
<div
  data-custom-cursor="PREV"
  onClick={() => onNavigate('prev')}
>
  上一則內容
</div>

<div
  data-custom-cursor="NEXT"
  onClick={() => onNavigate('next')}
>
  下一則內容
</div>
```

### Challenges Section
```tsx
// src/components/sections/challenges/ChallengeItem.tsx
<div
  data-custom-cursor="VIEW"
  style={{ cursor: 'pointer' }}
  onClick={() => onClick(title)}
>
  查看挑戰故事
</div>
```

### Feedbacks Section
```tsx
// src/components/sections/feedbacks/FeedbacksSection.tsx
<div data-custom-cursor="GRAB">
  {/* Swiper 可拖曳區域 */}
</div>
```

## 🛠️ 修改預設樣式

如需修改預設樣式，請編輯 `CustomCursor.tsx` 中的 `defaultCursorClassName`：

```tsx
// 預設的 cursor 樣式
const defaultCursorClassName = "translate-x-1/2 translate-y-1/2 bg-white border border-black text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center";
```