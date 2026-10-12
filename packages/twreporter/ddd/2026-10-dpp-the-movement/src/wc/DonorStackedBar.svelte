<script lang="ts">
  import { flip } from 'svelte/animate'
  import { MediaQuery } from 'svelte/reactivity'
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import Shell from '@lab-reporter/ddd-shared/components/shared/Shell.svelte'
  import Tooltip from '@lab-reporter/ddd-shared/components/shared/Tooltip.svelte'
  import { createGraphic } from '@lab-reporter/ddd-shared/utils/graphic-data.svelte.ts'
  import { buildDonorStackedBar } from '../lib/components/donor-stacked-bar/data.ts'
  import { donorStackedBarConfigSchema } from '../lib/components/donor-stacked-bar/types.ts'

  const props: ComponentProps = $props()
  const graphic = createGraphic(
    'twreporter-donor-stacked-bar',
    donorStackedBarConfigSchema,
    () => props,
  )
  const config = $derived(graphic.config)
  const chart = $derived.by(() => {
    if (!graphic.csv || !config) return { data: undefined, error: undefined }
    try {
      return {
        data: buildDonorStackedBar(graphic.csv, config),
        error: undefined,
      }
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : '資料格式錯誤。',
      }
    }
  })
  const numberFormat = new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
  })
  const mobile = new MediaQuery('(max-width: 600px)')
  const tickCount = $derived(
    mobile.current
      ? Math.min(5, config?.axis.tickCount ?? 5)
      : (config?.axis.tickCount ?? 5),
  )
  const ticks = $derived(
    Array.from({ length: tickCount }, (_, index) => index / (tickCount - 1)),
  )
  let sortBy = $state<'faction' | 'total' | 'share'>('faction')
  let showAll = $state(false)
  const percentage = $derived(sortBy === 'share')
  const axisMin = $derived(percentage ? 0 : (chart.data?.axis.min ?? 0))
  const axisMax = $derived(percentage ? 100 : (chart.data?.axis.max ?? 1))
  const rows = $derived(
    (chart.data?.rows ?? [])
      .map((row, index) => {
        const faction =
          row.values.find((series) => series.column === '民進黨新潮流')
            ?.value ?? 0
        return { ...row, index, faction, share: faction / row.total }
      })
      .sort((a, b) => b[sortBy] - a[sortBy]),
  )

  function amount(value: number) {
    return `${numberFormat.format(value / 10000)} 萬元`
  }
</script>

