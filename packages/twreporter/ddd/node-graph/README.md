# node-graph

A experimental project on building internal graphic tools, starting with connected node graph.

## 使用文章／專題

- [從林派到英系，陳明文「嘉義王」之路與派系接班隱憂](https://www.twreporter.org/a/2026-local-elections-chiayi)
- [棄縣長、保議長、聽爸爸的話──彰化謝家「姊弟內鬥」的派系困局](https://www.twreporter.org/a/2026-local-elections-changhua)

## Stack

- Frontend
    - Vite
    - Svelte 5 SPA with `sv-router`
    - `@xyflow/svelte` for node graphs
- Backend: Convex
- Auth: Clerk with `svelte-clerk`

## Commands

```bash
pnpm dev # Starts both vite and convex dev server
pnpm check-types # Run both svelte-check and convex ts checker

pnpm build:web
pnpm build:lib # Build web components

pnpm deploy:staging
pnpm deploy:prod
```
