import { createRouter } from 'sv-router'
import Home from './routes/Home.svelte'
import GraphEditor from './routes/GraphEditor.svelte'
import DesignEditor from './routes/DesignEditor.svelte'
import Login from './routes/Login.svelte'
import Layout from './routes/Layout.svelte'

export const {
  p: path,
  navigate,
  isActive,
  route,
} = createRouter({
  '/': Home,
  '/login': Login,
  '/graphs/:graphId': GraphEditor,
  '/graphs/:graphId/designs/:designId': DesignEditor,
  layout: Layout,
})

type P = typeof path

export const p: P = (...args) => path(...args).replace(/^\//, '')
