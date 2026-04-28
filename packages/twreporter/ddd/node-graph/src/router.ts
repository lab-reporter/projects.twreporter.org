import { createRouter } from 'sv-router'
import Home from './routes/Home.svelte'
import Editor from './routes/Editor.svelte'

export const { p, navigate, isActive, route } = createRouter({
  '/': Home,
  '/editor': Editor,
})
