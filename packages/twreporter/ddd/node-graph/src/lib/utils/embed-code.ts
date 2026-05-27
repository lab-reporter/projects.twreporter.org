import type { Rect } from '@xyflow/svelte'
import type { DesignQueryData } from '../apis/convex'
import { assets } from '../constants/assets'

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function buildNodeGraphEmbedCode({
  graph,
  withControl = false,
  bounds,
}: {
  graph?: DesignQueryData | null
  withControl?: boolean
  bounds?: Rect
}) {
  if (!graph) return

  const dumpedDesignData = JSON.stringify(graph)
  const dumpedBounds = JSON.stringify(bounds)

  // TODO: Remove ?t=<currentTimestamp> once we've sorted out js caching on cloudflare
  return `<script src="${assets.webComponentScript}?t=${new Date().getTime()}"></script>
<link rel="stylesheet" href="${assets.embedCSS}">
<div class="embed-code-container-hd-only">
<twreporter-node-graph data="${escapeHtmlAttribute(dumpedDesignData)}"${withControl ? ' control="true"' : ''}${bounds ? ` bounds="${escapeHtmlAttribute(dumpedBounds)}"` : ''}></twreporter-node-graph>
</div>`
}
