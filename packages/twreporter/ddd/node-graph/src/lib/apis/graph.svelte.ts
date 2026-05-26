import { getGraphParams } from '@/routes/router'
import { useConvexClient, useQuery } from 'convex-svelte'
import type { FunctionArgs, FunctionReturnType } from 'convex/server'
import { api } from '~convex/api'
import type { Id } from '~convex/dataModel'
import { normalize } from '../utils/normalize-proxy'
import { tryCatchToast } from '../utils/try-catch-toast'
import type { GraphQueryData } from './convex'

type OptimisticStore = Parameters<
  NonNullable<
    NonNullable<
      Parameters<typeof GraphApi.prototype.convex.mutation>[2]
    >['optimisticUpdate']
  >
>[0]

type ListCategoriesQueryData = NonNullable<
  FunctionReturnType<typeof api.graphs.listCategories>
>

type CreateNodeInput = Omit<
  FunctionArgs<typeof api.graphs.createNode>,
  'graphId'
>
type CreateEdgeInput = Omit<
  FunctionArgs<typeof api.graphs.createEdge>,
  'graphId'
>
type RestoreNodeSnapshotInput = Omit<
  FunctionArgs<typeof api.graphs.restoreNodeSnapshot>,
  'graphId'
>
type RestoreEdgeSnapshotInput = Omit<
  FunctionArgs<typeof api.graphs.restoreEdgeSnapshot>,
  'graphId'
>
type NodeDetailsPatch = FunctionArgs<
  typeof api.graphs.updateNodeDetails
>['patch']
type EdgeDetailsPatch = FunctionArgs<
  typeof api.graphs.updateEdgeDetails
>['patch']
type NodePositionMove = {
  nodeId: Id<'nodes'>
  position: { x: number; y: number }
}

const defaultCategoryColor = '#d1d5db'

function normalizeOptionalString(value: string | null | undefined) {
  return value?.trim() || undefined
}

function normalizeCategoryKey(label: string) {
  return label.trim().toLocaleLowerCase()
}

export class GraphApi {
  convex = useConvexClient()
  params = getGraphParams()

  graphData = useQuery(api.graphs.getGraph, { graphId: this.params.graphId })
  graphTitle = useQuery(api.graphs.getGraphTitle, {
    graphId: this.params.graphId,
  })
  categories = useQuery(api.graphs.listCategories, () => ({}))

  updateGetGraphQuery(
    store: OptimisticStore,
    update: (
      query: NonNullable<GraphQueryData>,
    ) => NonNullable<GraphQueryData>,
  ) {
    const query = store.getQuery(api.graphs.getGraph, {
      graphId: this.params.graphId,
    })

    if (!query) return

    store.setQuery(
      api.graphs.getGraph,
      { graphId: this.params.graphId },
      normalize(update(query)),
    )
  }

  updateGetGraphTitleQuery(
    store: OptimisticStore,
    update: (query: string | null) => string | null,
  ) {
    const query = store.getQuery(api.graphs.getGraphTitle, {
      graphId: this.params.graphId,
    })

    if (query === undefined) return

    store.setQuery(
      api.graphs.getGraphTitle,
      { graphId: this.params.graphId },
      update(query),
    )
  }

  updateListCategoriesQuery(
    store: OptimisticStore,
    update: (query: ListCategoriesQueryData) => ListCategoriesQueryData,
  ) {
    const query = store.getQuery(api.graphs.listCategories, {})

    if (!query) return

    store.setQuery(api.graphs.listCategories, {}, normalize(update(query)))
  }

  createNode = tryCatchToast(async (input: CreateNodeInput) => {
    return await this.convex.mutation(api.graphs.createNode, {
      graphId: this.params.graphId,
      ...input,
    })
  })

  createEdge = tryCatchToast(async (input: CreateEdgeInput) => {
    return await this.convex.mutation(api.graphs.createEdge, {
      graphId: this.params.graphId,
      ...input,
    })
  })

  restoreNodeSnapshot = tryCatchToast(
    async (input: RestoreNodeSnapshotInput) => {
      return await this.convex.mutation(api.graphs.restoreNodeSnapshot, {
        graphId: this.params.graphId,
        ...input,
      })
    },
  )

  restoreEdgeSnapshot = tryCatchToast(
    async (input: RestoreEdgeSnapshotInput) => {
      return await this.convex.mutation(api.graphs.restoreEdgeSnapshot, {
        graphId: this.params.graphId,
        ...input,
      })
    },
  )

  deleteNode = tryCatchToast(async ({ nodeId }: { nodeId: Id<'nodes'> }) => {
    return await this.convex.mutation(
      api.graphs.deleteNode,
      { nodeId },
      {
        optimisticUpdate: (store, args) => {
          this.updateGetGraphQuery(store, (query) => ({
            ...query,
            nodes: query.nodes.filter((node) => node._id !== args.nodeId),
            edges: query.edges.filter(
              (edge) =>
                edge.source !== args.nodeId && edge.target !== args.nodeId,
            ),
          }))
        },
      },
    )
  })

