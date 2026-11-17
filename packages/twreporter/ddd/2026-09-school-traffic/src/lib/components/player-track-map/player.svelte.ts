import { on } from 'svelte/events'
import {
  wrapperConnectEvent,
  wrapperReadyEvent,
} from '@lab-reporter/ddd-shared/components/full-screen-wrapper/connection.ts'
import { connectPlayer } from '../../rpc.ts'

export class PlayerConnection {
  player = $state.raw<ReturnType<typeof connectPlayer>>()

  mount(host: HTMLElement) {
    const connect = () => {
      if (this.player) return
      const wrapper = host.ownerDocument.querySelector(
        'twreporter-full-screen-wrapper',
      )
      wrapper?.dispatchEvent(
        new CustomEvent(wrapperConnectEvent, {
          detail: {
            connect: (options: Parameters<typeof connectPlayer>[0]) => {
              const player = connectPlayer(options)
              this.player = player
              return () => {
                player.destroy()
                if (this.player === player) this.player = undefined
              }
            },
          },
        }),
      )
    }
    const stop = on(host.ownerDocument, wrapperReadyEvent, connect)
    connect()
    return () => {
      stop()
      this.player?.destroy()
      this.player = undefined
    }
  }
}
