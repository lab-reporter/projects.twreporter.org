import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig, type Plugin } from 'vite'
import { z } from 'zod'
import { tableConfigSchema } from './src/components/table/types'

const components = {
  table: {
    entry: 'src/components/table/index.ts',
    outputDirectory: 'components/table',
    configSchema: tableConfigSchema,
  },
} as const

const timestamp = Date.now()
const [name, component] = Object.entries(components)[0]
const generatedSchemaPath = resolve(
  import.meta.dirname,
  'dist',
  component.outputDirectory,
  `${name}.schema.json`,
)

function generatedSchema(): Plugin {
  let source: Buffer
  const schemaId = generatedSchemaPath + '?url&no-inline'
  const schemaImportSuffix = `dist/${component.outputDirectory}/${name}.schema.json?url&no-inline`

  return {
    name: 'twreporter-generated-schema',
    enforce: 'pre',
    async configResolved(config) {
      if (config.command !== 'build') return

      const schema = z.toJSONSchema(component.configSchema)

      await mkdir(dirname(generatedSchemaPath), { recursive: true })
      await writeFile(generatedSchemaPath, JSON.stringify(schema, null, 2))
      source = await readFile(generatedSchemaPath)
    },
    resolveId(id) {
      if (id.endsWith(schemaImportSuffix)) return schemaId
    },
    load(id) {
      if (id !== schemaId) return
      const referenceId = this.emitFile({
        type: 'asset',
        name: 'table.schema.json',
        source,
      })
      return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
    },
  }
}

export default defineConfig({
  base: './',
  // TanStack Query uses this Node-style guard for development-only warnings.
  // Library builds do not replace it automatically, so leaving it in the
  // browser bundle causes `process is not defined` at runtime.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [generatedSchema(), svelte({ emitCss: false })],
  build: {
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, component.entry),
      formats: ['es'],
    },
    rolldownOptions: {
      output: {
        codeSplitting: false,
        entryFileNames: `${component.outputDirectory}/${name}-${timestamp}.js`,
        assetFileNames: (assetInfo) =>
          assetInfo.names.some((assetName) =>
            assetName.endsWith('.schema.json'),
          )
            ? `${component.outputDirectory}/${name}-${timestamp}.schema.json`
            : `${component.outputDirectory}/${name}-${timestamp}.[ext]`,
      },
    },
    sourcemap: false,
  },
})
