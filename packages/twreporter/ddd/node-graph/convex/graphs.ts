import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { userMutation, userQuery } from './lib/helpers'
import { categoryFields, edgeFields, graphFields, nodeFields } from './schema'

const graphParams = { graphId: nodeFields.graphId }
const nodeParams = { nodeId: v.id('nodes') }
const edgeParams = { edgeId: v.id('edges') }

const optionalStringPatch = v.union(v.string(), v.null())

async function touchGraph(ctx: MutationCtx, graphId: Id<'graphs'>) {
  await ctx.db.patch(graphId, {
    updatedAt: Date.now(),
  })
}

function normalizeCategoryKey(label: string) {
  return label.trim().toLocaleLowerCase()
}

function normalizeLegacyCategoryKey(key: string) {
  return key.trim().toLocaleLowerCase()
}

async function ensureCategory(ctx: MutationCtx, label: string) {
  const trimmedLabel = label.trim()
  const key = normalizeCategoryKey(trimmedLabel)

  if (!key) throw new Error('Category is required')

  const existing = await ctx.db
    .query('categories')
    .withIndex('by_key', (q) => q.eq('key', key))
    .unique()

  if (existing) return existing

  const categoryId = await ctx.db.insert('categories', {
    key,
    label: trimmedLabel,
    color: '#d1d5db',
  })
  const category = await ctx.db.get(categoryId)

  if (!category) throw new Error('Failed to create category')

  return category
}

async function ensureLegacyCategory(
  ctx: MutationCtx,
  input: { key: string; label?: string; color?: string },
) {
  const key = normalizeLegacyCategoryKey(input.key)
  const label = input.label?.trim() || input.key.trim()

  if (!key) throw new Error('Category is required')

  const existing = await ctx.db
    .query('categories')
    .withIndex('by_key', (q) => q.eq('key', key))
    .unique()

  if (existing) return existing

  const categoryId = await ctx.db.insert('categories', {
    key,
    label,
    color: input.color?.trim() || '#d1d5db',
  })
  const category = await ctx.db.get(categoryId)

  if (!category) throw new Error('Failed to create category')

  return category
}

type LegacyCategory = {
  label?: unknown
  color?: unknown
}

type LegacyNode = {
  id?: unknown
  label?: unknown
  category?: unknown
  note?: unknown
  infoSource?: unknown
  position?: unknown
}

type LegacyEdge = {
  id?: unknown
  source?: unknown
  target?: unknown
  label?: unknown
  note?: unknown
  infoSource?: unknown
}

type LegacyGraph = {
  version?: unknown
  nodes?: unknown
  edges?: unknown
  categories?: unknown
}

type ParsedLegacyNode = LegacyNode & {
  id: string
  label: string
  category: string
  position: { x: number; y: number }
}

type ParsedLegacyEdge = LegacyEdge & {
  id: string
  source: string
  target: string
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function parseLegacyGraph(value: unknown): LegacyGraph {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Legacy graph payload must be an object')
  }

  return value as LegacyGraph
}

function parseLegacyNode(value: unknown): ParsedLegacyNode {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Legacy node payload must be an object')
  }

  const node = value as LegacyNode

  if (typeof node.id !== 'string') throw new Error('Legacy node id is required')
  if (typeof node.label !== 'string')
    throw new Error(`Legacy node ${node.id} is missing a label`)
  if (typeof node.category !== 'string')
    throw new Error(`Legacy node ${node.id} is missing a category`)
  if (
    !node.position ||
    typeof node.position !== 'object' ||
    Array.isArray(node.position) ||
    typeof (node.position as { x?: unknown }).x !== 'number' ||
    typeof (node.position as { y?: unknown }).y !== 'number'
  ) {
    throw new Error(`Legacy node ${node.id} is missing a valid position`)
  }

  return node as ParsedLegacyNode
}

function parseLegacyEdge(value: unknown): ParsedLegacyEdge {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Legacy edge payload must be an object')
  }

  const edge = value as LegacyEdge

  if (typeof edge.id !== 'string') throw new Error('Legacy edge id is required')
  if (typeof edge.source !== 'string')
    throw new Error(`Legacy edge ${edge.id} is missing a source`)
  if (typeof edge.target !== 'string')
    throw new Error(`Legacy edge ${edge.id} is missing a target`)

  return edge as ParsedLegacyEdge
}

