import type { FunctionReturnType } from 'convex/server'
import type { api } from '~convex/api'
import { assets } from '../constants/assets'

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

  // TODO: Remove ?t=<currentTimestamp> once we've sorted out js caching on cloudflare
  return `<script src="${assets.webComponentScript}?t=${new Date().getTime()}"></script>
<link rel="stylesheet" href="${assets.embedCSS}">
<div class="embed-code-container-hd-only">
<twreporter-node-graph data="${escapeHtmlAttribute(dumpedDesignData)}"></twreporter-node-graph>
</div>`
}
