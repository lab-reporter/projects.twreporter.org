import { onMount } from 'svelte'
import { z, type ZodType } from 'zod'

export const GraphicSyncMessage = {
  Set: 'graphic:set',
  Ready: 'graphic:ready',
  Update: 'graphic:update',
} as const

const sourcesSchema = z.array(z.object({ id: z.string(), data: z.string() }))
export type GraphicSources = z.infer<typeof sourcesSchema>

type SyncedValue<Value> = {
  get: () => Value | undefined
  set: (value: Value) => void
}

export function syncGraphic<Config>(
  configSchema: ZodType<Config>,
  values: {
    config: SyncedValue<Config>
    sources: SyncedValue<GraphicSources>
  },
) {
  const messageSchema = z.object({
    type: z.literal(GraphicSyncMessage.Set),
    state: z.object({ config: configSchema, sources: sourcesSchema }),
  })
  let editable = $state(false)
  let editorOrigin: string | undefined = $state()
  // Wire values suppress echoes; local values account for codec normalization,
  // such as CSV line endings changing during parsing and serialization.
  const lastWire = { config: '', sources: '' }
  const lastLocal = { config: '', sources: '' }

  onMount(() => {
    if (window.parent === window) return

    const receiveMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return
      const result = messageSchema.safeParse(event.data)
      if (!result.success) return

      try {
        const { config, sources } = result.data.state
        const configJson = JSON.stringify(config)
        const sourcesJson = JSON.stringify(sources)
        if (sourcesJson !== lastWire.sources) {
          values.sources.set(sources)
          lastWire.sources = sourcesJson
          lastLocal.sources = JSON.stringify(values.sources.get())
        }
        if (configJson !== lastWire.config) {
          values.config.set(config)
          lastWire.config = configJson
          lastLocal.config = JSON.stringify(values.config.get())
        }
        editorOrigin = event.origin
        editable = new URLSearchParams(window.location.search).has('edit')
      } catch (error) {
        console.error(error)
      }
    }

    window.addEventListener('message', receiveMessage)
    window.parent.postMessage({ type: GraphicSyncMessage.Ready }, '*')
    return () => window.removeEventListener('message', receiveMessage)
  })

  for (const field of ['config', 'sources'] as const) {
    $effect(() => {
      if (!editable || editorOrigin === undefined) return
      const value = $state.snapshot(values[field].get())
      if (value === undefined) return
      const json = JSON.stringify(value)
      if (json === lastLocal[field]) return
      lastLocal[field] = json
      lastWire[field] = json
      window.parent.postMessage(
        { type: GraphicSyncMessage.Update, field, value },
        editorOrigin,
      )
    })
  }

  return {
    get connected() {
      return editorOrigin !== undefined
    },
    get editable() {
      return editable
    },
  }
}
