import type { FunctionReturnType } from 'convex/server'
import type { api } from '~convex/api'

export type DesignQueryData = NonNullable<
  FunctionReturnType<typeof api.designs.getDesign>
>
export type GraphQueryData = NonNullable<
  FunctionReturnType<typeof api.graphs.getGraph>
>
