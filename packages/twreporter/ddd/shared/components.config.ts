import type { ComponentConfig } from './config/vite.ts'
import { tableConfigSchema } from './src/components/table/types.ts'

export const components = {
  table: {
    entry: 'src/components/table/index.ts',
    outputDirectory: 'components/table',
    configSchema: tableConfigSchema,
  },
} satisfies Record<string, ComponentConfig>
