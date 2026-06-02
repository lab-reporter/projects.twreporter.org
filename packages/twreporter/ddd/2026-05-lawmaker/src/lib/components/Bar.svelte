<script lang="ts">
  import {
    scaleBand,
    scaleLinear,
    axisBottom,
    axisLeft,
    select,
    max,
    stack,
    utcFormat,
  } from 'd3'
  import { createQuery } from '@tanstack/svelte-query'
  import Tooltip from './Tooltip.svelte'

  export type BarDatum = { label: string; value: number; category?: string }
  export type BarSeries = { name?: string; data: BarDatum[]; color?: string }
  export type ResponsiveCount = number | [desktop: number, mobile: number]

  let {
    src,
    data: inlineData,
    color = 'var(--chart-olive-3, #7a8c3a)',
    colorMap,
    stacked = false,
    layout = 'vertical',
    series,
    ratio = 1,
    xLabel,
    yLabel,
    yTickCount = 5,
    yDomain,
    xDate = false,
    xTickCount,
    xFormat = '%Y',
    xDomain,
    showLegend = true,
  }: {
    src?: string
    data?: BarDatum[]
    color?: string
    colorMap?: Record<string, string>
    stacked?: boolean
    layout?: 'vertical' | 'horizontal'
    series?: BarSeries[]
    ratio?: ResponsiveCount
    xLabel?: string
    yLabel?: string
    yTickCount?: ResponsiveCount
    yDomain?: [min?: number, max?: number]
    xDate?: boolean
    xTickCount?: ResponsiveCount
    xFormat?: string
    xDomain?: [min?: string, max?: string]
    showLegend?: boolean
  } = $props()

  let yAxisTextWidth = $state(44)
  const margin = $derived({
    top: 20,
    right: 20,
    bottom: 48,
    left: yAxisTextWidth + 8,
  })
  let svgEl = $state<SVGSVGElement>()
  let renderedWidth = $state(500)
  const totalWidth = $derived(renderedWidth)

  $effect(() => {
    if (!svgEl) return
    const ro = new ResizeObserver(([entry]) => {
      renderedWidth = entry.contentRect.width
    })
    ro.observe(svgEl)
    return () => ro.disconnect()
  })

  let screenWidth = $state(window.innerWidth)
  $effect(() => {
    const handler = () => {
      screenWidth = window.innerWidth
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  })

  function resolveCount(val: ResponsiveCount | undefined): number | undefined {
    if (val === undefined) return undefined
    return Array.isArray(val) ? (isMobile ? val[1] : val[0]) : val
  }

  const tickCount = $derived(resolveCount(yTickCount) ?? 5)
  const xTickCountActual = $derived(resolveCount(xTickCount))
  const ratioActual = $derived(resolveCount(ratio) ?? 1)

  const totalHeight = $derived(totalWidth * (1 / ratioActual))
  const width = $derived(totalWidth - margin.left - margin.right)
  const chartHeight = $derived(totalHeight - margin.top - margin.bottom)
  const isMobile = $derived(screenWidth < 767)

  // --- Single-series ---
  const dataQuery = createQuery<BarDatum[]>(() => ({
    queryKey: ['bar', src],
    enabled: !!src && !inlineData,
    queryFn: async () => {
      const res = await fetch(`${src}?v=1`)
      if (!res.ok) throw new Error('Failed to fetch bar data')
      return res.json()
    },
  }))

  const singleData = $derived(inlineData ?? dataQuery.data ?? [])
  const isLoading = $derived(!inlineData && dataQuery.isLoading)

  // Optional date-range clipping for single-series date axes
  const visibleData = $derived.by(() => {
    if (!xDate || !xDomain) return singleData
    const minT = xDomain[0] ? new Date(xDomain[0]).getTime() : -Infinity
    const maxT = xDomain[1] ? new Date(xDomain[1]).getTime() : Infinity
    return singleData.filter((d) => {
      const t = new Date(d.label).getTime()
      return t >= minT && t <= maxT
    })
  })

  // --- Stacked: merge series into [{label, key1: v, key2: v, ...}] ---
  const stackKeys = $derived(
    series?.map((s) => s.name).filter((n): n is string => n !== undefined) ??
      [],
  )

  const mergedData = $derived.by(() => {
    if (!series?.length) return []
    const labels = series[0].data.map((d) => d.label)
    return labels.map((label) => {
      const entry: Record<string, string | number> = { label }
      for (const s of series) {
        const item = s.data.find((d) => d.label === label)
        if (s.name !== undefined) entry[s.name] = item?.value ?? 0
      }
      return entry
    })
  })

  const stackedLayers = $derived.by(() => {
    if (!stacked || !mergedData.length) return []
    return stack<Record<string, string | number>>().keys(stackKeys)(
      mergedData as any,
    )
  })

  // --- Scales ---
  const bandDomain = $derived(
    stacked && series
      ? mergedData.map((d) => d.label as string)
      : visibleData.map((d) => d.label),
  )

  const yMax = $derived.by(() => {
    if (stacked && series) {
      return Math.max(
        0,
        ...mergedData.map((d) =>
          stackKeys.reduce((sum, k) => sum + ((d[k] as number) ?? 0), 0),
        ),
      )
    }
    return max(visibleData, (d) => d.value) ?? 0
  })

  const bandScale = $derived(
    scaleBand()
      .domain(bandDomain)
      .range(layout === 'horizontal' ? [0, chartHeight] : [0, width])
      .padding(0.2),
  )
  const linearScale = $derived(
    scaleLinear()
      .domain([yDomain?.[0] ?? 0, yDomain?.[1] ?? yMax * 1.1])
      .range(layout === 'horizontal' ? [0, width] : [chartHeight, 0])
      .nice(),
  )

  let xAxisEl = $state<SVGGElement>()
  let yAxisEl = $state<SVGGElement>()

  $effect(() => {
    if (!xAxisEl || !bandDomain.length) return
    let axis
    if (layout === 'horizontal') {
      axis = axisBottom(linearScale)
        .ticks(tickCount)
        .tickSize(-chartHeight)
        .tickPadding(8)
    } else {
      axis = axisBottom(bandScale).tickSize(0).tickPadding(4)
      if (xDate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        axis.tickFormat(((d: string) => utcFormat(xFormat)(new Date(d))) as any)
        if (xTickCountActual !== undefined) {
          const dom = bandScale.domain()
          const step = Math.max(1, Math.round(dom.length / xTickCountActual))
          axis.tickValues(dom.filter((_, i) => i % step === 0))
        }
      }
    }
    select(xAxisEl).call(axis.tickSizeOuter(0))
    if (layout === 'vertical') {
      select(xAxisEl)
        .selectAll('text')
        .style('text-anchor', 'center')
        .attr('dy', '1em')
        .attr('transform', 'rotate(0)')
    }
  })

  $effect(() => {
    if (!yAxisEl || !bandDomain.length) return
    const axis =
      layout === 'horizontal'
        ? axisLeft(bandScale).tickSize(0).tickPadding(6)
        : axisLeft(linearScale).ticks(tickCount).tickSize(-width).tickPadding(7)
    select(yAxisEl).call(axis.tickSizeOuter(0))

    let maxW = 0
    select(yAxisEl)
      .selectAll<SVGTextElement, unknown>('text')
      .each(function () {
        maxW = Math.max(maxW, this.getBBox().width)
      })
    if (maxW > 0 && Math.round(maxW) !== yAxisTextWidth) {
      yAxisTextWidth = Math.round(maxW)
    }
  })

  const DEFAULT_COLORS = [
    'var(--chart-olive-3)',
    'var(--chart-blue-3)',
    'var(--chart-earth-3)',
    'var(--chart-mint-3)',
  ]

  function seriesColor(i: number) {
    return series?.[i]?.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
  }

  function barColor(d: BarDatum) {
    return (
      (d.category ? colorMap?.[d.category] : undefined) ??
      colorMap?.[d.label] ??
      color
    )
  }

  const categories = $derived([
    ...new Set(
      visibleData.map((d) => d.category).filter((c): c is string => !!c),
    ),
  ])

  type TooltipState = {
    x: number
    y: number
    label: string
    value: number
    seriesName?: string
    seriesColor?: string
  }
  let tooltip = $state<TooltipState | null>(null)

  function onBarEnter(
    e: MouseEvent,
    label: string,
    value: number,
    seriesName?: string,
    seriesColor?: string,
  ) {
    tooltip = {
      x: e.clientX,
      y: e.clientY,
      label,
      value,
      seriesName,
      seriesColor,
    }
  }
  function onBarMove(e: MouseEvent) {
    if (tooltip) tooltip = { ...tooltip, x: e.clientX, y: e.clientY }
  }
  function onBarLeave() {
    tooltip = null
  }
</script>

<div class="bar-chart" style:--aspect-ratio={ratioActual}>
  {#if showLegend && stacked && series}
    <div class="legend">
      {#each series as s, i}
        <div class="legend-item">
          <div
            class="legend-swatch"
            style:background-color={seriesColor(i)}
          ></div>
          <span>{s.name}</span>
        </div>
      {/each}
    </div>
  {:else if showLegend && categories.length}
    <div class="legend">
      {#each categories as cat}
        <div class="legend-item">
          <div
            class="legend-swatch"
            style:background-color={colorMap?.[cat] ?? color}
          ></div>
          <span>{cat}</span>
        </div>
      {/each}
    </div>
  {/if}
  <div class="bar-chart-y">
    <span class="axis-label y">
      {#if layout === 'vertical'}
        {yLabel}
      {:else}
        {xLabel}
      {/if}
    </span>
    <svg
      bind:this={svgEl}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      overflow="visible"
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g bind:this={yAxisEl} class="y-axis" />
        <g
          bind:this={xAxisEl}
          transform={`translate(0, ${chartHeight})`}
          class="x-axis"
        />
        {#if stacked && series}
          {#each stackedLayers as layer, i}
            {#each layer as seg}
              {#if layout === 'vertical'}
                <rect
                  role="img"
                  x={bandScale(seg.data.label as string)}
                  y={linearScale(seg[1])}
                  width={bandScale.bandwidth()}
                  height={linearScale(seg[0]) - linearScale(seg[1])}
                  fill={seriesColor(i)}
                  onmouseenter={(e) =>
                    onBarEnter(
                      e,
                      seg.data.label as string,
                      seg[1] - seg[0],
                      series?.[i]?.name,
                      seriesColor(i),
                    )}
                  onmousemove={onBarMove}
                  onmouseleave={onBarLeave}
                />
              {:else}
                <rect
                  role="img"
                  y={bandScale(seg.data.label as string)}
                  x={linearScale(seg[0])}
                  height={bandScale.bandwidth()}
                  width={linearScale(seg[1]) - linearScale(seg[0])}
                  fill={seriesColor(i)}
                  onmouseenter={(e) =>
                    onBarEnter(
                      e,
                      seg.data.label as string,
                      seg[1] - seg[0],
                      series?.[i]?.name,
                      seriesColor(i),
                    )}
                  onmousemove={onBarMove}
                  onmouseleave={onBarLeave}
                />
              {/if}
            {/each}
          {/each}
        {:else}
          {#each visibleData as d (d.label)}
            {#if layout === 'vertical'}
              <rect
                role="img"
                x={bandScale(d.label)}
                y={linearScale(d.value)}
                width={bandScale.bandwidth()}
                height={chartHeight - linearScale(d.value)}
                fill={barColor(d)}
                onmouseenter={(e) =>
                  onBarEnter(e, d.label, d.value, d.category, barColor(d))}
                onmousemove={onBarMove}
                onmouseleave={onBarLeave}
              />
            {:else}
              <rect
                role="img"
                y={bandScale(d.label)}
                x={0}
                height={bandScale.bandwidth()}
                width={linearScale(d.value)}
                fill={barColor(d)}
                onmouseenter={(e) =>
                  onBarEnter(e, d.label, d.value, d.category, barColor(d))}
                onmousemove={onBarMove}
                onmouseleave={onBarLeave}
              />
            {/if}
          {/each}
        {/if}
      </g>
    </svg>
  </div>
  <span
    class="axis-label x"
    style:padding-left={`calc(${margin.left}px + var(--text-s))`}
  >
    {#if layout === 'vertical'}
      {xLabel}
    {:else}
      {yLabel}
    {/if}
  </span>

  {#if isLoading}
    <img
      src="https://www.twreporter.org/images/spinner-logo.gif"
      alt="Loading..."
      class="loading-spinner"
    />
  {/if}

  {#if tooltip}
    <Tooltip
      x={tooltip.x}
      y={tooltip.y}
      label={tooltip.label}
      value={tooltip.value}
      seriesName={tooltip.seriesName}
      seriesColor={tooltip.seriesColor}
    />
  {/if}
</div>

<style>
  .bar-chart {
    position: relative;
    width: 100%;
    align-items: center;
  }

  .loading-spinner {
    --size: 80px;
    position: absolute;
    inset: 0;
    margin: auto;
    width: var(--size);
    height: var(--size);
  }

  .bar-chart-y {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 10px;
  }

  .bar-chart-y svg {
    flex: 1;
    min-width: 0;
    margin: -8px 0 -20px 0;
    @media screen and (max-width: 767px) {
      margin: -8px 0 -25px 0;
    }
  }

  .bar-chart :global(.tick text),
  .bar-chart :global(.domain) {
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }

  .bar-chart :global(.tick text) {
    font-size: var(--text-s);
    fill: var(--neutral-gray-700);
    font-weight: 500;
  }

  .bar-chart :global(.y-axis .tick line),
  .bar-chart :global(.x-axis .tick line) {
    stroke: var(--neutral-gray-200);
  }

  .bar-chart svg rect {
    transition: opacity 0.2s ease;
  }
  .bar-chart svg g:has(rect:hover) rect:not(:hover) {
    opacity: 0.5;
  }

  .axis-label {
    font-size: var(--text-s);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    color: var(--neutral-gray-600);
    line-height: 1.2;
  }
  .axis-label.x {
    display: block;
    text-align: center;
    margin-top: 2px;
    letter-spacing: 0.05em;
  }
  .axis-label.y {
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 0.15em;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px 25px;
    padding: 0 5px;
    margin-top: -3px;
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
</style>
