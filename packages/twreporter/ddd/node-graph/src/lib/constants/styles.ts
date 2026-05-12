import type { Doc } from '~convex/dataModel'

type NodeStyle = NonNullable<Doc<'designNodes'>['nodeStyle']>
type EdgeStyle = NonNullable<Doc<'designEdges'>['edgeStyle']>

export const defaultNodeStyle: NodeStyle = {
  backgroundColor: '#F0D5BE',
  borderColor: '#9F7544',
  textColor: '#404040',
  descriptionBackgroundColor: '#F1F1F1',
  descriptionTextColor: '#404040',
  descriptionDefaultOpen: true,
}

export const defaultEdgeStyle: EdgeStyle = {
  strokeColor: '#404040',
  arrowColor: '#404040',
  labelBackgroundColor: '#F1F1F1',
  labelTextColor: '#404040',
}
