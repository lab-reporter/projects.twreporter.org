# 2025-0823-vote

## 使用文章／專題

- [【Data Reporter】7 張圖表，看「第二波大罷免」各村里投票結果](https://www.twreporter.org/a/data-reporter-2025-823-recall-results)
- [第二波大罷免：7 藍委罷免案投票率低、全被否決，賴清德表示執政團隊進行 4 項調整，朱立倫交棒點名盧秀燕](https://www.twreporter.org/a/2025-823-recall-results)

## 專案架構

主要的兩個元件（長條圖與地圖），採用 Web Component 的方式輸出，檔案存在 [`src/wc/`](src/wc/) 裡面：

- `Chart.wc.svelte` 基礎元件 (root)
  - `Chart.svelte` 長條圖主要程式
    - [`src/copmonents/Candidate.svelte`](src/components/Candidate.svelte) 是長條圖的每個候選人子元件
- `Map.wc.svelte` 基礎元件 (root)
  - `Map.wc.svelte` 地圖主要程式

### 靜態設定

即時資料路徑與基本大小設定，儲存在 [`src/lib/constants/`](src/lib/constants/) 資料夾中：

- `path.ts` 設定數據與圖資 URL 路徑
- `styles.ts` 設定基礎圖層大小

### CSS Style

Svelte 的 CSS 寫在每個元件的 `<style>` tag 裡面，除非加上 `:global(...)`，其他 style 都會限縮在元件中使用

### iframe 輸出設定

使用 [`output.yml`](output.yml) 檔案設定，可以自動生成所需的 iframe 元件，上傳至 GCP 後，在 `https://.../iframe/wc.html?download` 可以開啟下載頁

```
npm run generate
```

## 本機開發

```
npm install
npm run dev
```

## 部署到 GCP

（需要先登入 `gcloud` CLI）

```
gcloud auth list
gcloud auth login
```

### 程式更新

```
npm run deploy
```

### iframe 更新

```
npm run deploy:iframe
```