{#if config && chart.data}
  <Shell
    bind:title={config.title}
    bind:subtitle={config.subtitle}
    bind:footnotes={config.footnotes}
    wide={config.wide}
    backdrop={config.backdrop}
    editable={graphic.editable}
    empty={!chart.data.rows.length}
    emptyMessage="資料中沒有政治獻金。"
  >
    <div class="chart">
      <div class="filters" aria-label="捐款排序">
        {#each [{ value: 'faction', label: '新潮流捐款' }, { value: 'total', label: '總捐款' }, { value: 'share', label: '新潮流占比' }] as option}
          <button
            type="button"
            class:active={sortBy === option.value}
            aria-pressed={sortBy === option.value}
            onclick={() => {
              sortBy = option.value as typeof sortBy
            }}>{option.label}</button
          >
        {/each}
      </div>
      <div class="legend" aria-label="政黨圖例">
        {#each config.series as series}
          <span class="legend-item"
            ><i style:background={series.color}></i>{series.label}</span
          >
        {/each}
      </div>
      <div class="axis" aria-hidden="true">
        <span></span>
        <div class="axis-ticks">
          {#each ticks as tick}<span style:left={tick * 100 + '%'}
              >{percentage
                ? `${numberFormat.format(tick * 100)}%`
                : amount(axisMin + (axisMax - axisMin) * tick)}</span
            >{/each}
        </div>
        <span></span>
      </div>
      <div class="rows">
        <div class="grid-lines" aria-hidden="true">
          <span></span>
          <div class="grid-lines-track">
            {#each ticks as tick}
              <span style:left={tick * 100 + '%'}></span>
            {/each}
          </div>
          <span class="grid-lines-total"></span>
        </div>
        {#each showAll ? rows : rows.slice(0, 15) as row (row.index)}
          {@const end = percentage ? 100 : row.total}
          {@const width = Math.max(
            0,
            Math.min(100, ((end - axisMin) / (axisMax - axisMin)) * 100),
          )}
          <div
            class="row"
            animate:flip={{
              duration: () =>
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 0
                  : 500,
            }}
          >
            <div class="label">
              <strong>{row.label}</strong>
              {#if row.description}<span>{row.description}</span>{/if}
            </div>
            <Tooltip variant="light">
              {#snippet children()}
                <div
                  class="track"
                  role="img"
                  aria-label={`${row.label}，總計 ${amount(row.total)}，民進黨新潮流占比 ${numberFormat.format(row.share * 100)}%`}
                >
                  <div class="stack" style:width={width + '%'}>
                    {#each row.values as series, index}
                      {@const start = row.values
                        .slice(0, index)
                        .reduce((sum, item) => sum + item.value, 0)}
                      {@const factor = percentage ? 100 / row.total : 1}
                      {@const visible = Math.max(
                        0,
                        Math.min((start + series.value) * factor, axisMax) -
                          Math.max(start * factor, axisMin),
                      )}
                      {#if visible > 0}
                        <span
                          class="segment"
                          style:width={(visible /
                            (Math.min(end, axisMax) - axisMin)) *
                            100 +
                            '%'}
                          style:background={series.color}
                        ></span>
                      {/if}
                    {/each}
                  </div>
                  <strong class="total" style:left={width + '%'}
                    >{percentage
                      ? `${numberFormat.format(row.share * 100)}%（${amount(row.total)}）`
                      : `${amount(row.total)}（${numberFormat.format(row.share * 100)}%）`}</strong
                  >
                </div>
              {/snippet}
              {#snippet content()}
                <div class="popup">
                  <div class="popup-header">
                    <strong>{row.label}</strong>
                    {#if row.description}<p>{row.description}</p>{/if}
                  </div>
                  <div class="popup-body">
                    {#each row.values.filter((series) => series.value > 0) as series}
                      <p>
                        <i style:background={series.color}></i>{series.label}<b
                          >{amount(series.value)}</b
                        >
                      </p>
                    {/each}
                  </div>
                </div>
              {/snippet}
            </Tooltip>
            <span></span>
          </div>
        {/each}
      </div>
      {#if rows.length > 15}
        <button
          type="button"
          class="show-all"
          aria-expanded={showAll}
          onclick={() => {
            showAll = !showAll
          }}
          >{showAll
            ? '僅顯示前15筆'
            : `展開顯示全部${rows.length}家企業（集團）`}</button
        >
      {/if}
    </div>
  </Shell>
{:else}
  <Shell error={chart.error ?? graphic.error} loading={graphic.loading} empty />
{/if}

<style>
  .show-all {
    letter-spacing: 0.5px;
    display: block;
    margin: 12px auto 0;
    padding: 7px 16px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 6px;
    background: var(--neutral-white);
    color: var(--neutral-gray-700);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .show-all:hover {
    color: var(--neutral-gray-800);
    border: 1px solid var(--neutral-gray-300);
  }
  .filters {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 6px;
    overflow: hidden;
    background: var(--neutral-white);
  }
  .filters button {
    flex: 1;
    padding: 7px 10px;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .filters button:hover {
    background: var(--neutral-gray-50);
  }
  .filters button.active {
    background: #2c7a47;
    color: var(--neutral-white);
  }
  .filters button:focus-visible,
  .show-all:focus-visible {
    outline: 2px solid #2c7a47;
    outline-offset: -3px;
  }
  .chart {
    border-radius: 3px;
    background: var(--neutral-gray-100);
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 16px;
    margin-bottom: 12px;
  }
  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--neutral-gray-700);
    font-size: 15px;
    font-weight: 500;
  }
  .legend i,
  .popup-body i {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    border-radius: 2px;
  }
  .axis,
  .row,
  .grid-lines {
    display: grid;
    grid-template-columns: minmax(120px, 170px) minmax(0, 1fr) 30px;
    gap: 10px;
  }
  .axis {
    margin-bottom: 4px;
  }
  .axis-ticks {
    position: relative;
    height: 20px;
    color: var(--neutral-gray-600);
    font-size: 13px;
  }
  .axis-ticks span {
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .rows {
    position: relative;
    display: grid;
    gap: 6px;
  }
  .grid-lines {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .grid-lines-track {
    position: relative;
  }
  .grid-lines-track span {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    width: 1px;
    background: var(--neutral-gray-200);
  }
  .grid-lines-total {
    min-width: 58px;
  }
  .row {
    position: relative;
    z-index: 1;
    align-items: center;
  }
  .row:hover,
  .row:focus-within {
    z-index: 2;
  }
  .row :global(.anchor) {
    align-self: stretch;
    display: grid;
  }
  .label {
    min-width: 0;
    text-align: right;
  }
  .label strong,
  .label span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .label strong {
    font-size: 14px;
  }
  .label span {
    margin-top: -1px;
    color: var(--neutral-gray-600);
    font-size: 11px;
  }
  .track {
    position: relative;
    height: 36.5px;
  }
  .stack {
    display: flex;
    height: 100%;
    overflow: hidden;
    border-radius: 3px;
    gap: 2px;
    transition:
      width 500ms,
      opacity 0.25s;
  }
  .segment {
    min-width: 0;
  }
  .rows:has(.track:hover) .track:not(:hover) .stack {
    opacity: 0.5;
  }
  .total {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding-left: 6px;
    color: var(--neutral-gray-700);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
    transition: left 500ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .stack,
    .total {
      transition: none;
    }
  }
  .popup-header {
    padding: 10px 12px 7px;
    border-bottom: 1px solid var(--neutral-gray-200);
  }
  .popup-header strong {
    display: block;
    font-size: 16px;
    line-height: 20.8px;
  }
  .popup-header p {
    margin: 1px 0 0;
    color: var(--neutral-gray-600);
    font-size: 13px;
    line-height: 20.8px;
  }
  .popup-body {
    display: grid;
    gap: 2px;
    padding: 7px 12px 10px;
  }
  .popup-body p {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    margin: 0;
    font-size: 13px;
    line-height: 20.8px;
  }
  .popup-body b {
    padding-left: 10px;
    border-left: 1px solid var(--neutral-gray-200);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 600px) {
    .legend {
      gap: 4px 12px;
      margin-bottom: 8px;
    }
    .legend-item {
      gap: 4px;
      font-size: 13.5px;
    }
    .legend i {
      width: 12px;
      height: 12px;
    }
    .axis,
    .row,
    .grid-lines {
      grid-template-columns: minmax(78px, 100px) minmax(0, 1fr) 15px;
      gap: 6px;
    }
    .axis-ticks {
      height: 18px;
      font-size: 11px;
    }
    .grid-lines-total {
      min-width: 46px;
    }
    .label strong {
      font-size: 13px;
    }
    .total {
      min-width: 46px;
      font-size: 12px;
    }
  }
</style>
