import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { userMutation, userQuery } from './lib/helpers'

async function touchGraph(ctx: MutationCtx, graphId: Id<'graphs'>) {
  await ctx.db.patch(graphId, {
    updatedAt: Date.now(),
  })
}

export const getGraph = userQuery({
  args: {
    graphId: v.id('graphs'),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) return null

    const [categories, nodes, edges] = await Promise.all([
      ctx.db.query('categories').collect(),
      ctx.db.query('nodes').withIndex('by_graph', (q) => q.eq('graphId', args.graphId)).collect(),
      ctx.db.query('edges').withIndex('by_graph', (q) => q.eq('graphId', args.graphId)).collect(),
    ])

    const categoriesByKey = new Map(categories.map((category) => [category.key, category]))
    const nodesById = new Map(nodes.map((node) => [node._id, node]))

    return {
      graph,
      nodes: nodes.map((node) => {
        const category = categoriesByKey.get(node.categoryKey)

        return {
          ...node,
          categoryLabel: category?.label ?? node.categoryKey,
          categoryColor: category?.color ?? 'var(--neutral-gray-300)',
        }
      }),
      edges: edges
        .map((edge) => {
          const sourceNode = nodesById.get(edge.source)
          const targetNode = nodesById.get(edge.target)

          if (!sourceNode || !targetNode) return null

          return {
            ...edge,
            sourceLabel: sourceNode.label,
            targetLabel: targetNode.label,
          }
        })
        .filter((edge): edge is NonNullable<typeof edge> => edge !== null),
    }
  },
})

export const getGraphTitle = userQuery({
  args: {
    graphId: v.id('graphs'),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    return graph?.name ?? null
  },
})

export const listGraphs = userQuery({
  args: {},
  handler: async (ctx) => {
    const graphs = await ctx.db.query('graphs').collect()

    return graphs.sort((a, b) => b.updatedAt - a.updatedAt)
  },
})

export const updateNodePosition = userMutation({
  args: {
    nodeId: v.id('nodes'),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId)

    if (!node) throw new Error('Node not found')

    await ctx.db.patch(args.nodeId, {
      position: args.position,
      updatedAt: Date.now(),
    })

    await touchGraph(ctx, node.graphId)
  },
})

export const setNodeExpanded = userMutation({
  args: {
    nodeId: v.id('nodes'),
    expanded: v.boolean(),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId)

    if (!node) throw new Error('Node not found')

    await ctx.db.patch(args.nodeId, {
      expanded: args.expanded,
      updatedAt: Date.now(),
    })

    await touchGraph(ctx, node.graphId)
  },
})
