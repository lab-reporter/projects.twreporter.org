import { createRouter } from 'sv-router'
import Home from './routes/Home.svelte'
import GraphEditor from './routes/GraphEditor.svelte'
import DesignEditor from './routes/DesignEditor.svelte'

export const {
  p: path,
  navigate,
  isActive,
  route,
} = createRouter({
  '/': Home,
  '/graphs/:graphId': GraphEditor,
  '/graphs/:graphId/designs/:designId': DesignEditor,
})

type P = typeof path

export const p: P = (...args) => path(...args).replace(/^\//, '')
