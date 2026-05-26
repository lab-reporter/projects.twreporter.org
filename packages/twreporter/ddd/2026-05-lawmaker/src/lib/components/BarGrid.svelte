<script lang="ts">
  import Bar from './Bar.svelte'
  import type { BarDatum } from './Bar.svelte'

  export type BarGridItem = {
    label?: string
    data: BarDatum[]
    color?: string
  }

  let {
    items,
    gridColumns = 3,
    layout = 'horizontal',
    yMax,
    yMin = 0,
    yTickCount = 5,
    yTickCountMobile,
    ratio = 0.8,
    xLabel,
    yLabel,
    colorMap,
  }: {
    items: BarGridItem[]
    gridColumns?: number
    layout?: 'vertical' | 'horizontal'
    yMax?: number
    yMin?: number
    yTickCount?: number
    yTickCountMobile?: number
    ratio?: number
    xLabel?: string
    yLabel?: string
    colorMap?: Record<string, string>
  } = $props()
</script>

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
          {yMax}
          {yMin}
          {yTickCount}
          {yTickCountMobile}
          {ratio}
          {xLabel}
          {yLabel}
        />
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

  .bar-wrapper {
    background-color: var(--neutral-gray-100);
    border-radius: 0 0 3px 3px;
    padding: 0 6px 5px 3px;
    border: 0px solid var(--neutral-gray-200);
    border-top: none;
  }
</style>
