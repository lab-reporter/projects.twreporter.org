# node-graph

A experimental project on building internal graphic tools, starting with connected node graph.

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
