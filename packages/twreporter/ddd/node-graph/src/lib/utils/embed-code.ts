import type { FunctionReturnType } from 'convex/server'
import type { api } from '~convex/api'

type DesignQueryData = NonNullable<
  FunctionReturnType<typeof api.designs.getDesign>
>

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function buildNodeGraphEmbedCode(graph?: DesignQueryData | null) {
  if (!graph) return

  const dumpedDesignData = JSON.stringify(graph)

  return `<twreporter-node-graph data="${escapeHtmlAttribute(dumpedDesignData)}"></twreporter-node-graph>`
}
