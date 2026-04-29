import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  graphs: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  }),

  nodes: defineTable({
    graphId: v.id('graphs'),
    label: v.string(),
    categoryKey: v.string(),
    note: v.optional(v.string()),
    infoSource: v.optional(v.string()),
    position: v.object({ x: v.number(), y: v.number() }), // graph-view position
    expanded: v.boolean(),
    updatedAt: v.number(),
  }).index('by_graph', ['graphId']),

  edges: defineTable({
    graphId: v.id('graphs'),
    source: v.id('nodes'),
    target: v.id('nodes'),
    label: v.optional(v.string()),
    note: v.optional(v.string()),
    infoSource: v.optional(v.string()),
    directed: v.boolean(),
    updatedAt: v.number(),
  })
    .index('by_graph', ['graphId'])
    .index('by_source', ['source'])
    .index('by_target', ['target']),

  categories: defineTable({
    key: v.string(),
    label: v.string(),
    color: v.string(),
  }).index('by_key', ['key']),
})