  deleteEdge = tryCatchToast(async ({ edgeId }: { edgeId: Id<'edges'> }) => {
    return await this.convex.mutation(
      api.graphs.deleteEdge,
      { edgeId },
      {
        optimisticUpdate: (store, args) => {
          this.updateGetGraphQuery(store, (query) => ({
            ...query,
            edges: query.edges.filter((edge) => edge._id !== args.edgeId),
          }))
        },
      },
    )
  })

  updateNodeDetails = tryCatchToast(
    async ({
      nodeId,
      patch,
    }: {
      nodeId: Id<'nodes'>
      patch: NodeDetailsPatch
    }) => {
      return await this.convex.mutation(
        api.graphs.updateNodeDetails,
        { nodeId, patch },
        {
          optimisticUpdate: (store, args) => {
            const categories = store.getQuery(api.graphs.listCategories, {})
            const categoryLabel = args.patch.categoryLabel?.trim()
            const categoryKey = categoryLabel
              ? normalizeCategoryKey(categoryLabel)
              : undefined
            const category = categoryKey
              ? categories?.find((item) => item.key === categoryKey)
              : undefined
            const label = args.patch.label?.trim()

            this.updateGetGraphQuery(store, (query) => ({
              ...query,
              nodes: query.nodes.map((node) =>
                node._id === args.nodeId
                  ? {
                      ...node,
                      ...(label !== undefined ? { label } : {}),
                      ...(categoryLabel !== undefined && categoryKey
                        ? {
                            categoryKey,
                            categoryLabel,
                            categoryColor:
                              category?.color ?? defaultCategoryColor,
                          }
                        : {}),
                      ...(args.patch.note !== undefined
                        ? {
                            note: normalizeOptionalString(args.patch.note),
                          }
                        : {}),
                      ...(args.patch.infoSource !== undefined
                        ? {
                            infoSource: normalizeOptionalString(
                              args.patch.infoSource,
                            ),
                          }
                        : {}),
                      ...(args.patch.imageUrl !== undefined
                        ? {
                            imageUrl: normalizeOptionalString(
                              args.patch.imageUrl,
                            ),
                          }
                        : {}),
                      ...(args.patch.expanded !== undefined
                        ? { expanded: args.patch.expanded }
                        : {}),
                    }
                  : node,
              ),
              edges:
                label === undefined
                  ? query.edges
                  : query.edges.map((edge) => ({
                      ...edge,
                      ...(edge.source === args.nodeId
                        ? { sourceLabel: label }
                        : {}),
                      ...(edge.target === args.nodeId
                        ? { targetLabel: label }
                        : {}),
                    })),
            }))

            if (!categoryLabel || !categoryKey) return

            this.updateListCategoriesQuery(store, (query) => {
              if (query.some((item) => item.key === categoryKey)) return query

              return [
                ...query,
                {
                  _id: `optimistic-category:${categoryKey}` as Id<'categories'>,
                  _creationTime: Date.now(),
                  key: categoryKey,
                  label: categoryLabel,
                  color: defaultCategoryColor,
                },
              ]
            })
          },
        },
      )
    },
  )

  updateEdgeDetails = tryCatchToast(
    async ({
      edgeId,
      patch,
    }: {
      edgeId: Id<'edges'>
      patch: EdgeDetailsPatch
    }) => {
      return await this.convex.mutation(
        api.graphs.updateEdgeDetails,
        { edgeId, patch },
        {
          optimisticUpdate: (store, args) => {
            this.updateGetGraphQuery(store, (query) => ({
              ...query,
              edges: query.edges.map((edge) =>
                edge._id === args.edgeId
                  ? {
                      ...edge,
                      ...(args.patch.label !== undefined
                        ? {
                            label: normalizeOptionalString(args.patch.label),
                          }
                        : {}),
                      ...(args.patch.note !== undefined
                        ? {
                            note: normalizeOptionalString(args.patch.note),
                          }
                        : {}),
                      ...(args.patch.infoSource !== undefined
                        ? {
                            infoSource: normalizeOptionalString(
                              args.patch.infoSource,
                            ),
                          }
                        : {}),
                      ...(args.patch.directed !== undefined
                        ? { directed: args.patch.directed }
                        : {}),
                    }
                  : edge,
              ),
            }))
          },
        },
      )
    },
  )

  updateNodePositions = tryCatchToast(
    async ({ moves }: { moves: NodePositionMove[] }) => {
      return await this.convex.mutation(
        api.graphs.updateNodePositions,
        {
          graphId: this.params.graphId,
          moves,
        },
        {
          optimisticUpdate: (store, args) => {
            const moves = args.moves as NodePositionMove[]
            const positions = new Map(
              moves.map((move) => [move.nodeId, move.position]),
            )

            this.updateGetGraphQuery(store, (query) => ({
              ...query,
              nodes: query.nodes.map((node) => {
                const position = positions.get(node._id)

                return position ? { ...node, position } : node
              }),
            }))
          },
        },
      )
    },
  )
}
