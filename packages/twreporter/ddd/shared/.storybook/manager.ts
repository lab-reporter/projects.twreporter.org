import { z } from 'zod'

// The endpoints validate the payload; the manager only routes the envelope.
const messageSchema = z.looseObject({
  type: z.enum(['graphic:set', 'graphic:ready', 'graphic:update']),
})

if (window.parent !== window) {
  let editorOrigin: string | undefined

  window.addEventListener('message', (event: MessageEvent) => {
    const preview = document.getElementById('storybook-preview-iframe')
    if (!(preview instanceof HTMLIFrameElement)) return

    const result = messageSchema.safeParse(event.data)
    if (!result.success) return
    const message = result.data
    const previewOrigin = new URL(preview.src, window.location.href).origin

    if (event.source === window.parent && message.type === 'graphic:set') {
      if (editorOrigin !== undefined && event.origin !== editorOrigin) return
      editorOrigin = event.origin
      preview.contentWindow?.postMessage(message, previewOrigin)
    } else if (
      event.source === preview.contentWindow &&
      event.origin === previewOrigin &&
      message.type !== 'graphic:set'
    ) {
      if (message.type === 'graphic:update' && editorOrigin === undefined) return
      window.parent.postMessage(message, editorOrigin ?? '*')
    }
  })
}
