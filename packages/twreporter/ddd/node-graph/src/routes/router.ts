import { createRouter } from 'sv-router'
import Home from './app/index.svelte'
import GraphEditor from './app/graphs/[graphId].svelte'
import DesignEditor from './app/graphs/designs/[designId].svelte'
import Login from './app/login.svelte'
import Layout from './layout.svelte'
import type { Id } from '~convex/dataModel'

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

export type GraphParams = {
  graphId: Id<'graphs'>
}

export type DesignParams = GraphParams & {
  designId: Id<'designs'>
}

export function getGraphParams() {
  return route.getParams('/graphs/:graphId') as GraphParams
}

export function getDesignParams() {
  return route.getParams('/graphs/:graphId/designs/:designId') as DesignParams
}
