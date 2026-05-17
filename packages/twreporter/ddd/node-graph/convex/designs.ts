import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { userMutation, userQuery } from './lib/helpers'

const legendValidator = v.object({
  label: v.string(),
  color: v.string(),
})

const nodeStyleValidator = v.object({
  backgroundColor: v.string(),
  borderColor: v.string(),
  textColor: v.string(),
  descriptionBackgroundColor: v.string(),
  descriptionTextColor: v.string(),
  descriptionDefaultOpen: v.boolean(),
})

const edgeStyleValidator = v.object({
  strokeColor: v.string(),
  arrowColor: v.string(),
  labelBackgroundColor: v.string(),
  labelTextColor: v.string(),
})

const layoutKindValidator = v.union(
  v.literal('desktop'),
  v.literal('mobile'),
  v.literal('social'),
  v.literal('custom'),
)

const designStatusValidator = v.union(
  v.literal('draft'),
  v.literal('ready'),
  v.literal('archived'),
)

const fixedLayouts = [
  { key: 'desktop', label: 'Desktop', kind: 'desktop', sortOrder: 0 },
  { key: 'mobile', label: 'Mobile', kind: 'mobile', sortOrder: 1 },
  { key: 'social', label: 'Social', kind: 'social', sortOrder: 2 },
] as const

type FixedLayoutKey = (typeof fixedLayouts)[number]['key']
type FixedLayoutPreset = (typeof fixedLayouts)[number]

const layoutDefaultsByKey: Record<FixedLayoutKey, FixedLayoutPreset> = {
  desktop: fixedLayouts[0],
  mobile: fixedLayouts[1],
  social: fixedLayouts[2],
}

function getFixedLayout(key: string): FixedLayoutPreset | undefined {
  if (key === 'desktop' || key === 'mobile' || key === 'social') {
    return layoutDefaultsByKey[key]
  }

  return undefined
}

async function touchGraph(
  ctx: MutationCtx,
  graphId: Id<'graphs'>,
  now = Date.now(),
) {
  await ctx.db.patch(graphId, { updatedAt: now })
}

async function touchDesignAndGraph(
  ctx: MutationCtx,
  design: Doc<'designs'>,
  now = Date.now(),
) {
  await ctx.db.patch(design._id, { updatedAt: now })
  await touchGraph(ctx, design.graphId, now)
}

async function getDesignNode(
  ctx: MutationCtx,
  designId: Id<'designs'>,
  nodeId: Id<'nodes'>,
) {
  return await ctx.db
    .query('designNodes')
    .withIndex('by_designId_and_nodeId', (q) =>
      q.eq('designId', designId).eq('nodeId', nodeId),
    )
    .unique()
}

async function getDesignEdge(
  ctx: MutationCtx,
  designId: Id<'designs'>,
  edgeId: Id<'edges'>,
) {
  return await ctx.db
    .query('designEdges')
    .withIndex('by_designId_and_edgeId', (q) =>
      q.eq('designId', designId).eq('edgeId', edgeId),
    )
    .unique()
}

async function ensureDesignEdge(
  ctx: MutationCtx,
  design: Doc<'designs'>,
  edgeId: Id<'edges'>,
  now: number,
) {
  const existing = await getDesignEdge(ctx, design._id, edgeId)

  if (existing) return existing._id

  return await ctx.db.insert('designEdges', {
    graphId: design.graphId,
    designId: design._id,
    edgeId,
    updatedAt: now,
  })
}