function getLegacyCategoryMetadata(categories: unknown, key: string) {
  if (
    !categories ||
    typeof categories !== 'object' ||
    Array.isArray(categories)
  )
    return undefined

  const category = (categories as Record<string, unknown>)[key]

  if (!category || typeof category !== 'object' || Array.isArray(category))
    return undefined

  return category as LegacyCategory
}

export const getGraph = userQuery({
  args: graphParams,
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) return null

    const [categories, nodes, edges] = await Promise.all([
      ctx.db.query('categories').collect(),
      ctx.db
        .query('nodes')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .collect(),
      ctx.db
        .query('edges')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .collect(),
    ])

    const categoriesByKey = new Map(
      categories.map((category) => [category.key, category]),
    )
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
  args: graphParams,
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

export const listCategories = userQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('categories').take(200)
  },
})

export const createGraph = userMutation({
  args: {
    name: graphFields.name,
    description: graphFields.description,
  },
  handler: async (ctx, args) => {
    const name = args.name.trim()
    const description = args.description?.trim()

    if (!name) throw new Error('Graph name is required')

    const now = Date.now()

    return await ctx.db.insert('graphs', {
      name,
      description: description || undefined,
      updatedAt: now,
    })
  },
})

async function deleteDesignById(ctx: MutationCtx, designId: Id<'designs'>) {
  const [designNodes, designEdges, designLayouts] = await Promise.all([
    ctx.db
      .query('designNodes')
      .withIndex('by_designId', (q) => q.eq('designId', designId))
      .collect(),
    ctx.db
      .query('designEdges')
      .withIndex('by_designId', (q) => q.eq('designId', designId))
      .collect(),
    ctx.db
      .query('designLayouts')
      .withIndex('by_designId_and_sortOrder', (q) => q.eq('designId', designId))
      .collect(),
  ])

  for (const designLayout of designLayouts) {
    const layoutNodes = await ctx.db
      .query('designLayoutNodes')
      .withIndex('by_layoutId', (q) => q.eq('layoutId', designLayout._id))
      .collect()

    for (const layoutNode of layoutNodes) {
      await ctx.db.delete(layoutNode._id)
    }

    await ctx.db.delete(designLayout._id)
  }

  for (const designNode of designNodes) {
    await ctx.db.delete(designNode._id)
  }

  for (const designEdge of designEdges) {
    await ctx.db.delete(designEdge._id)
  }

  await ctx.db.delete(designId)
}

export const deleteGraph = userMutation({
  args: graphParams,
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) return

    const [designs, nodes, edges] = await Promise.all([
      ctx.db
        .query('designs')
        .withIndex('by_graphId_and_updatedAt', (q) =>
          q.eq('graphId', args.graphId),
        )
        .collect(),
      ctx.db
        .query('nodes')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .collect(),
      ctx.db
        .query('edges')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .collect(),
    ])

    for (const design of designs) {
      await deleteDesignById(ctx, design._id)
    }

    for (const edge of edges) {
      await ctx.db.delete(edge._id)
    }

    for (const node of nodes) {
      await ctx.db.delete(node._id)
    }

    await ctx.db.delete(args.graphId)
  },
})

