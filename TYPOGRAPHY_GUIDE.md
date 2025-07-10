# 字級系統使用指南

## 📝 概述

本專案已在 Tailwind CSS 配置中建立了完整的響應式字級系統，涵蓋 Desktop、Tablet、Mobile 三種斷點的 H1-H6 字級設定。

## 🎯 使用方式

### 方法1: 直接使用 HTML 標籤（推薦✨）

由於已在 `globals.css` 中設定預設樣式，可以直接使用 HTML 標籤：

```jsx
// 直接使用，自動響應式！
<h1>主標題</h1>
<h2>次標題</h2>
<h3>小標題</h3>
<h4>段落標題</h4>
<h5>子標題</h5>
<h6>最小標題</h6>

// 如需客製化，可以覆寫樣式
<h1 className="text-red-500">紅色主標題</h1>
<h2 className="font-normal">非粗體次標題</h2>
```

### 方法2: 響應式 Class（手動控制）

```jsx
// 手動指定每個斷點的字級
<h1 className="text-h1-mobile md:text-h1-tablet lg:text-h1-desktop font-heading-mixed">
  主標題
</h1>
```

### 方法3: 自定義 CSS Class（統一管理）

在 `globals.css` 中定義響應式字級：

```css
/* 響應式標題字級 */
.heading-h1 {
  @apply text-h1-mobile md:text-h1-tablet lg:text-h1-desktop font-heading-mixed;
}

.heading-h2 {
  @apply text-h2-mobile md:text-h2-tablet lg:text-h2-desktop font-heading-mixed;
}

.heading-h3 {
  @apply text-h3-mobile md:text-h3-tablet lg:text-h3-desktop font-heading-mixed;
}

.heading-h4 {
  @apply text-h4-mobile md:text-h4-tablet lg:text-h4-desktop font-heading-mixed;
}

.heading-h5 {
  @apply text-h5-mobile md:text-h5-tablet lg:text-h5-desktop font-heading-mixed;
}

.heading-h6 {
  @apply text-h6-mobile md:text-h6-tablet lg:text-h6-desktop font-heading-mixed;
}

/* 內文字級 */
.text-body-large {
  @apply text-body-lg font-body-mixed;
}

.text-body-normal {
  @apply text-body-base font-body-mixed;
}

.text-body-small {
  @apply text-body-sm font-body-mixed;
}
```

然後在組件中使用：

```jsx
<h1 className="heading-h1">主標題</h1>
<h2 className="heading-h2">次標題</h2>
<p className="text-body-normal">內文段落</p>
```

## 📐 字級規格表

| 標題級別 | Desktop | Tablet | Mobile | Line Height | Letter Spacing |
|---------|---------|--------|---------|-------------|----------------|
| H1      | 72px    | 56px   | 40px    | 1.1         | -0.02em        |
| H2      | 56px    | 44px   | 32px    | 1.2         | -0.01em        |
| H3      | 40px    | 32px   | 28px    | 1.2         | -0.01em        |
| H4      | 32px    | 28px   | 24px    | 1.3         | 0              |
| H5      | 24px    | 22px   | 20px    | 1.4         | 0              |
| H6      | 20px    | 18px   | 16px    | 1.4         | 0              |

| 內文類型   | 大小  | Line Height |
|-----------|-------|-------------|
| Body Large| 18px  | 1.6         |
| Body Base | 16px  | 1.6         |
| Body Small| 14px  | 1.6         |
| Caption   | 12px  | 1.5         |

## 🎨 字體組合

| Class 名稱           | 用途           | 字體組合                                    |
|---------------------|----------------|---------------------------------------------|
| `font-heading-mixed`| 標題           | Alverata (英文) + 思源宋體 (中文)              |
| `font-body-mixed`   | 內文           | Roboto Slab (英文) + 思源宋體 (中文)          |
| `font-sans-mixed`   | 無襯線文字      | Roboto Slab (英文) + 思源黑體 (中文)          |

## 🔧 實際使用範例

### 標題階層示例（推薦用法）

```jsx
// 🎉 超簡潔！直接使用 HTML 標籤
<h1 className="text-white mb-8">
  《報導者》十週年
</h1>

<h2 className="text-gray-900 mb-6">
  深度求真 眾聲同行
</h2>

<h3 className="text-gray-800 mb-4">
  影響力報導
</h3>

<h4 className="text-gray-700 mb-3">
  調查報導的力量
</h4>

// 客製化範例
<h1 className="text-red-500 font-normal mb-8">
  特殊樣式的主標題
</h1>

<h2 className="text-center text-blue-600 mb-6">
  置中的藍色次標題
</h2>
```

### 內文段落示例

```jsx
// 大型段落
<p className="text-body-large text-gray-600 mb-4">
  這是較大的內文段落，用於重要描述或引言。
</p>

// 標準段落
<p className="text-body-normal text-gray-600 mb-3">
  這是標準的內文段落，用於一般內容描述。
</p>

// 小字註解
<p className="text-body-small text-gray-500 mb-2">
  這是較小的文字，用於註解或次要資訊。
</p>

// 圖片說明
<p className="text-caption text-gray-400">
  圖片說明文字或版權資訊
</p>
```

## 📱 響應式斷點

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## ⚠️ 注意事項

1. **HTML 語義化**: H1-H6 應依照內容階層使用，不應只考慮視覺大小
2. **自動響應式**: 標籤預設已包含響應式設定，無需額外 class
3. **客製化**: 如需修改樣式，直接加 class 即可覆寫預設樣式
4. **字體載入**: 確保 Alverata 字體已正確載入
5. **CSS 優先級**: 預設樣式位於 `@layer base`，可被 Tailwind utility class 覆寫

## 🚀 推薦工作流程

1. **設計階段**: 依照設計稿使用對應的字級 class
2. **開發階段**: 優先使用預定義的 CSS class（如 `.heading-h1`）
3. **測試階段**: 在各裝置上測試字級顯示效果
4. **維護階段**: 若需調整字級，統一在 `tailwind.config.js` 中修改

---

*維護者: 報導者技術團隊*
*最後更新: 2025-01-09*