async function materializeLayout(
  ctx: MutationCtx,
  design: Doc<'designs'>,
  args: {
    key: string
    label?: string
    kind: 'desktop' | 'mobile' | 'social' | 'custom'
  },
  now: number,
) {
  const existing = await ctx.db
    .query('designLayouts')
    .withIndex('by_designId_and_key', (q) =>
      q.eq('designId', design._id).eq('key', args.key),
    )
    .unique()

  if (existing) return { layout: existing, created: false }

  const defaultLayout = getFixedLayout(args.key)
  const existingLayouts = await ctx.db
    .query('designLayouts')
    .withIndex('by_designId_and_sortOrder', (q) => q.eq('designId', design._id))
    .order('desc')
    .take(1)
  const sortOrder =
    defaultLayout?.sortOrder ?? (existingLayouts[0]?.sortOrder ?? 2) + 1
  const label = args.label ?? defaultLayout?.label ?? args.key
  const layoutId = await ctx.db.insert('designLayouts', {
    graphId: design.graphId,
    designId: design._id,
    key: args.key,
    label,
    kind: args.kind,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  })
  const layout = await ctx.db.get(layoutId)

  if (!layout) throw new Error('Failed to create design layout')

  return { layout, created: true }
}

export const listDesignsForGraph = userQuery({
  args: {
    graphId: v.id('graphs'),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) return null

    return await ctx.db
      .query('designs')
      .withIndex('by_graphId_and_updatedAt', (q) =>
        q.eq('graphId', args.graphId),
      )
      .order('desc')
      .take(50)
  },
})

export const getDesignTitle = userQuery({
  args: {
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) return null

    const graph = await ctx.db.get(design.graphId)

    if (!graph) return null

    return {
      graphId: design.graphId,
      graphName: graph.name,
      designTitle: design.title,
    }
  },
})

export const getDesign = userQuery({
  args: {
    graphId: v.id('graphs'),
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const [graph, design] = await Promise.all([
      ctx.db.get(args.graphId),
      ctx.db.get(args.designId),
    ])

    if (!graph || !design || design.graphId !== args.graphId) return null

    const [designNodeRows, layouts, designEdgeRows, categories] =
      await Promise.all([
        ctx.db
          .query('designNodes')
          .withIndex('by_designId', (q) => q.eq('designId', args.designId))
          .take(500),
        ctx.db
          .query('designLayouts')
          .withIndex('by_designId_and_sortOrder', (q) =>
            q.eq('designId', args.designId),
          )
          .collect(),
        ctx.db
          .query('designEdges')
          .withIndex('by_designId', (q) => q.eq('designId', args.designId))
          .take(1000),
        ctx.db.query('categories').collect(),
      ])
    const layoutPositionRows = (
      await Promise.all(
        layouts.map((layout) =>
          ctx.db
            .query('designLayoutNodes')
            .withIndex('by_layoutId', (q) => q.eq('layoutId', layout._id))
            .take(500),
        ),
      )
    ).flat()
    const canonicalNodes = await Promise.all(
      designNodeRows.map((designNode) => ctx.db.get(designNode.nodeId)),
    )
    const validNodeIds = new Set<Id<'nodes'>>()
    const categoriesByKey = new Map(
      categories.map((category) => [category.key, category]),
    )
    const nodes = canonicalNodes.flatMap((node) => {
      if (!node || node.graphId !== args.graphId) return []

      validNodeIds.add(node._id)
      const category = categoriesByKey.get(node.categoryKey)

      return [
        {
          ...node,
          categoryLabel: category?.label ?? node.categoryKey,
          categoryColor: category?.color ?? 'var(--neutral-gray-300)',
        },
      ]
    })
    const designNodesByNodeId = new Map(
      designNodeRows.map((designNode) => [designNode.nodeId, designNode]),
    )
    const positionsByLayoutKey: Record<
      string,
      Record<string, { x: number; y: number }>
    > = {}
    const layoutKeyById = new Map(
      layouts.map((layout) => [layout._id, layout.key]),
    )

    for (const row of layoutPositionRows) {
      if (!validNodeIds.has(row.nodeId)) continue

      const layoutKey = layoutKeyById.get(row.layoutId)

      if (!layoutKey) continue

      positionsByLayoutKey[layoutKey] ??= {}
      positionsByLayoutKey[layoutKey][row.nodeId] = row.position
    }

    const canonicalEdges = await Promise.all(
      designEdgeRows.map((designEdge) => ctx.db.get(designEdge.edgeId)),
    )
    const edges = canonicalEdges.flatMap((edge) => {
      if (
        !edge ||
        edge.graphId !== args.graphId ||
        !validNodeIds.has(edge.source) ||
        !validNodeIds.has(edge.target)
      ) {
        return []
      }

      const sourceNode = nodes.find((node) => node._id === edge.source)
      const targetNode = nodes.find((node) => node._id === edge.target)

      if (!sourceNode || !targetNode) return []

      return [
        {
          ...edge,
          sourceLabel: sourceNode.label,
          targetLabel: targetNode.label,
        },
      ]
    })

    return {
      graph,
      design,
      layouts,
      designNodes: designNodeRows.filter((row) => validNodeIds.has(row.nodeId)),
      nodes,
      designEdges: designEdgeRows,
      edges,
      positionsByLayoutKey,
      selectedNodeIds: Array.from(designNodesByNodeId.keys()),
    }
  },
})