export const importLegacyGraph = userMutation({
  args: {
    fileName: v.string(),
    legacyGraph: v.any(),
  },
  handler: async (ctx, args) => {
    const legacyGraph = parseLegacyGraph(args.legacyGraph)

    if (legacyGraph.version !== '2.5') {
      throw new Error('Only legacy graph version 2.5 is supported')
    }
    if (!Array.isArray(legacyGraph.nodes))
      throw new Error('Legacy graph nodes must be an array')
    if (!Array.isArray(legacyGraph.edges))
      throw new Error('Legacy graph edges must be an array')

    const name =
      args.fileName.replace(/\.json$/i, '').trim() || 'Imported legacy graph'
    const now = Date.now()
    const graphId = await ctx.db.insert('graphs', {
      name,
      description: `Imported from legacy graph format v${legacyGraph.version}`,
      updatedAt: now,
    })
    const legacyNodeIdToNodeId = new Map<string, Id<'nodes'>>()

    for (const rawNode of legacyGraph.nodes) {
      const node = parseLegacyNode(rawNode)
      const legacyNodeId = node.id.trim()
      const label = node.label.trim()

      if (!legacyNodeId) throw new Error('Legacy node id is required')
      if (!label)
        throw new Error(`Legacy node ${legacyNodeId} is missing a label`)
      if (legacyNodeIdToNodeId.has(legacyNodeId)) {
        throw new Error(`Duplicate legacy node id: ${legacyNodeId}`)
      }

      const categoryMetadata = getLegacyCategoryMetadata(
        legacyGraph.categories,
        node.category,
      )
      const category = await ensureLegacyCategory(ctx, {
        key: node.category,
        label: asOptionalString(categoryMetadata?.label),
        color: asOptionalString(categoryMetadata?.color),
      })
      const nodeId = await ctx.db.insert('nodes', {
        graphId,
        label,
        categoryKey: category.key,
        note: asOptionalString(node.note)?.trim() || undefined,
        infoSource: asOptionalString(node.infoSource)?.trim() || undefined,
        position: node.position,
        expanded: false,
        updatedAt: now,
      })

      legacyNodeIdToNodeId.set(legacyNodeId, nodeId)
    }

    let importedEdgeCount = 0

    for (const rawEdge of legacyGraph.edges) {
      const edge = parseLegacyEdge(rawEdge)
      const source = legacyNodeIdToNodeId.get(edge.source.trim())
      const target = legacyNodeIdToNodeId.get(edge.target.trim())

      if (!source || !target) {
        throw new Error(`Legacy edge ${edge.id} references a missing node`)
      }

      if (source === target) continue

      await ctx.db.insert('edges', {
        graphId,
        source,
        target,
        label: asOptionalString(edge.label)?.trim() || undefined,
        note: asOptionalString(edge.note)?.trim() || undefined,
        infoSource: asOptionalString(edge.infoSource)?.trim() || undefined,
        directed: false,
        updatedAt: now,
      })
      importedEdgeCount += 1
    }

    return {
      graphId,
      nodeCount: legacyNodeIdToNodeId.size,
      edgeCount: importedEdgeCount,
    }
  },
})

export const upsertCategory = userMutation({
  args: {
    label: categoryFields.label,
  },
  handler: async (ctx, args) => {
    return await ensureCategory(ctx, args.label)
  },
})

export const createNode = userMutation({
  args: {
    graphId: nodeFields.graphId,
    label: nodeFields.label,
    categoryLabel: categoryFields.label,
    note: nodeFields.note,
    infoSource: nodeFields.infoSource,
    imageUrl: nodeFields.imageUrl,
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) throw new Error('Graph not found')

    const label = args.label.trim()

    if (!label) throw new Error('Node label is required')

    const category = await ensureCategory(ctx, args.categoryLabel)
    const now = Date.now()
    const siblingNodes = await ctx.db
      .query('nodes')
      .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
      .take(500)
    const index = siblingNodes.length
    const nodeId = await ctx.db.insert('nodes', {
      graphId: args.graphId,
      label,
      categoryKey: category.key,
      note: args.note?.trim() || undefined,
      infoSource: args.infoSource?.trim() || undefined,
      position: {
        x: 120 + (index % 8) * 140,
        y: 120 + Math.floor(index / 8) * 110,
      },
      expanded: false,
      updatedAt: now,
      imageUrl: args.imageUrl,
    })

    await touchGraph(ctx, args.graphId)

    return nodeId
  },
})

export const restoreNodeSnapshot = userMutation({
  args: {
    graphId: nodeFields.graphId,
    node: v.object({
      label: nodeFields.label,
      categoryLabel: categoryFields.label,
      note: nodeFields.note,
      infoSource: nodeFields.infoSource,
      position: nodeFields.position,
      expanded: nodeFields.expanded,
      imageUrl: nodeFields.imageUrl,
    }),
    edges: v.array(
      v.object({
        source: v.union(edgeFields.source, v.literal('__RESTORED_NODE__')),
        target: v.union(edgeFields.target, v.literal('__RESTORED_NODE__')),
        label: edgeFields.label,
        note: edgeFields.note,
        infoSource: edgeFields.infoSource,
        directed: edgeFields.directed,
      }),
    ),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) throw new Error('Graph not found')

    const label = args.node.label.trim()

    if (!label) throw new Error('Node label is required')

    const category = await ensureCategory(ctx, args.node.categoryLabel)
    const now = Date.now()
    const nodeId = await ctx.db.insert('nodes', {
      graphId: args.graphId,
      label,
      categoryKey: category.key,
      note: args.node.note?.trim() || undefined,
      infoSource: args.node.infoSource?.trim() || undefined,
      position: args.node.position,
      expanded: args.node.expanded,
      updatedAt: now,
      imageUrl: args.node.imageUrl?.trim() || undefined,
    })
    const edgeIds = []

    for (const edge of args.edges) {
      const source = edge.source === '__RESTORED_NODE__' ? nodeId : edge.source
      const target = edge.target === '__RESTORED_NODE__' ? nodeId : edge.target

      if (source === target) continue

      const [sourceNode, targetNode] = await Promise.all([
        ctx.db.get(source),
        ctx.db.get(target),
      ])

      if (!sourceNode || sourceNode.graphId !== args.graphId) continue
      if (!targetNode || targetNode.graphId !== args.graphId) continue

      edgeIds.push(
        await ctx.db.insert('edges', {
          graphId: args.graphId,
          source,
          target,
          label: edge.label?.trim() || undefined,
          note: edge.note?.trim() || undefined,
          infoSource: edge.infoSource?.trim() || undefined,
          directed: edge.directed,
          updatedAt: now,
        }),
      )
    }

    await touchGraph(ctx, args.graphId)

    return { nodeId, edgeIds }
  },
})

