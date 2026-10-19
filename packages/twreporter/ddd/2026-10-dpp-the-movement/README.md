# 2026-10-dpp-the-movement

## 使用文章／專題

- [戰力最強、仇恨值高，民進黨造王者「新潮流」的變與不變](https://www.twreporter.org/a/2026-local-elections-dpp-the-movement)

## Development

```sh
pnpm install
pnpm dev
```

Storybook runs on port 5173. The stories include Seatings, DetailedBarChart, DonorStackedBar, and the national donation view. Edit the matching component in `src/wc`. The `src` prop is a CSV URL and `config` is a JSON URL. Sample files are in `public`.

The component supports the graphic editor's data and configuration messages. Add `edit` to the iframe URL to enable editing.

## Data and config

Both custom elements accept CSV and JSON URLs through `src` and `config`. In the CMS, use one source table and enter its exact header names in the column mapping form.

- `twreporter-seatings` maps group, category, label, and description columns. Groups follow their first occurrence in the source. Set category colors with the color picker and choose a summary category.
- `twreporter-detailed-bar-chart` maps scope, company, candidate, classification, amount, description, detail, and card-group columns. Amounts must be numbers in 元; the graph always displays 萬元. Leave optional column bindings empty to omit them.
- `twreporter-donor-stacked-bar` maps a company label, optional company description, and configured party amount columns. Empty amount cells are treated as zero; amounts must be numbers in 元 and the chart displays totals in 萬元.
- `cardFilter` selects candidate cards only. The bar includes every donation in the source. Each candidate must have one card group within a scope; groups follow their first occurrence in the source.
- Filter buttons use source values in their first occurrence order. Each `descriptions` entry has `group`, `filter`, and `text`; it appears beneath the bar only for that company and city. Leave `filter` empty when no filter column is configured. In the CMS, expand `編輯 config.json` to edit or paste the full config.
- Edit names, grouping, and the included records in the source table. Config controls appearance and column bindings. Subtitles are optional, and detail values display as written in the source.
- The national source uses a single `範圍` value, `北北桃`, for the donation heading while keeping all three cities combined. A single scope does not show filter buttons.
- The local story uses `detailed-bar-chart.csv` and `detailed-bar-chart.json`. The national story uses `national.csv` and `national.json`, with the same component.
- The donor story uses `donor-stacked-bar.csv` and `donor-stacked-bar.json`.

Sample source and config files are in `public`.

## Add a component

- Put the Svelte component, its `*.wc.svelte` wrapper, and its `*.stories.svelte` story in `src/wc`. Put its Zod configuration schema in `src/lib/components/<name>/types.ts`.
- Add an entry like `src/wc/seatings.ts`, then register its entry, output directory, and schema in `components.config.ts`.
- Give each component a unique custom element tag.

## Build and check

```sh
pnpm check-types
pnpm format:check
pnpm build
```

The build creates component scripts and JSON Schemas in `dist/components/<name>` and Storybook in `storybook-static`. Each script exports `schemaUrl`. Script and schema filenames include the same build timestamp.

## Deploy

Authenticate with Google Cloud CLI, then run `pnpm deploy:dev` or `pnpm deploy:prod`. Components are under `<project-url>/components` and Storybook is under `<project-url>/storybook`.

Host your CSV and JSON files at the URLs you pass to `src` and `config`. Open the component in deployed Storybook, set those URLs in Controls, and use Copy below the preview to get the embed code.
