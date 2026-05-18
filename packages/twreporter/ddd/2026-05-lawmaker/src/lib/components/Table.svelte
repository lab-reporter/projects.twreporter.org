<script lang="ts">
  import { untrack } from 'svelte'
  import type { TableConfig } from '../constants/table'

  let {
    tables,
    gridColumns = 1,
  }: {
    tables: TableConfig[]
    gridColumns?: number
  } = $props()

  type Row = Record<string, string | number>
  type GroupState = { loading: boolean; error: boolean; rows: Row[] }

  let states = $state<GroupState[]>(untrack(() => tables.map(() => ({ loading: true, error: false, rows: [] }))))

  $effect(() => {
    states = tables.map(() => ({ loading: true, error: false, rows: [] }))

    const srcMap = new Map<string, number[]>()
    tables.forEach((table, i) => {
      if (!srcMap.has(table.src)) srcMap.set(table.src, [])
      srcMap.get(table.src)!.push(i)
    })

    srcMap.forEach((indices, src) => {
      fetch(`${src}?v=1`)

        .then((r) => {
          if (!r.ok) throw new Error()
          return r.json()
        })
        .then((data: Row[]) => {
          indices.forEach((i) => {
            const rows = tables[i].filter ? data.filter(tables[i].filter!) : data
            states[i] = { loading: false, error: false, rows }
          })
        })
        .catch(() => {
          indices.forEach((i) => {
            states[i] = { loading: false, error: true, rows: [] }
          })
        })
    })
  })
</script>

<div class="grid" style:--cols={gridColumns}>
  {#each tables as table, i}
    <div class="table-group">
      {#if table.label}
        <div class="table-label">
          <p>{table.label}</p>
        </div>
      {/if}
      <div class="table-wrapper">
        {#if states[i].loading}
          <img
            src="https://www.twreporter.org/images/spinner-logo.gif"
            alt="Loading..."
            class="loading-spinner"
          />
        {:else if states[i].error}
          <p class="error">資料載入失敗</p>
        {:else}
          <table>
            <colgroup>
              {#each table.columns as col}
                <col style:width={col.width != null ? `${col.width * 100}%` : undefined} />
              {/each}
            </colgroup>
            <thead>
              <tr>
                {#each table.columns as col}
                  <th style:text-align={col.align ?? 'left'}>{col.label}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each states[i].rows as row}
                <tr>
                  {#each table.columns as col}
                    <td style:text-align={col.align ?? 'left'}>{row[col.key] ?? '—'}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 12px;
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .table-label {
    font-size: var(--text-s);
    font-weight: 700;
    color: var(--neutral-gray-800);
    text-align: center;
    padding: 6px;
    border: 1px solid var(--neutral-gray-200);
    background-color: var(--neutral-gray-200);
    border-radius: 2px 2px 0 0;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    position: relative;
    min-height: 60px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-s);
    border-radius: 2px;
    border: 1px solid var(--neutral-gray-200);
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

  th,
  td {
    padding: 8px 12px;
    vertical-align: middle;
    border-right: 1px solid var(--neutral-gray-200);
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  th {
    font-weight: 700;
    color: var(--neutral-gray-800);
    white-space: nowrap;
  }

  td {
    color: var(--neutral-gray-700);
  }

  tbody tr:hover td {
    background-color: var(--neutral-gray-50);
  }

  .loading-spinner {
    --size: 60px;

    display: block;
    margin: auto;
    width: var(--size);
    height: var(--size);
  }

  .error {
    color: var(--neutral-gray-500);
    font-size: var(--text-s);
    text-align: center;
    padding: 20px 0;
  }
</style>
