import { z } from 'zod'
import { configSchema, type GraphicConfig } from './config'

const messageSchema = z.object({
  type: z.literal('graphic:set'),
  state: z.object({
    config: configSchema,
    sources: z.array(z.object({ id: z.string(), data: z.string() })),
  }),
})

export function syncGraphic(setConfig: (config: GraphicConfig) => void) {
  let editorOrigin: string | undefined
  let lastConfig = ''

  const receive = (event: MessageEvent) => {
    if (event.source !== window.parent) return
    const result = messageSchema.safeParse(event.data)
    if (!result.success) return
    editorOrigin = event.origin
    const config = result.data.state.config
    const json = JSON.stringify(config)
    if (json === lastConfig) return
    lastConfig = json
    setConfig(config)
  }

  if (window.parent !== window) {
    window.addEventListener('message', receive)
    window.parent.postMessage({ type: 'graphic:ready' }, '*')
  }

  return {
    get connected() {
      return editorOrigin !== undefined
    },
    update(config: GraphicConfig) {
      if (!editorOrigin || !new URLSearchParams(location.search).has('edit')) return
      const json = JSON.stringify(config)
      if (json === lastConfig) return
      lastConfig = json
      window.parent.postMessage(
        { type: 'graphic:update', field: 'config', value: config },
        editorOrigin,
      )
    },
  }
}