export const updateNodeDetails = userMutation({
  args: {
    ...nodeParams,
    patch: v.object({
      label: v.optional(nodeFields.label),
      categoryLabel: v.optional(categoryFields.label),
      note: v.optional(optionalStringPatch),
      infoSource: v.optional(optionalStringPatch),
      imageUrl: v.optional(optionalStringPatch),
      expanded: v.optional(nodeFields.expanded),
    }),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId)

    if (!node) throw new Error('Node not found')

    const patch: Partial<Doc<'nodes'>> = {}

    if (args.patch.label !== undefined) {
      const label = args.patch.label.trim()

      if (!label) throw new Error('Node label is required')

      patch.label = label
    }
    if (args.patch.categoryLabel !== undefined) {
      const category = await ensureCategory(ctx, args.patch.categoryLabel)

      patch.categoryKey = category.key
    }
    if (args.patch.note !== undefined) {
      patch.note = args.patch.note?.trim() || undefined
    }
    if (args.patch.infoSource !== undefined) {
      patch.infoSource = args.patch.infoSource?.trim() || undefined
    }
    if (args.patch.imageUrl !== undefined) {
      patch.imageUrl = args.patch.imageUrl?.trim() || undefined
    }
    if (args.patch.expanded !== undefined) {
      patch.expanded = args.patch.expanded
    }

    const now = Date.now()

    await ctx.db.patch(args.nodeId, {
      ...patch,
      updatedAt: now,
    })
    await touchGraph(ctx, node.graphId)
  },
})

export const deleteNode = userMutation({
  args: nodeParams,
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId)

    if (!node) return

    const [sourceEdges, targetEdges, designNodes] = await Promise.all([
      ctx.db
        .query('edges')
        .withIndex('by_source', (q) => q.eq('source', args.nodeId))
        .take(500),
      ctx.db
        .query('edges')
        .withIndex('by_target', (q) => q.eq('target', args.nodeId))
        .take(500),
      ctx.db
        .query('designNodes')
        .withIndex('by_nodeId', (q) => q.eq('nodeId', args.nodeId))
        .take(500),
    ])
    const edgeIds = new Set(
      [...sourceEdges, ...targetEdges].map((edge) => edge._id),
    )

    for (const edgeId of edgeIds) {
      await deleteEdgeById(ctx, edgeId)
    }

    for (const designNode of designNodes) {
      await deleteDesignNodeArtifacts(ctx, designNode)
      await ctx.db.delete(designNode._id)
    }

    await ctx.db.delete(args.nodeId)
    await touchGraph(ctx, node.graphId)
  },
})

async function deleteDesignNodeArtifacts(
  ctx: MutationCtx,
  designNode: Doc<'designNodes'>,
) {
  const layoutNodes = await ctx.db
    .query('designLayoutNodes')
    .withIndex('by_designNodeId', (q) => q.eq('designNodeId', designNode._id))
    .take(500)

  for (const layoutNode of layoutNodes) {
    await ctx.db.delete(layoutNode._id)
  }
}

async function deleteEdgeById(ctx: MutationCtx, edgeId: Id<'edges'>) {
  const designEdges = await ctx.db
    .query('designEdges')
    .withIndex('by_edgeId', (q) => q.eq('edgeId', edgeId))
    .take(500)

  for (const designEdge of designEdges) {
    await ctx.db.delete(designEdge._id)
  }

  await ctx.db.delete(edgeId)
}

