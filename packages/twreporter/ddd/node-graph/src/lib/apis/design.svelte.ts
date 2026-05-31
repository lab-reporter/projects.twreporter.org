import { getDesignParams } from '@/routes/router'
import { useConvexClient, useQuery } from 'convex-svelte'
import { api } from '~convex/api'
import { getCanvasContext } from '../components/canvas/CanvasState.svelte'
import type {
  CanvasMetadata,
  EdgeStyle,
  NodeStyle,
} from '../components/editor/types'
import { normalizeEdgeStyle, normalizeNodeStyle } from '../utils/canvas'
import { normalize } from '../utils/normalize-proxy'
import { tryCatchToast } from '../utils/try-catch-toast'
import type { Id } from '~convex/dataModel'
import type { DesignQueryData } from './convex'

type OptimisticStore = Parameters<
  NonNullable<
    NonNullable<
      Parameters<typeof DesignApi.prototype.convex.mutation>[2]
    >['optimisticUpdate']
  >
>[0]

type LayoutNodeMove = {
  nodeId: Id<'nodes'>
  position: { x: number; y: number }
}

export class DesignApi {
  convex = useConvexClient()
  params = getDesignParams()
  canvasState = getCanvasContext()

  designData = useQuery(api.designs.getDesign, {
    graphId: this.params.graphId,
    designId: this.params.designId,
  })

  getCategoriesQuery = () => useQuery(api.categories.getCategories)

  updateGetDesignQuery(
    store: OptimisticStore,
    update: (
      query: NonNullable<DesignQueryData>,
    ) => NonNullable<DesignQueryData>,
  ) {
    const query = store.getQuery(api.designs.getDesign, this.params)

    if (!query) return

    store.setQuery(api.designs.getDesign, this.params, normalize(update(query)))
  }

  updateDesignMetadata = tryCatchToast(
    async ({ patch }: { patch: Partial<CanvasMetadata> }) => {
      return await this.convex.mutation(
        api.designs.updateDesignMetadata,
        {
          designId: this.params.designId,
          ...patch,
        },
        {
          optimisticUpdate: (store, args) => {
            this.updateGetDesignQuery(store, (query) => {
              const { designId: _designId, ...metadataPatch } = args

              return {
                ...query,
                design: {
                  ...query.design,
                  ...metadataPatch,
                },
              }
            })
          },
        },
      )
    },
  )

  updateDesignNodeStyle = tryCatchToast(
    async ({
      nodeId,
      patch,
    }: {
      nodeId: Id<'nodes'>
      patch: Partial<NodeStyle>
    }) => {
      return await this.convex.mutation(
        api.designs.updateDesignNodeStyle,
        {
          designId: this.params.designId,
          nodeId,
          patch,
        },
        {
          optimisticUpdate: (store, args) => {
            this.updateGetDesignQuery(store, (query) => ({
              ...query,
              designNodes: query.designNodes.map((designNode) =>
                designNode.nodeId === args.nodeId
                  ? {
                      ...designNode,
                      nodeStyle: normalizeNodeStyle({
                        ...designNode.nodeStyle,
                        ...args.patch,
                      }),
                    }
                  : designNode,
              ),
            }))
          },
        },
      )
    },
  )

  updateDesignEdgeStyle = tryCatchToast(
    async ({
      edgeId,
      patch,
    }: {
      edgeId: Id<'edges'>
      patch: Partial<EdgeStyle>
    }) => {
      return await this.convex.mutation(
        api.designs.updateDesignEdgeStyle,
        {
          designId: this.params.designId,
          edgeId,
          patch,
        },
        {
          optimisticUpdate: (store, args) => {
            this.updateGetDesignQuery(store, (query) => ({
              ...query,
              designEdges: query.designEdges.map((designEdge) =>
                designEdge.edgeId === args.edgeId
                  ? {
                      ...designEdge,
                      edgeStyle: normalizeEdgeStyle({
                        ...designEdge.edgeStyle,
                        ...args.patch,
                      }),
                    }
                  : designEdge,
              ),
            }))
          },
        },
      )
    },
  )

  setDesignLayoutNodePositions = tryCatchToast(
    async ({
      layoutKey,
      moves,
    }: {
      layoutKey: string
      moves: LayoutNodeMove[]
    }) => {
      return await this.convex.mutation(
        api.designs.setDesignLayoutNodePositions,
        {
          designId: this.params.designId,
          layoutKey,
          moves,
        },
        {
          optimisticUpdate: (store, args) => {
            this.updateGetDesignQuery(store, (query) => ({
              ...query,
              positionsByLayoutKey: {
                ...query.positionsByLayoutKey,
                [args.layoutKey]: {
                  ...query.positionsByLayoutKey[args.layoutKey],
                  ...Object.fromEntries(
                    args.moves.map((move: LayoutNodeMove) => [
                      move.nodeId,
                      move.position,
                    ]),
                  ),
                },
              },
            }))
          },
        },
      )
    },
  )
}
