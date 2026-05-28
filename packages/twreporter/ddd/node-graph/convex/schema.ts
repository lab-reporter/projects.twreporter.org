import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const designFields = {
  graphId: v.id('graphs'),
  title: v.string(),
  description: v.optional(v.string()),
  footnotes: v.optional(v.string()),
  legends: v.array(
    v.object({
      id: v.string(),
      label: v.string(),
      color: v.string(),
    }),
  ),
  backgroundColor: v.string(),
  status: v.union(
    v.literal('draft'),
    v.literal('ready'),
    v.literal('archived'),
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
}

export const designLayoutFields = {
  graphId: v.id('graphs'),
  designId: v.id('designs'),
  key: v.string(),
  label: v.string(),
  kind: v.union(
    v.literal('desktop'),
    v.literal('mobile'),
    v.literal('social'),
    v.literal('custom'),
  ),
  sortOrder: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
}

export const designNodeStyleFields = {
  backgroundColor: v.string(),
  borderColor: v.string(),
  textColor: v.string(),
  descriptionBackgroundColor: v.string(),
  descriptionTextColor: v.string(),
  descriptionDefaultOpen: v.boolean(),
}

export const designNodeFields = {
  graphId: v.id('graphs'),
  designId: v.id('designs'),
  nodeId: v.id('nodes'),
  nodeStyle: v.optional(v.object(designNodeStyleFields)),
  updatedAt: v.number(),
}

export const positionFields = {
  x: v.number(),
  y: v.number(),
}

export const designLayoutNodeFields = {
  graphId: v.id('graphs'),
  designId: v.id('designs'),
  layoutId: v.id('designLayouts'),
  designNodeId: v.id('designNodes'),
  nodeId: v.id('nodes'),
  position: v.object(positionFields),
  updatedAt: v.number(),
}

export const designEdgeStyleFields = {
  strokeColor: v.string(),
  arrowColor: v.string(),
  labelBackgroundColor: v.string(),
  labelTextColor: v.string(),
}

export const designEdgeFields = {
  graphId: v.id('graphs'),
  designId: v.id('designs'),
  edgeId: v.id('edges'),
  edgeStyle: v.optional(v.object(designEdgeStyleFields)),
  updatedAt: v.number(),
}

export const graphFields = {
  name: v.string(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
}

export const nodeFields = {
  graphId: v.id('graphs'),
  label: v.string(),
  categoryKey: v.string(),
  note: v.optional(v.string()),
  infoSource: v.optional(v.string()),
  position: v.object(positionFields),
  expanded: v.boolean(),
  updatedAt: v.number(),
  imageUrl: v.optional(v.string()),
}

export const edgeFields = {
  graphId: v.id('graphs'),
  source: v.id('nodes'),
  target: v.id('nodes'),
  label: v.optional(v.string()),
  note: v.optional(v.string()),
  infoSource: v.optional(v.string()),
  directed: v.boolean(),
  updatedAt: v.number(),
}

export const categoryFields = {
  key: v.string(),
  label: v.string(),
  color: v.string(),
}

export default defineSchema({
  graphs: defineTable(graphFields),

  designs: defineTable(designFields).index('by_graphId_and_updatedAt', [
    'graphId',
    'updatedAt',
  ]),

  designLayouts: defineTable(designLayoutFields)
    .index('by_designId_and_sortOrder', ['designId', 'sortOrder'])
    .index('by_designId_and_key', ['designId', 'key']),

  designNodes: defineTable(designNodeFields)
    .index('by_designId', ['designId'])
    .index('by_designId_and_nodeId', ['designId', 'nodeId'])
    .index('by_nodeId', ['nodeId']),

  designLayoutNodes: defineTable(designLayoutNodeFields)
    .index('by_layoutId', ['layoutId'])
    .index('by_layoutId_and_nodeId', ['layoutId', 'nodeId'])
    .index('by_layoutId_and_designNodeId', ['layoutId', 'designNodeId'])
    .index('by_designNodeId', ['designNodeId']),

  designEdges: defineTable(designEdgeFields)
    .index('by_designId', ['designId'])
    .index('by_designId_and_edgeId', ['designId', 'edgeId'])
    .index('by_edgeId', ['edgeId']),

  nodes: defineTable(nodeFields)
    .index('by_graph', ['graphId'])
    .index('by_graph_and_category', ['graphId', 'categoryKey']),

  edges: defineTable(edgeFields)
    .index('by_graph', ['graphId'])
    .index('by_source', ['source'])
    .index('by_target', ['target']),

  categories: defineTable(categoryFields).index('by_key', ['key']),
})
