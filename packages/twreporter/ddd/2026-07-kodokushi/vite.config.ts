import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { z } from 'zod'
import { configSchema } from './src/config'

const timestamp = Date.now()

export default defineConfig({
  publicDir: 'src/lib/assets',
  plugins: [
    {
      name: 'kodokushi-schema',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'js/kodokushi.schema.json',
          source: JSON.stringify(
            z.toJSONSchema(configSchema, { target: 'draft-7' }),
            null,
            2,
          ),
        })
      },
    },
  ],
  server: {
    cors: {
      origin: '*',
      preflightContinue: true,
    },
    headers: {
      'Access-Control-Allow-Private-Network': 'true',
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/main.ts'),
      formats: ['umd'],
      name: 'TwreporterKodokushi',
      fileName: () => `js/script-${timestamp}.js`,
    },
  },
})