export const listDesignLayouts = userQuery({
  args: {
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) return null

    const materializedLayouts = await ctx.db
      .query('designLayouts')
      .withIndex('by_designId_and_sortOrder', (q) =>
        q.eq('designId', args.designId),
      )
      .collect()
    const byKey = new Map(
      materializedLayouts.map((layout) => [layout.key, layout]),
    )
    const presets = fixedLayouts.map((preset) => ({
      ...preset,
      materialized: byKey.has(preset.key),
      layout: byKey.get(preset.key) ?? null,
    }))

    return { presets, layouts: materializedLayouts }
  },
})

export const listSelectableNodes = userQuery({
  args: {
    graphId: v.id('graphs'),
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design || design.graphId !== args.graphId) return null

    const [nodes, designNodes] = await Promise.all([
      ctx.db
        .query('nodes')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .take(500),
      ctx.db
        .query('designNodes')
        .withIndex('by_designId', (q) => q.eq('designId', args.designId))
        .take(500),
    ])
    const selectedNodeIds = new Set(designNodes.map((node) => node.nodeId))

    return nodes.map((node) => ({
      ...node,
      selected: selectedNodeIds.has(node._id),
    }))
  },
})

export const listSelectableEdges = userQuery({
  args: {
    graphId: v.id('graphs'),
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design || design.graphId !== args.graphId) return null

    const [designNodes, designEdges, graphEdges] = await Promise.all([
      ctx.db
        .query('designNodes')
        .withIndex('by_designId', (q) => q.eq('designId', args.designId))
        .take(500),
      ctx.db
        .query('designEdges')
        .withIndex('by_designId', (q) => q.eq('designId', args.designId))
        .take(1000),
      ctx.db
        .query('edges')
        .withIndex('by_graph', (q) => q.eq('graphId', args.graphId))
        .take(1000),
    ])
    const selectedNodeIds = new Set(designNodes.map((node) => node.nodeId))
    const includedEdgeIds = new Set(designEdges.map((edge) => edge.edgeId))

    return graphEdges
      .filter(
        (edge) =>
          selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
      )
      .map((edge) => ({
        ...edge,
        included: includedEdgeIds.has(edge._id),
      }))
  },
})

export const createDesign = userMutation({
  args: {
    graphId: v.id('graphs'),
    title: v.string(),
    description: v.optional(v.string()),
    footnotes: v.optional(v.string()),
    legends: v.optional(v.array(legendValidator)),
    backgroundColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const graph = await ctx.db.get(args.graphId)

    if (!graph) throw new Error('Graph not found')

    const now = Date.now()
    const designId = await ctx.db.insert('designs', {
      graphId: args.graphId,
      title: args.title,
      description: args.description,
      footnotes: args.footnotes,
      legends: args.legends ?? [],
      backgroundColor: args.backgroundColor ?? '#ffffff',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    })

    await touchGraph(ctx, args.graphId, now)

    return designId
  },
})

