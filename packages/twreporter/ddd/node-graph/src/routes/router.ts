import { createRouter } from 'sv-router'
import Home from './app/index.svelte'
import GraphEditor from './app/graphs/designs/[designId].svelte'
import DesignEditor from './app/graphs/[graphId].svelte'
import Login from './app/login.svelte'
import Layout from './layout.svelte'

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
