<script lang="ts">
  import type { TableConfig } from '../constants/table'

  let {
    tables,
    gridColumns = 1,
    highlightColor,
    highlightHoverColor,
  }: {
    tables: TableConfig[]
    gridColumns?: number
    highlightColor?: string
    highlightHoverColor?: string
  } = $props()

  let wrappers: (HTMLElement | null)[] = $state([])
  let canScrollRight: boolean[] = $state([])

  function updateFade(i: number) {
    const el = wrappers[i]
    if (el)
      canScrollRight[i] = el.scrollLeft + el.clientWidth < el.scrollWidth
  }

  $effect(() => {
    wrappers.forEach((_, i) => updateFade(i))
  })
</script>

<div class="grid" style:--cols={gridColumns}>
  {#each tables as table, i}
    {@const rows = table.filter ? table.data?.filter(table.filter) : table.data}
    <div class="table-group">
      {#if table.label}
        <div class="table-label">
          <p>{table.label}</p>
        </div>
      {/if}
      <div
        class="table-wrapper"
        bind:this={wrappers[i]}
        onscroll={() => updateFade(i)}
      >
        <table
          style:--mobile-width={table.mobileWidth != null
            ? `${table.mobileWidth}%`
            : undefined}
        >
          <colgroup>
            {#each table.columns as col}
              <col
                style:width={col.width != null
                  ? `${col.width * 100}%`
                  : undefined}
              />
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
            {#each rows as row}
              <tr
                style:background-color={row.highlight
                  ? highlightColor
                  : undefined}
                style:--row-hover-bg={row.highlight
                  ? highlightHoverColor
                  : undefined}
                style:font-weight={row.highlight ? '500' : undefined}
              >
                {#each table.columns as col}
                  <td style:text-align={col.align ?? 'left'}>
                    {row[col.key] ?? '—'}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div
        class="scroll-fade"
        class:visible={canScrollRight[i]}
        aria-hidden="true"
      ></div>
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 12px;
  }

  @media (max-width: 767px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .table-label {
    font-size: var(--text-m);
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
    @media screen and (max-width: 767px) {
    }
  }

  .table-group {
    overflow-x: auto;
    position: relative;
  }

  .scroll-fade {
    position: absolute;
    top: 0;
    right: -1px;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to left, var(--neutral-gray-50), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .scroll-fade.visible {
    opacity: 1;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-m);
    border-radius: 2px;
    border: 1px solid var(--neutral-gray-200);

    @media screen and (max-width: 767px) {
      width: var(--mobile-width, 100%);
    }
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
    @media screen and (max-width: 767px) {
      padding: 6px 8px;
    }
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
    white-space: pre-line;
  }

  tbody tr:hover td {
    background-color: var(--row-hover-bg, var(--neutral-white));
  }
</style>
