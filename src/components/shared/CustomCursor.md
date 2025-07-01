# CustomCursor 組件使用說明

## 🎯 概述

`CustomCursor` 是一個全域客製化滑鼠游標組件，可以在滑鼠 hover 到特定元素時顯示自定義的文字提示，並隱藏原始游標。

## 🚀 快速開始

### 引入方式
組件已在 `src/app/layout.tsx` 中全域引入，無需額外配置。

### 基本使用
只需在任何 HTML 元素上添加相應的 `data` 屬性即可觸發客製化游標。

## 📋 使用方式

### 方式一：預設配置

組件內建了 4 種預設樣式，直接使用：

```tsx
// 1. EXPLORE - 白色背景黑色邊框
<div data-custom-cursor="explore">
  <img src="image.jpg" alt="圖片" />
</div>

// 2. VIEW - 黑色背景白色文字
<div data-custom-cursor="view">
  <img src="gallery.jpg" alt="查看圖片" />
</div>

// 3. READ MORE - 藍色圓角背景
<button data-custom-cursor="read">
  閱讀更多
</button>

// 4. PLAY - 紅色圓形背景
<video data-custom-cursor="play">
  <source src="video.mp4" />
</video>
```

### 方式二：完全自定義

```tsx
// 自定義文字和樣式
<div 
  data-cursor-text="DOWNLOAD"
  data-cursor-class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
>
  下載檔案
</div>

// 只自定義文字，使用預設樣式
<div data-cursor-text="CLICK ME">
  點擊我
</div>

// 使用 Tailwind CSS 創建獨特樣式
<button
  data-cursor-text="BUY NOW"
  data-cursor-class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs uppercase tracking-wide rounded-full shadow-xl"
>
  購買商品
</button>
```

## 🎨 預設樣式配置

| 類型 | 文字 | 樣式描述 |
|------|------|----------|
| `explore` | EXPLORE | 白色背景，黑色邊框，陰影 |
| `view` | VIEW | 黑色背景，白色文字，陰影 |
| `read` | READ MORE | 藍色背景，白色文字，圓角 |
| `play` | PLAY | 紅色背景，白色文字，圓形 |

## 📝 HTML 屬性說明

### 預設配置屬性
- `data-custom-cursor="類型名稱"` - 使用預設配置（explore, view, read, play）

### 自定義配置屬性
- `data-cursor-text="文字內容"` - 自定義顯示文字
- `data-cursor-class="CSS類別"` - 自定義樣式類別（支援 Tailwind CSS）

## 💡 進階使用

### 嵌套元素支援
客製化游標支援任何深度的 DOM 嵌套：

```tsx
<div data-custom-cursor="explore">
  <div className="content-wrapper">
    <img src="photo.jpg" />
    <h3>標題</h3>
    <p>描述文字</p> {/* 這裡 hover 也會觸發 explore 游標 */}
  </div>
</div>
```

### 動態切換
可以在不同區域使用不同的游標樣式：

```tsx
<section>
  <div data-custom-cursor="explore">
    <img src="image1.jpg" />
  </div>
  
  <div data-custom-cursor="play">
    <video src="video.mp4" />
  </div>
  
  <div data-cursor-text="SPECIAL" data-cursor-class="bg-yellow-400 text-black">
    特殊區域
  </div>
</section>
```

### 與原始 cursor 隱藏
為了確保原始游標完全隱藏，需要在觸發元素上設置 `cursor: none`：

```tsx
// React 組件中
<div 
  data-custom-cursor="explore"
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

## 📊 使用範例

### Reports Section 實際應用
```tsx
// src/components/sections/reports/ReportsSwiperItem.tsx
<div
  data-custom-cursor="explore"
  style={{ cursor: 'none' }}
  onClick={handleClick}
>
  <video src={mediaPath} />
  {/* 滑鼠 hover 時顯示 "EXPLORE" */}
</div>
```

### Modal 內容區域
```tsx
// 可以在 Modal 內容中使用不同的游標
<div data-cursor-text="閱讀完整報導" data-cursor-class="bg-blue-600 text-white px-3 py-1 rounded">
  <a href="/full-article">查看更多</a>
</div>
```

## 🎯 擴展方式

如需新增預設樣式，在 `CustomCursor.tsx` 的 `cursorConfigs` 中添加：

```tsx
const cursorConfigs: Record<string, CursorConfig> = {
  // 現有配置...
  
  // 新增自定義配置
  download: {
    text: 'DOWNLOAD',
    className: 'bg-green-500 text-white p-2 text-sm font-medium rounded shadow-lg'
  }
};
```

然後就可以使用：
```tsx
<div data-custom-cursor="download">下載區域</div>
```