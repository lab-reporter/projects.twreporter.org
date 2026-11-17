import type { createConnection } from './rpc.ts'

export const wrapperConnectEvent = 'twreporter:wrapper-connect'
export const wrapperReadyEvent = 'twreporter:wrapper-ready'

type WrapperConnectEvent = CustomEvent<{
  connect: (options: Parameters<typeof createConnection>[0]) => () => void
}>

declare global {
  interface HTMLElementEventMap {
    'twreporter:wrapper-connect': WrapperConnectEvent
  }
}

export class WrapperConnection {
  #host: HTMLElement
  #wrapper: Parameters<typeof createConnection>[0]['wrapper']
  #disconnect: (() => void) | undefined

  constructor(
    host: HTMLElement,
    wrapper: Parameters<typeof createConnection>[0]['wrapper'],
  ) {
    this.#host = host
    this.#wrapper = wrapper
  }

  ready = () => {
    this.#host.dispatchEvent(new Event(wrapperReadyEvent, { bubbles: true }))
  }

  mount() {
    const connect = (event: WrapperConnectEvent) => {
      const iframe = this.#host.querySelector('iframe')
      if (!iframe) return
      this.#disconnect?.()
      this.#disconnect = event.detail.connect({
        iframe,
        wrapper: this.#wrapper,
      })
    }
    this.#host.addEventListener(wrapperConnectEvent, connect)
    this.ready()
    return () => {
      this.#host.removeEventListener(wrapperConnectEvent, connect)
      this.#disconnect?.()
    }
  }
}
