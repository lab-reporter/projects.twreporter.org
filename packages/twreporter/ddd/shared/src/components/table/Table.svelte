<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { parse, unparse } from 'papaparse'
  import { untrack } from 'svelte'
  import {
    syncGraphic,
    type GraphicSources,
  } from '../../utils/graphic-sync.svelte'
  import type { ComponentProps } from '../types'
  import Shell from '../shared/Shell.svelte'
  import ScrollFade from '../shared/ScrollFade.svelte'
  import { tableConfigSchema, type TableConfig } from './types'
  import type { CSVData } from '../../utils/fetchers'

  const props: ComponentProps = $props()

  let config: TableConfig | undefined = $state()
  let csv: CSVData | undefined = $state()
  let sourceRecords: GraphicSources = []

  const sync = syncGraphic(tableConfigSchema, {
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
            data: unparse({ fields: csv.headers, data: csv.rows }),
          },
          ...sourceRecords.slice(1),
        ]
      },
      set: (value) => {
        const parsed = value[0] ? parseCsv(value[0].data) : undefined
        sourceRecords = value
        csv = parsed
      },
    },
  })

  const tableQuery = createQuery(() => ({
    queryKey: ['twreporter-table', props.src, props.config] as const,
    enabled: !sync.connected && Boolean(props.src && props.config),
    queryFn: async ({ signal }) => {
      const resolvedSrc = resolveUrl(props.src)
      const resolvedConfigUrl = resolveUrl(props.config)
      if (!resolvedSrc || !resolvedConfigUrl) {
        throw new Error('Both table source and config URLs are required')
      }
      const [csvText, config] = await Promise.all([
        fetchText(resolvedSrc, signal),
        fetchJson(resolvedConfigUrl, signal),
      ])
      return { csv: parseCsv(csvText), config }
    },
  }))

  $effect(() => {
    if (sync.connected) return
    const data = tableQuery.data
    untrack(() => {
      config = data ? structuredClone(data.config) : undefined
      csv = data ? structuredClone(data.csv) : undefined
    })
  })

  const rows = $derived.by(() => {
    if (!csv || !config) return undefined

    const { headers } = csv
    const missingColumns = config.columns.filter(
      (column) => !headers.includes(column.key),
    )
    if (missingColumns.length > 0) {
      console.error(
        new Error(
          `CSV is missing configured columns: ${missingColumns
            .map((column) => column.key)
            .join(', ')}`,
        ),
      )
      return undefined
    }

    return csv.rows
  })

  $effect(() => {
    if (tableQuery.error) console.error(tableQuery.error)
  })

  function resolveUrl(value: string): string | undefined {
    const trimmed = value?.trim()
    if (!trimmed) return undefined

    try {
      return new URL(trimmed, document.baseURI).href
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  async function fetchText(url: string, signal: AbortSignal): Promise<string> {
    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error(
        `Failed to fetch CSV (${response.status} ${response.statusText}): ${url}`,
      )
    }
    return response.text()
  }

  async function fetchJson(
    url: string,
    signal: AbortSignal,
  ): Promise<TableConfig> {
    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error(
        `Failed to fetch table config (${response.status} ${response.statusText}): ${url}`,
      )
    }
    return tableConfigSchema.parse(await response.json())
  }

  function parseCsv(csvText: string): {
    rows: Record<string, string>[]
    headers: string[]
  } {
    const result = parse<Record<string, string>>(csvText, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: 'greedy',
    })

    if (result.errors.length > 0) {
      throw new Error(
        `Failed to parse CSV: ${result.errors.map((error) => error.message).join('; ')}`,
      )
    }

    return {
      rows: result.data,
      headers: result.meta.fields ?? [],
    }
  }
</script>

{#if config && rows}
  <Shell
    bind:title={config.title}
    bind:footnotes={config.footnotes}
    wide={config.wide}
    backdrop={config.backdrop}
    editable={sync.editable}
  >
    <div class="table-group">
      {#if config.label !== undefined}
        {#if sync.editable}
          <div
            class="table-label"
            contenteditable="plaintext-only"
            bind:innerText={config.label}
          ></div>
        {:else}
          <div class="table-label">{config.label}</div>
        {/if}
      {/if}
      <ScrollFade>
        <table style:--mobile-width={(config.mobileWidth ?? 100) + '%'}>
          <colgroup>
            {#each config.columns as column}
              <col
                style:width={column.width === undefined
                  ? undefined
                  : column.width * 100 + '%'}
              />
            {/each}
          </colgroup>
          <thead>
            <tr>
              {#each config.columns as column}
                {#if sync.editable}
                  <th
                    style:text-align={column.align ?? 'left'}
                    contenteditable="plaintext-only"
                    bind:innerText={column.label}
                  ></th>
                {:else}
                  <th style:text-align={column.align ?? 'left'}
                    >{column.label}</th
                  >
                {/if}
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each rows as row}
              <tr>
                {#each config.columns as column}
                  {#if sync.editable}
                    <td
                      style:text-align={column.align ?? 'left'}
                      contenteditable="plaintext-only"
                      bind:innerText={
                        () => row[column.key] ?? '—',
                        (value) => {
                          row[column.key] = value
                        }
                      }
                    ></td>
                  {:else}
                    <td style:text-align={column.align ?? 'left'}
                      >{row[column.key] ?? '—'}</td
                    >
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </ScrollFade>
    </div>
  </Shell>
{/if}

<style>
  .table-group {
    min-width: 0;
  }

  .table-label {
    padding: 6px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 2px 2px 0 0;
    background-color: var(--neutral-gray-200);
    color: var(--neutral-gray-800);
    font-size: var(--text-m);
    font-weight: 700;
    text-align: center !important;
  }

  table {
    width: 100%;
    min-height: 60px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 2px;
    border-collapse: collapse;
    font-size: var(--text-m);
    table-layout: fixed;
  }

  thead tr {
    border-bottom: 1px solid var(--neutral-gray-200);
    background-color: var(--neutral-gray-100);
  }

  tbody tr {
    border-bottom: 1px solid var(--neutral-gray-200);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  tbody tr:hover td {
    background-color: var(--neutral-white);
  }

  th,
  td {
    padding: 10px 12px;
    border-right: 1px solid var(--neutral-gray-200);
    vertical-align: middle;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  th {
    color: var(--neutral-gray-100);
    font-weight: 500;
    white-space: auto;
    background-color: var(--chart-red-4);
  }

  td {
    color: var(--neutral-gray-800);
    white-space: pre-line;
  }

  @media (max-width: 767px) {
    table {
      width: var(--mobile-width);
      min-width: 100%;
    }

    th,
    td {
      padding: 6px 8px;
    }
  }
</style>
