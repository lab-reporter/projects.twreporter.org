import { createQuery } from '@tanstack/svelte-query'
import Papa from 'papaparse'
import { untrack } from 'svelte'
import type { ZodType } from 'zod'
import type { ComponentProps } from '../components/types.ts'
import { fetchJson, fetchText, parseCsv, type CSVData } from './fetchers.ts'
import { syncGraphic, type GraphicSources } from './graphic-sync.svelte.ts'

export function createGraphic<Config>(
  name: string,
  configSchema: ZodType<Config>,
  props: () => ComponentProps,
) {
  const editorMode =
    window.parent !== window &&
    new URLSearchParams(window.location.search).has('edit')
  let config: Config | undefined = $state()
  let csv: CSVData | undefined = $state()
  let sourceError: string | undefined = $state()
  let sourceRecords: GraphicSources = []

  const sync = syncGraphic(configSchema, {
    config: {
      get: () => config,
      set: (value) => {
        config = value
      },
    },
    sources: {
      get: () => {
        if (!csv || !sourceRecords[0]) return undefined
        return [
          {
            ...sourceRecords[0],
            data: Papa.unparse({ fields: csv.headers, data: csv.rows }),
          },
          ...sourceRecords.slice(1),
        ]
      },
      set: (value) => {
        sourceRecords = value
        try {
          csv = value[0] ? parseCsv(value[0].data) : undefined
          sourceError = undefined
        } catch (error) {
          csv = undefined
          sourceError =
            error instanceof Error ? error.message : 'Unable to read CSV data'
        }
      },
    },
  })

  const query = createQuery(() => ({
    queryKey: [name, props().src, props().config] as const,
    enabled:
      !editorMode && !sync.connected && Boolean(props().src && props().config),
    queryFn: async ({ signal }) => {
      const urls = props()
      const [text, config] = await Promise.all([
        fetchText(new URL(urls.src, document.baseURI).href, signal),
        fetchJson(
          new URL(urls.config, document.baseURI).href,
          configSchema,
          signal,
        ),
      ])
      return { csv: parseCsv(text), config }
    },
  }))

  $effect(() => {
    if (sync.connected) return
    const data = query.data
    untrack(() => {
      config = data ? structuredClone(data.config) : undefined
      csv = data ? structuredClone(data.csv) : undefined
      sourceError = undefined
    })
  })

  return {
    get config() {
      return config
    },
    get csv() {
      return csv
    },
    get editable() {
      return sync.editable
    },
    get loading() {
      return query.isFetching || (editorMode && !sync.connected)
    },
    get error() {
      return sourceError ?? query.error?.message
    },
  }
}
