import { getDesignParams } from '@/routes/router'
import { useConvexClient, useQuery } from 'convex-svelte'
import { api } from '~convex/api'
import { getCanvasContext } from '../components/canvas/CanvasState.svelte'
import type { CanvasMetadata } from '../components/editor/types'
import { normalize } from '../utils/normalize-proxy'
import { tryCatchToast } from '../utils/try-catch-toast'

export class DesignApi {
  convex = useConvexClient()
  params = getDesignParams()
  canvasState = getCanvasContext()

  designData = useQuery(api.designs.getDesign, {
    graphId: this.params.graphId,
    designId: this.params.designId,
  })

  updateDesignMetadata = tryCatchToast(
    async ({ patch }: { patch: Partial<CanvasMetadata> }) => {
      return await this.convex.mutation(
        api.designs.updateDesignMetadata,
        {
          designId: this.params.designId,
          ...patch,
        },
        {
          optimisticUpdate: (store, args: Partial<CanvasMetadata>) => {
            const query = store.getQuery(api.designs.getDesign, this.params)

            if (!query) return

            store.setQuery(
              api.designs.getDesign,
              { graphId: this.params.graphId, designId: this.params.designId },
              normalize({
                ...query,
                design: {
                  ...query.design,
                  ...args,
                },
              }),
            )
          },
        },
      )
    },
  )
}
