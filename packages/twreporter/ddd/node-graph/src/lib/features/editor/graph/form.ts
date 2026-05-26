import type { FunctionArgs } from 'convex/server'
import type { Doc, Id } from '~convex/dataModel'
import { api } from '~convex/api'

export type NodeFormState = {
  label: string
  categoryLabel: string
  infoSource: string
  note: string
  imageUrl: string
}

export type EdgeFormState = {
  source?: Id<'nodes'> | string
  target?: Id<'nodes'> | string
  label: string
  directed: boolean
  infoSource: string
  note: string
}

export type DesignFormState = {
  title: string
  description: string
}

export type NodeForm = Omit<
  FunctionArgs<typeof api.graphs.createNode>,
  'graphId'
>

export type EdgeForm = Omit<
  FunctionArgs<typeof api.graphs.createEdge>,
  'graphId' | 'source' | 'target'
> & {
  source?: Id<'nodes'>
  target?: Id<'nodes'>
}

export type EdgeDetails = Omit<
  FunctionArgs<typeof api.graphs.updateEdgeDetails>,
  'edgeId'
>

export function createEmptyNodeForm(categoryLabel = ''): NodeFormState {
  return {
    label: '',
    categoryLabel,
    infoSource: '',
    note: '',
    imageUrl: '',
  }
}

export function createEmptyEdgeForm(): EdgeFormState {
  return {
    source: '',
    target: '',
    label: '',
    directed: true,
    infoSource: '',
    note: '',
  }
}

export function createEmptyDesignForm(): DesignFormState {
  return {
    title: '',
    description: '',
  }
}

export function createNodeFormFromNode(node: {
  label: string
  categoryLabel: Doc<'categories'>['label']
  infoSource?: string
  note?: string
  imageUrl?: string
}): NodeFormState {
  return {
    label: node.label,
    categoryLabel: node.categoryLabel,
    infoSource: node.infoSource ?? '',
    note: node.note ?? '',
    imageUrl: node.imageUrl ?? '',
  }
}

export function createEdgeFormFromEdge(edge: {
  source: Id<'nodes'>
  target: Id<'nodes'>
  label?: string
  directed: boolean
  infoSource?: string
  note?: string
}): EdgeFormState {
  return {
    source: edge.source,
    target: edge.target,
    label: edge.label ?? '',
    directed: edge.directed,
    infoSource: edge.infoSource ?? '',
    note: edge.note ?? '',
  }
}

export function toNodeInput(
  form: NodeFormState,
  fallbackCategoryLabel = '未分類',
): NodeForm {
  return {
    label: form.label,
    categoryLabel: form.categoryLabel || fallbackCategoryLabel,
    infoSource: form.infoSource || undefined,
    note: form.note || undefined,
    imageUrl: form.imageUrl,
  }
}

export function toEdgeInput(form: EdgeFormState): EdgeForm {
  return {
    source: form.source ? (form.source as Id<'nodes'>) : undefined,
    target: form.target ? (form.target as Id<'nodes'>) : undefined,
    label: form.label || undefined,
    directed: form.directed,
    infoSource: form.infoSource || undefined,
    note: form.note || undefined,
  }
}
