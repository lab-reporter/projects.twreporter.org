import { sectionBlocks } from './content'
import { rewrapSection } from './pretext'
import { configSchema } from './config'
import { syncGraphic } from './graphic-sync'
import { getBreakpoint } from '@lab-reporter/ddd-shared/media-query'
import {
  config,
  configChanges,
  setConfig,
  getIllustrations,
  INITIAL_BREAKPOINT,
} from './illustrations'

declare global {
  interface Window {
    __twreporter_dynamic_layout_config?: string
  }
}

async function main(): Promise<void> {
  // Ignore in CMS
  if (location.hostname === 'keystone-editor.twreporter.org') return

  window.addEventListener('resize', () => {
    if (getBreakpoint(window.innerWidth) !== INITIAL_BREAKPOINT) location.reload()
  })
  await document.fonts.ready

  let rendering = Promise.resolve()
  let cleanup: (() => void) | undefined
  const render = () => {
    rendering = rendering.then(async () => {
      cleanup?.()
      cleanup = undefined
      const start = document.querySelector('.ddd-anchor[data-type="start"]')
      const end = document.querySelector('.ddd-anchor[data-type="end"]')
      if (!start || !end) {
        console.warn('[kodokushi] Missing start/end anchors')
        return
      }

      const blocks = sectionBlocks(start, end)
      if (!blocks.length) return
      cleanup = await rewrapSection(blocks, getIllustrations())
    }).catch(console.error)
    return rendering
  }
  const sync = syncGraphic((value) => {
    setConfig(value)
    void render()
  })
  configChanges.addEventListener('change', () => sync.update(config))
  const configUrl = window.__twreporter_dynamic_layout_config
  if (configUrl) {
    try {
      const response = await fetch(configUrl)
      if (!response.ok) throw new Error(`Config request failed: ${response.status}`)
      const value = configSchema.parse(await response.json())
      if (!sync.connected) setConfig(value)
    } catch (error) {
      console.error('[kodokushi] Could not load config.', error)
    }
  }
  await render()
}

void main()
