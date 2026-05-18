import type { Doc } from '~convex/dataModel'

export type NodeStyle = NonNullable<Doc<'designNodes'>['nodeStyle']>

export type EdgeStyle = NonNullable<Doc<'designEdges'>['edgeStyle']>

export type CanvasMetadata = Pick<
  Doc<'designs'>,
  'backgroundColor' | 'title'
> & {
  description: NonNullable<Doc<'designs'>['description']>
  footnotes: NonNullable<Doc<'designs'>['footnotes']>
}
