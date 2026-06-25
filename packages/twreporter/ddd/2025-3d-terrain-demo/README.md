# 2025-3d-terrain-demo

## 使用文章／專題

## twreporter-3d-terrain

### Usage

#### Import script tag

`type="module"` is important to make sure the script doesn't affect `window` property.

```html
<script
  type="module"
  src="https://projects.twreporter.org/twreporter/ddd/2025-3d-terrain-demo/js/assets/index-{timestamp}.js"
></script>
```

#### Use in HTML

This is a standard [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), you can use it directly in your html like so:

```html
<div>... Existing html</div>

<twreporter-3d-terrain></twreporter-3d-terrain>

<div>... Existing html</div>
```

Use `doc-id` to select a specific ArchieML Google document:

```html
<twreporter-3d-terrain doc-id="<archieml_doc_id>"></twreporter-3d-terrain>
```

When `doc-id` is omitted, the component falls back to the existing URL search-param behavior.

### Local preview

```bash
npm run dev
```

Open `/` for preview mode and `/?edit` for edit mode.