export const createEdge = userMutation({
  args: {
    graphId: edgeFields.graphId,
    source: edgeFields.source,
    target: edgeFields.target,
    label: edgeFields.label,
    note: edgeFields.note,
    infoSource: edgeFields.infoSource,
    directed: edgeFields.directed,
  },
  handler: async (ctx, args) => {
    if (args.source === args.target)
      throw new Error('Self-loop edges are not allowed')

    const [graph, sourceNode, targetNode] = await Promise.all([
      ctx.db.get(args.graphId),
      ctx.db.get(args.source),
      ctx.db.get(args.target),
    ])

    if (!graph) throw new Error('Graph not found')
    if (!sourceNode || sourceNode.graphId !== args.graphId)
      throw new Error('Source node not found')
    if (!targetNode || targetNode.graphId !== args.graphId)
      throw new Error('Target node not found')

    const now = Date.now()
    const edgeId = await ctx.db.insert('edges', {
      graphId: args.graphId,
      source: args.source,
      target: args.target,
      label: args.label?.trim() || undefined,
      note: args.note?.trim() || undefined,
      infoSource: args.infoSource?.trim() || undefined,
      directed: args.directed,
      updatedAt: now,
    })

    await touchGraph(ctx, args.graphId)

    return edgeId
  },
})

export const restoreEdgeSnapshot = userMutation({
  args: {
    graphId: edgeFields.graphId,
    edge: v.object({
      source: edgeFields.source,
      target: edgeFields.target,
      label: edgeFields.label,
      note: edgeFields.note,
      infoSource: edgeFields.infoSource,
      directed: edgeFields.directed,
    }),
  },
  handler: async (ctx, args) => {
    if (args.edge.source === args.edge.target)
      throw new Error('Self-loop edges are not allowed')

    const [graph, sourceNode, targetNode] = await Promise.all([
      ctx.db.get(args.graphId),
      ctx.db.get(args.edge.source),
      ctx.db.get(args.edge.target),
    ])

    if (!graph) throw new Error('Graph not found')
    if (!sourceNode || sourceNode.graphId !== args.graphId)
      throw new Error('Source node not found')
    if (!targetNode || targetNode.graphId !== args.graphId)
      throw new Error('Target node not found')

    const now = Date.now()
    const edgeId = await ctx.db.insert('edges', {
      graphId: args.graphId,
      source: args.edge.source,
      target: args.edge.target,
      label: args.edge.label?.trim() || undefined,
      note: args.edge.note?.trim() || undefined,
      infoSource: args.edge.infoSource?.trim() || undefined,
      directed: args.edge.directed,
      updatedAt: now,
    })

    await touchGraph(ctx, args.graphId)

    return edgeId
  },
})

export const updateEdgeDetails = userMutation({
  args: {
    ...edgeParams,
    patch: v.object({
      label: v.optional(optionalStringPatch),
      note: v.optional(optionalStringPatch),
      infoSource: v.optional(optionalStringPatch),
      directed: v.optional(edgeFields.directed),
    }),
  },
  handler: async (ctx, args) => {
    const edge = await ctx.db.get(args.edgeId)

    if (!edge) throw new Error('Edge not found')

    const patch: Partial<Doc<'edges'>> = {}

    if (args.patch.label !== undefined) {
      patch.label = args.patch.label?.trim() || undefined
    }
    if (args.patch.note !== undefined) {
      patch.note = args.patch.note?.trim() || undefined
    }
    if (args.patch.infoSource !== undefined) {
      patch.infoSource = args.patch.infoSource?.trim() || undefined
    }
    if (args.patch.directed !== undefined) {
      patch.directed = args.patch.directed
    }

    const now = Date.now()

    await ctx.db.patch(args.edgeId, {
      ...patch,
      updatedAt: now,
    })
    await touchGraph(ctx, edge.graphId)
  },
})

export const deleteEdge = userMutation({
  args: edgeParams,
  handler: async (ctx, args) => {
    const edge = await ctx.db.get(args.edgeId)

    if (!edge) return

    await deleteEdgeById(ctx, args.edgeId)
    await touchGraph(ctx, edge.graphId)
  },
})

export const updateNodePositions = userMutation({
  args: {
    graphId: nodeFields.graphId,
    moves: v.array(
      v.object({
        nodeId: v.id('nodes'),
        position: nodeFields.position,
      }),
    ),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) throw new Error('Graph not found')

    const now = Date.now()

    for (const move of args.moves) {
      const node = await ctx.db.get(move.nodeId)

      if (!node) throw new Error('Node not found')
      if (node.graphId !== args.graphId) throw new Error('Node not found')

      await ctx.db.patch(move.nodeId, {
        position: move.position,
        updatedAt: now,
      })
    }

    await touchGraph(ctx, args.graphId)
  },
})
