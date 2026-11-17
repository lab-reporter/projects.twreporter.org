import { connect, WindowMessenger, type Methods } from 'penpal'
import { z } from 'zod'
import type { WrapperController } from './controller.svelte.ts'

export const fullScreenWrapperRpcChannel = 'full-screen-wrapper'

export type WrapperApi = Pick<
  WrapperController,
  'setButtonVisible' | 'lock' | 'release'
>

export function createConnection<RemoteMethods extends Methods>({
  iframe,
  wrapper,
}: {
  iframe: HTMLIFrameElement
  wrapper: WrapperApi
}) {
  if (!iframe.contentWindow) throw new Error('The iframe is not mounted')

  return connect<RemoteMethods>({
    messenger: new WindowMessenger({
      remoteWindow: iframe.contentWindow,
      allowedOrigins: [new URL(iframe.src, document.baseURI).origin],
    }),
    channel: fullScreenWrapperRpcChannel,
    timeout: 120000,
    methods: {
      setButtonVisible: (visible: boolean) =>
        wrapper.setButtonVisible(z.boolean().parse(visible)),
      lock: wrapper.lock,
      release: wrapper.release,
    } satisfies WrapperApi,
  })
}
