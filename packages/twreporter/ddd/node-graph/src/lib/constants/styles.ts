import type { Doc } from '../../../convex/_generated/dataModel'

type NodeStyle = NonNullable<Doc<'designNodes'>['nodeStyle']>
type EdgeStyle = NonNullable<Doc<'designEdges'>['edgeStyle']>

export const defaultNodeStyle: NodeStyle = {
  backgroundColor: '#F1EBE6',
  borderColor: 'transparent',
  textColor: '#404040',
  descriptionBackgroundColor: '#F1EBE6',
  descriptionTextColor: '#404040',
  descriptionDefaultOpen: false,
}

export const defaultEdgeStyle: EdgeStyle = {
  strokeColor: '#404040',
  arrowColor: '#404040',
  labelBackgroundColor: '#F1F1F1',
  labelTextColor: '#404040',
}
