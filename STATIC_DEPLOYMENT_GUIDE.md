# 報導者十週年回顧網站 - 靜態化部署指南

## 📋 目錄
1. [前置準備](#前置準備)
2. [配置修改](#配置修改)
3. [建置流程](#建置流程)
4. [部署選項](#部署選項)
5. [驗證測試](#驗證測試)
6. [故障排除](#故障排除)
7. [回退計畫](#回退計畫)

---

## 🔧 前置準備

### 1. 檢查專案狀態
```bash
# 確認目前在 dev-2d 分支
git branch

# 確認專案可正常建置
pnpm run build
pnpm run lint
```

### 2. 建立備份分支
```bash
# 建立靜態化專用分支
git checkout -b static-deployment
git push -u origin static-deployment
```

### 3. 確認現有功能
- ✅ 所有動畫正常運作
- ✅ 響應式設計完整
- ✅ 跨瀏覽器兼容性
- ✅ 無 JavaScript 錯誤

---

## ⚙️ 配置修改

### 1. 修改 `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 啟用靜態輸出
  output: 'export',
  
  // 確保所有路由都有 trailing slash
  trailingSlash: true,
  
  // 禁用 server-side 功能
  distDir: 'out',
  
  images: {
    // 禁用 Next.js 圖片優化（靜態部署不支援）
    unoptimized: true,
    
    // 保留現有圖片設定
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500, 750, 1000],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // 實驗性功能（保留）
  experimental: {
    optimizePackageImports: ['gsap', 'zustand'],
  },
  
  // 編譯器優化（保留）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 靜態化專用設定
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  
  // 禁用 i18n（如果有的話）
  // i18n: undefined,
};

export default nextConfig;
```

### 2. 修改 `package.json` 腳本

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3001",
    "build": "next build",
    "build:static": "next build && next export",
    "start": "next start",
    "start:static": "npx serve out",
    "lint": "next lint",
    "preview": "pnpm run build:static && pnpm run start:static"
  }
}
```

### 3. 檢查字體載入問題

確認 `src/app/layout.tsx` 中的字體設定：

```typescript
// 確保字體可以在靜態環境中正常載入
<head>
  <link rel="stylesheet" href="https://use.typekit.net/how0sqj.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
</head>
```

### 4. 處理環境變數

創建 `.env.local`：
```env
# 靜態部署環境標識
NEXT_PUBLIC_DEPLOYMENT_TYPE=static
NEXT_PUBLIC_BASE_PATH=/
```

---

## 🏗️ 建置流程

### 1. 本地測試建置
```bash
# 清理舊的建置檔案
rm -rf .next out

# 安裝依賴
pnpm install

# 執行 lint 檢查
pnpm run lint

# 建置靜態檔案
pnpm run build
```

### 2. 驗證輸出結果
```bash
# 檢查輸出目錄
ls -la out/

# 應該包含：
# - index.html (主頁面)
# - _next/ (靜態資源)
# - 其他靜態檔案
```

### 3. 本地預覽測試
```bash
# 方法1: 使用 serve
npx serve out

# 方法2: 使用 Python (如果有安裝)
cd out && python -m http.server 8000

# 方法3: 使用 Node.js
cd out && npx http-server
```

---

## 🌐 部署選項

### 選項1: GitHub Pages

#### 步驟1: 準備 GitHub Action
創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ static-deployment ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

#### 步驟2: 啟用 GitHub Pages
1. 前往 GitHub 專案設定
2. 選擇 Pages 選項
3. Source 選擇 "GitHub Actions"
4. 推送到 `static-deployment` 分支

### 選項2: Netlify

#### 步驟1: 連接專案
1. 前往 [Netlify](https://netlify.com)
2. 選擇 "New site from Git"
3. 連接 GitHub 專案

#### 步驟2: 設定建置
```
Build command: pnpm run build
Publish directory: out
```

#### 步驟3: 環境變數設定
```
NODE_VERSION=18
PNPM_VERSION=8
```

### 選項3: Vercel

#### 步驟1: 專案設定
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 初始化專案
vercel

# 設定建置指令
vercel --prod
```

#### 步驟2: `vercel.json` 設定
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "out",
  "cleanUrls": true,
  "trailingSlash": true
}
```

---

## ✅ 驗證測試

### 1. 功能測試清單
- [ ] 首頁正常載入
- [ ] 所有動畫效果正常
- [ ] 滾動觸發動畫正常
- [ ] Modal 開關正常
- [ ] 響應式設計正常
- [ ] 字體載入正常
- [ ] 圖片顯示正常
- [ ] 外部連結正常

### 2. 效能測試
```bash
# 使用 Lighthouse 測試
npx lighthouse https://your-domain.com --output=json --output-path=./lighthouse-report.json

# 使用 WebPageTest
# 前往 https://www.webpagetest.org/
```

### 3. 跨瀏覽器測試
- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)
- [ ] 行動裝置瀏覽器

---

## 🔧 故障排除

### 常見問題1: 圖片無法顯示
**原因**: Next.js Image 組件在靜態部署中需要特殊設定
**解決**: 在 `next.config.ts` 中設定 `unoptimized: true`

### 常見問題2: 字體載入失敗
**原因**: 字體 CDN 連線問題
**解決**: 
```typescript
// 在 layout.tsx 中添加 fallback
font-family: 'custom-font', 'Arial', sans-serif;
```

### 常見問題3: 動畫不正常
**原因**: GSAP 在靜態環境中初始化時機問題
**解決**: 確保動畫在 `useEffect` 中初始化

### 常見問題4: 路由404錯誤
**原因**: 靜態部署只有 `index.html`
**解決**: 確認所有導航都指向根目錄

---

## 🔄 回退計畫

### 如果需要回退到 SSR 模式：

1. **恢復 next.config.ts**
```typescript
const nextConfig: NextConfig = {
  // 移除 output: 'export'
  // 移除 trailingSlash: true
  // 移除 unoptimized: true
  
  // 保留其他設定...
};
```

2. **恢復 package.json**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

3. **重新部署**
```bash
git checkout dev-2d
pnpm run build
```

---

## 📊 效能預期

### 靜態化後的預期改善：
- **首屏載入時間**: 改善 30-50%
- **Lighthouse 分數**: 提升至 90+ 分
- **CDN 快取**: 全球分發，載入更快
- **伺服器成本**: 降至趨近於零

### 監控指標：
- Core Web Vitals
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

---

## 🚀 執行檢查清單

### 部署前檢查：
- [ ] 備份現有版本
- [ ] 本地測試通過
- [ ] 跨瀏覽器測試通過
- [ ] 效能測試通過
- [ ] 團隊 review 通過

### 部署後檢查：
- [ ] 線上功能正常
- [ ] DNS 設定正確
- [ ] SSL 憑證有效
- [ ] 監控設定完成
- [ ] 錯誤報告設定完成

---

*最後更新: 2025-01-09*
*維護者: 報導者技術團隊*