export const updateDesignMetadata = userMutation({
  args: {
    designId: v.id('designs'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    footnotes: v.optional(v.string()),
    legends: v.optional(v.array(legendValidator)),
    backgroundColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()
    const patch: Partial<Doc<'designs'>> = { updatedAt: now }

    if (args.title !== undefined) patch.title = args.title
    if (args.description !== undefined) patch.description = args.description
    if (args.footnotes !== undefined) patch.footnotes = args.footnotes
    if (args.legends !== undefined) patch.legends = args.legends
    if (args.backgroundColor !== undefined)
      patch.backgroundColor = args.backgroundColor

    await ctx.db.patch(args.designId, patch)
    await touchGraph(ctx, design.graphId, now)
  },
})

export const updateDesignNodeStyle = userMutation({
  args: {
    designId: v.id('designs'),
    nodeId: v.id('nodes'),
    nodeStyle: nodeStyleValidator,
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const designNode = await getDesignNode(ctx, args.designId, args.nodeId)

    if (!designNode) throw new Error('Node is not selected in this design')

    const now = Date.now()

    await ctx.db.patch(designNode._id, {
      nodeStyle: args.nodeStyle,
      updatedAt: now,
    })
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const updateDesignEdgeStyle = userMutation({
  args: {
    designId: v.id('designs'),
    edgeId: v.id('edges'),
    edgeStyle: edgeStyleValidator,
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const designEdge = await getDesignEdge(ctx, args.designId, args.edgeId)

    if (!designEdge) throw new Error('Edge is not selected in this design')

    const now = Date.now()

    await ctx.db.patch(designEdge._id, {
      edgeStyle: args.edgeStyle,
      updatedAt: now,
    })
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const archiveDesign = userMutation({
  args: {
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()

    await ctx.db.patch(args.designId, {
      status: 'archived',
      updatedAt: now,
    })
    await touchGraph(ctx, design.graphId, now)
  },
})

async function deleteDesignArtifacts(
  ctx: MutationCtx,
  designId: Id<'designs'>,
) {
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
}

export const deleteDesign = userMutation({
  args: {
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) return

    await deleteDesignArtifacts(ctx, args.designId)
    await ctx.db.delete(args.designId)
    await touchGraph(ctx, design.graphId)
  },
})

export const materializeDesignLayout = userMutation({
  args: {
    designId: v.id('designs'),
    key: v.string(),
    label: v.optional(v.string()),
    kind: layoutKindValidator,
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()
    const { layout, created } = await materializeLayout(ctx, design, args, now)

    if (created) await touchDesignAndGraph(ctx, design, now)

    return layout
  },
})

export const renameCustomDesignLayout = userMutation({
  args: {
    layoutId: v.id('designLayouts'),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const layout = await ctx.db.get(args.layoutId)

    if (!layout) throw new Error('Design layout not found')
    if (layout.kind !== 'custom')
      throw new Error('Only custom layouts can be renamed')

    const design = await ctx.db.get(layout.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()

    await ctx.db.patch(args.layoutId, { label: args.label, updatedAt: now })
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const deleteMaterializedDesignLayout = userMutation({
  args: {
    layoutId: v.id('designLayouts'),
  },
  handler: async (ctx, args) => {
    const layout = await ctx.db.get(args.layoutId)

    if (!layout) return

    const design = await ctx.db.get(layout.designId)

    if (!design) throw new Error('Design not found')

    const layoutNodes = await ctx.db
      .query('designLayoutNodes')
      .withIndex('by_layoutId', (q) => q.eq('layoutId', args.layoutId))
      .take(500)

    for (const layoutNode of layoutNodes) {
      await ctx.db.delete(layoutNode._id)
    }

    await ctx.db.delete(args.layoutId)
    await touchDesignAndGraph(ctx, design)
  },
})

export const addNodeToDesign = userMutation({
  args: {
    designId: v.id('designs'),
    nodeId: v.id('nodes'),
  },
  handler: async (ctx, args) => {
    const [design, node] = await Promise.all([
      ctx.db.get(args.designId),
      ctx.db.get(args.nodeId),
    ])

    if (!design) throw new Error('Design not found')
    if (!node || node.graphId !== design.graphId)
      throw new Error('Node not found')

    const existing = await getDesignNode(ctx, args.designId, args.nodeId)
    const now = Date.now()
    const designNodeId =
      existing?._id ??
      (await ctx.db.insert('designNodes', {
        graphId: design.graphId,
        designId: design._id,
        nodeId: args.nodeId,
        updatedAt: now,
      }))

    const selectedNodes = await ctx.db
      .query('designNodes')
      .withIndex('by_designId', (q) => q.eq('designId', args.designId))
      .take(500)
    const selectedNodeIds = new Set(
      selectedNodes.map((designNode) => designNode.nodeId),
    )
    const connectedEdges = (
      await Promise.all([
        ctx.db
          .query('edges')
          .withIndex('by_source', (q) => q.eq('source', args.nodeId))
          .take(500),
        ctx.db
          .query('edges')
          .withIndex('by_target', (q) => q.eq('target', args.nodeId))
          .take(500),
      ])
    ).flat()

    for (const edge of connectedEdges) {
      const otherNodeId =
        edge.source === args.nodeId ? edge.target : edge.source

      if (edge.graphId === design.graphId && selectedNodeIds.has(otherNodeId)) {
        await ensureDesignEdge(ctx, design, edge._id, now)
      }
    }

    if (!existing) await touchDesignAndGraph(ctx, design, now)

    return designNodeId
  },
})

export const addNodesToDesign = userMutation({
  args: {
    designId: v.id('designs'),
    nodeIds: v.array(v.id('nodes')),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()
    const uniqueNodeIds = Array.from(new Set(args.nodeIds))

    for (const nodeId of uniqueNodeIds) {
      const node = await ctx.db.get(nodeId)

      if (!node || node.graphId !== design.graphId)
        throw new Error('Node not found')

      const existing = await getDesignNode(ctx, args.designId, nodeId)

      if (!existing) {
        await ctx.db.insert('designNodes', {
          graphId: design.graphId,
          designId: design._id,
          nodeId,
          updatedAt: now,
        })
      }
    }

    await syncDesignEdges(ctx, design, now)
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const removeNodeFromDesign = userMutation({
  args: {
    designId: v.id('designs'),
    nodeId: v.id('nodes'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const designNode = await getDesignNode(ctx, args.designId, args.nodeId)

    if (!designNode) return

    const layoutNodes = await ctx.db
      .query('designLayoutNodes')
      .withIndex('by_designNodeId', (q) => q.eq('designNodeId', designNode._id))
      .take(500)

    for (const layoutNode of layoutNodes) {
      await ctx.db.delete(layoutNode._id)
    }

    await ctx.db.delete(designNode._id)

    const designEdges = await ctx.db
      .query('designEdges')
      .withIndex('by_designId', (q) => q.eq('designId', args.designId))
      .take(1000)

    for (const designEdge of designEdges) {
      const edge = await ctx.db.get(designEdge.edgeId)

      if (!edge || edge.source === args.nodeId || edge.target === args.nodeId) {
        await ctx.db.delete(designEdge._id)
      }
    }

    await touchDesignAndGraph(ctx, design)
  },
})

async function syncDesignEdges(
  ctx: MutationCtx,
  design: Doc<'designs'>,
  now: number,
) {
  const [designNodes, graphEdges, designEdges] = await Promise.all([
    ctx.db
      .query('designNodes')
      .withIndex('by_designId', (q) => q.eq('designId', design._id))
      .take(500),
    ctx.db
      .query('edges')
      .withIndex('by_graph', (q) => q.eq('graphId', design.graphId))
      .take(1000),
    ctx.db
      .query('designEdges')
      .withIndex('by_designId', (q) => q.eq('designId', design._id))
      .take(1000),
  ])
  const selectedNodeIds = new Set(
    designNodes.map((designNode) => designNode.nodeId),
  )
  const validEdgeIds = new Set<Id<'edges'>>()
  const designEdgesByEdgeId = new Map(
    designEdges.map((designEdge) => [designEdge.edgeId, designEdge]),
  )

  for (const edge of graphEdges) {
    if (selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)) {
      validEdgeIds.add(edge._id)
      if (!designEdgesByEdgeId.has(edge._id))
        await ensureDesignEdge(ctx, design, edge._id, now)
    }
  }

  for (const designEdge of designEdges) {
    if (!validEdgeIds.has(designEdge.edgeId)) {
      await ctx.db.delete(designEdge._id)
    }
  }
}

export const syncDesignEdgesForSelectedNodes = userMutation({
  args: {
    designId: v.id('designs'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()

    await syncDesignEdges(ctx, design, now)
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const setDesignLayoutNodePosition = userMutation({
  args: {
    designId: v.id('designs'),
    layoutKey: v.string(),
    nodeId: v.id('nodes'),
    position: v.object({ x: v.number(), y: v.number() }),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const designNode = await getDesignNode(ctx, args.designId, args.nodeId)

    if (!designNode) throw new Error('Node is not selected in this design')
    if (designNode.graphId !== design.graphId)
      throw new Error('Node does not belong to design graph')

    const defaultLayout = getFixedLayout(args.layoutKey)
    const now = Date.now()
    const { layout } = await materializeLayout(
      ctx,
      design,
      {
        key: args.layoutKey,
        kind: defaultLayout?.kind ?? 'custom',
        label: defaultLayout?.label ?? args.layoutKey,
      },
      now,
    )
    const existing = await ctx.db
      .query('designLayoutNodes')
      .withIndex('by_layoutId_and_nodeId', (q) =>
        q.eq('layoutId', layout._id).eq('nodeId', args.nodeId),
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        position: args.position,
        updatedAt: now,
      })
    } else {
      await ctx.db.insert('designLayoutNodes', {
        graphId: design.graphId,
        designId: design._id,
        layoutId: layout._id,
        designNodeId: designNode._id,
        nodeId: args.nodeId,
        position: args.position,
        updatedAt: now,
      })
    }

    await ctx.db.patch(layout._id, { updatedAt: now })
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const resetDesignLayoutNodePosition = userMutation({
  args: {
    designId: v.id('designs'),
    layoutKey: v.string(),
    nodeId: v.id('nodes'),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const layout = await ctx.db
      .query('designLayouts')
      .withIndex('by_designId_and_key', (q) =>
        q.eq('designId', args.designId).eq('key', args.layoutKey),
      )
      .unique()

    if (!layout) return

    const existing = await ctx.db
      .query('designLayoutNodes')
      .withIndex('by_layoutId_and_nodeId', (q) =>
        q.eq('layoutId', layout._id).eq('nodeId', args.nodeId),
      )
      .unique()

    if (!existing) return

    const now = Date.now()

    await ctx.db.delete(existing._id)
    await ctx.db.patch(layout._id, { updatedAt: now })
    await touchDesignAndGraph(ctx, design, now)
  },
})

export const setDesignStatus = userMutation({
  args: {
    designId: v.id('designs'),
    status: designStatusValidator,
  },
  handler: async (ctx, args) => {
    const design = await ctx.db.get(args.designId)

    if (!design) throw new Error('Design not found')

    const now = Date.now()

    await ctx.db.patch(args.designId, {
      status: args.status,
      updatedAt: now,
    })
    await touchGraph(ctx, design.graphId, now)
  },
})
