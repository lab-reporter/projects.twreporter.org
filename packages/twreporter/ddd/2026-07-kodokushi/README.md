# 2026-07-kodokushi

腳本尋找文章中唯一一組 `.ddd-anchor[data-type="start"]` 與 `.ddd-anchor[data-type="end"]`，並將區間內的段落使用 [pretext](https://github.com/chenglou/pretext) 重新排列為文繞圖版面。

## Development

```bash
pnpm dev
```

- 圖片與錨點設定位於 `src/illustrations.json`
- 文章文字由 CMS 管理

需要文繞圖的完整範圍使用一組起訖錨點：

```html
<div class="ddd-anchor" data-type="start"></div>
<!-- CMS paragraphs -->
<div class="ddd-anchor" data-type="end"></div>
```

- `illustrations` 是共用的插圖列表，每筆包含 `src`、`anchor`，以及各 breakpoint 的 `x`、`top`、`width`。
- `anchor` 是完整起訖範圍內從 0 開始的內容區塊索引，包含標題。圖片會以該區塊的起點定位，並可影響標題與後續段落的繞文。

### Local Script Testing

在測試文章的 embed code 區塊加入：

```html
<script
  type="module"
  src="http://localhost:5173/src/main.ts"
  defer
></script>
```

## `#editor` 圖片編輯模式

在文章網址後加上 `#editor`：拖曳插圖可移動，按住 Shift 拖曳可縮放。編輯器修改目前 breakpoint 實際使用的位置設定；若未設定 optional breakpoint，則修改其 fallback。每次操作完成後，包含共用插圖列表與所有位置設定的完整 JSON 會直接複製到剪貼簿，並輸出到瀏覽器 console，可直接覆蓋 `src/illustrations.json`。

## Build and Deploy

```bash
pnpm build
pnpm deploy:dev
pnpm deploy:prod
```

部署內容包括：

- `js/script-<timestamp>.js`
- `kodokushi.schema.json`，本機 build 產物，供貼入 graphics-cms 使用
- `assets/img/*.png`
- `assets/vid/*.webm`

## CMS Embed Code Script

將下方 config.json URL 換成 graphics-cms 發佈的網址；若使用內建設定，可省略第一段 script。

```html
<script>
  window.__twreporter_dynamic_layout_config = 'https://example.com/config.json'
</script>
<script
  type="module"
  src="https://projects.twreporter.org/twreporter/ddd/2026-07-kodokushi/js/script-<timestamp>.js"
  defer
></script>
```
