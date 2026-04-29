import { createRouter } from 'sv-router'
import Home from './routes/Home.svelte'
import Editor from './routes/Editor.svelte'

export const {
  p: path,
  navigate,
  isActive,
  route,
} = createRouter({
  '/': Home,
  '/editor': Editor,
})

type P = typeof path

export const p: P = (...args) => path(...args).replace(/^\//, '')
