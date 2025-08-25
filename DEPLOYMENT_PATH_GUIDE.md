# 靜態網站路徑配置指南

## 🎯 路徑問題說明

您觀察到的路徑問題是靜態網站部署中的常見議題。以 `/` 開頭的路徑確實是**絕對路徑**，在不同部署環境下會有不同的行為。

## 📍 路徑類型說明

### 絕對路徑（目前配置）
```html
<img src="/assets/image.jpg" />
<link href="/_next/static/css/app.css" />
```

### 相對路徑
```html
<img src="./assets/image.jpg" />
<link href="./_next/static/css/app.css" />
```

## 🌐 不同部署環境的相容性

### ✅ 絕對路徑適用場景（目前配置）

1. **根域名部署**
   - `https://your-domain.com/` ✅
   - `https://your-site.netlify.app/` ✅
   - `https://your-repo.github.io/` ✅

2. **主流靜態託管服務**
   - Netlify ✅
   - Vercel ✅
   - GitHub Pages（用戶頁面）✅
   - AWS S3 + CloudFront ✅
   - Firebase Hosting ✅

### ⚠️ 可能有問題的場景

1. **子目錄部署**
   - `https://your-domain.com/subfolder/` ❌
   - `https://your-repo.github.io/project-name/` ❌

2. **本地檔案系統**
   - 直接開啟 `file://` ❌（您遇到的問題）

## 🔧 針對不同場景的配置方案

### 方案1: 根目錄部署（目前配置）
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: false,
  // 使用預設絕對路徑，適用於根目錄部署
};
```

### 方案2: 子目錄部署
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: false,
  basePath: '/your-project-name', // 設定子目錄名稱
};
```

### 方案3: 完全相對路徑（最大相容性，但有限制）
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: false,
  assetPrefix: './',
  // 注意：這會與 next/font 衝突，需要移除所有字體配置
};
```

## 🚀 建議的部署策略

### 推薦配置（目前使用）
保持現有配置，因為：

1. **相容性最佳** - 適用於 99% 的靜態託管服務
2. **效能最佳** - 不需要額外的路徑處理
3. **維護簡單** - 符合 Next.js 預設行為

### 特殊需求配置

如果您確實需要部署到子目錄，請：

1. **明確子目錄名稱**
   ```typescript
   basePath: '/your-exact-subdirectory-name'
   ```

2. **更新所有內部連結**
   ```typescript
   // 使用 Next.js 的 basePath 自動處理
   <Link href="/about">About</Link> // 自動變成 /subdirectory/about
   ```

## 🧪 測試不同環境

### 本地測試
```bash
# 啟動本地伺服器（必要）
cd out && python3 -m http.server 5500
# 訪問: http://localhost:5500
```

### 部署前驗證
```bash
# 建置並測試
pnpm run build:static
cd out && npx serve .
```

## 📊 部署環境檢查清單

### Netlify/Vercel 部署
- ✅ 使用目前配置
- ✅ 直接拖放 `out` 資料夾
- ✅ 自動處理路徑

### GitHub Pages 部署
- ✅ 用戶頁面：使用目前配置
- ❌ 專案頁面：需要設定 `basePath: '/repo-name'`

### 自定義伺服器
- ✅ 根目錄：使用目前配置
- ❌ 子目錄：需要設定對應的 `basePath`

## 🎯 結論

**您的擔憂是合理的**，但針對主流部署場景，目前的絕對路徑配置是最佳選擇：

1. **99% 的靜態託管服務都支援**
2. **效能和相容性最佳**
3. **符合 Next.js 最佳實踐**

如果您有特定的部署需求（如子目錄部署），請告訴我具體的目標 URL，我可以為您調整配置。

---

*建立時間: 2025-01-09*
*狀態: 目前配置適用於根目錄部署*
