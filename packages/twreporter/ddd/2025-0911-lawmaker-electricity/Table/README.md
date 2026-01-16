# Table with Popup in Svelte and Vite

Add `?term=` to the slug to choose different term's database

install
`npm install`

dev environment
`npm run dev`

build and deploy to GCP
`npm run deploy`

embed code

```
<iframe
  src="https://projects.twreporter.org/twreporter/ddd/2025-0911-lawmaker-electricity/table/index.html?term=10"
  id="twreporter-table-{term}"
  scrolling="no"
></iframe>
<link
  rel="stylesheet"
  href="https://projects.twreporter.org/twreporter/ddd/2025-0911-lawmaker-electricity/embed.css"
/>
<script src="https://projects.twreporter.org/twreporter/ddd/2025-0911-lawmaker-electricity/embed.js"></script>
```
