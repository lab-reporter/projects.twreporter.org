<script lang="ts">
  import Bar from './Bar.svelte'
  import type { BarDatum, ResponsiveCount } from './Bar.svelte'

  export type BarGridItem = {
    label?: string
    data: BarDatum[]
    color?: string
    // Per-chart overrides (fall back to the grid-level value)
    ratio?: ResponsiveCount
    yLabel?: string
    yDomain?: [min?: number, max?: number]
    yTickCount?: ResponsiveCount
    xLabel?: string
    xDomain?: [min?: string, max?: string]
    xTickCount?: ResponsiveCount
  }

  let {
    items,
    gridColumns = 3,
    layout = 'horizontal',
    yDomain,
    yTickCount = 5,
    ratio = 0.8,
    xLabel,
    yLabel,
    colorMap,
    xDate,
    xTickCount,
    xFormat,
    groupLegend = false,
  }: {
    items: BarGridItem[]
    gridColumns?: number
    layout?: 'vertical' | 'horizontal'
    yDomain?: [min?: number, max?: number]
    yTickCount?: ResponsiveCount
    ratio?: ResponsiveCount
    xLabel?: string
    yLabel?: string
    colorMap?: Record<string, string>
    xDate?: boolean
    xTickCount?: ResponsiveCount
    xFormat?: string
    groupLegend?: boolean
  } = $props()

  // Categories across all charts, for the shared group-level legend
  const categories = $derived([
    ...new Set(
      items
        .flatMap((it) => it.data.map((d) => d.category))
        .filter((c): c is string => !!c),
    ),
  ])
</script>

{#if groupLegend && categories.length}
  <div class="legend">
    {#each categories as cat}
      <div class="legend-item">
        <div
          class="legend-swatch"
          style:background-color={colorMap?.[cat] ?? 'var(--chart-olive-3)'}
        ></div>
        <span>{cat}</span>
      </div>
    {/each}
  </div>
{/if}
<div class="grid" style:--cols={gridColumns}>
  {#each items as item}
    <div class="bar-group">
      {#if item.label}
        <div class="bar-label">
          <p>{item.label}</p>
        </div>
      {/if}
      <div class="bar-wrapper">
        <Bar
          data={item.data}
          color={item.color}
          {colorMap}
          {layout}
          {xDate}
          {xFormat}
          ratio={item.ratio ?? ratio}
          yLabel={item.yLabel ?? yLabel}
          yDomain={item.yDomain ?? yDomain}
          yTickCount={item.yTickCount ?? yTickCount}
          xLabel={item.xLabel ?? xLabel}
          xDomain={item.xDomain}
          xTickCount={item.xTickCount ?? xTickCount}
          showLegend={!groupLegend}
        />
      </div>
    </div>
  {/each}
</div>

<style>
  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px 25px;
    padding: 0 5px;
    margin-bottom: -5px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-s);
    font-weight: 500;
    color: var(--neutral-gray-700);
  }

  .legend-swatch {
    width: var(--text-s);
    height: var(--text-s);
    border-radius: 2px;
    flex-shrink: 0;
  }

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

  .bar-label {
    font-size: var(--text-s);
    font-weight: 700;
    color: var(--neutral-gray-800);
    text-align: center;
    padding: 6px;
    border: 0px solid var(--neutral-gray-200);
    background-color: var(--neutral-gray-200);
    border-radius: 2px 2px 0 0;
  }

  .bar-label p {
    margin: 0;
  }

  .bar-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: var(--neutral-gray-100);
    border-radius: 3px;
  }

  .bar-wrapper {
    background-color: var(--neutral-gray-100);
    border-radius: 0 0 3px 3px;
    padding: 0 6px 5px 3px;
    border: 0px solid var(--neutral-gray-200);
    border-top: none;
  }
</style>
