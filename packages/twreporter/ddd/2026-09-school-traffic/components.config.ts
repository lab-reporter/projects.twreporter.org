import type { ComponentConfig } from '@lab-reporter/ddd-shared/vite-config'
import { playerTrackMapConfigSchema } from './src/lib/components/player-track-map/types.ts'

export const components = {
  ['player-track-map']: {
    entry: 'src/wc/player-track-map.ts',
    outputDirectory: 'components/player-track-map',
    configSchema: playerTrackMapConfigSchema,
  },
} satisfies Record<string, ComponentConfig>
