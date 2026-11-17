import { on } from 'svelte/events'
import type { ZodType } from 'zod'

export function listenForMessages<Message>({
  schema,
  accepts,
  onMessage,
}: {
  schema: ZodType<Message>
  accepts: (event: MessageEvent<unknown>) => boolean
  onMessage: (message: Message, event: MessageEvent<unknown>) => void
}) {
  return on(window, 'message', (event: MessageEvent<unknown>) => {
    if (!accepts(event)) return
    const result = schema.safeParse(event.data)
    if (result.success) onMessage(result.data, event)
  })
}
