<script lang="ts">
  import {
    scaleTime,
    scaleLinear,
    axisBottom,
    axisLeft,
    select,
    max,
    extent,
    line,
    area,
    timeFormat,
  } from 'd3'
  import { createQuery } from '@tanstack/svelte-query'
  import Tooltip from './Tooltip.svelte'

  export type LineDatum = { label: string; date: string; value: number }
  export type ResponsiveCount = number | [desktop: number, mobile: number]

  let {
    src,
    data: inlineData,
    colorMap,
    ratio = 1,
    xLabel,
    yLabel,
    yTickCount = 5,
    xTickCount,
    showArea = false,
    yDomain,
  }: {
    src?: string
    data?: LineDatum[]
    colorMap?: Record<string, string>
    ratio?: number
    xLabel?: string
    yLabel?: string
    yTickCount?: ResponsiveCount
    xTickCount?: ResponsiveCount
    showArea?: boolean
    yDomain?: [min?: number, max?: number]
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

  const totalHeight = $derived(totalWidth * (1 / ratio))
  const width = $derived(totalWidth - margin.left - margin.right)
  const chartHeight = $derived(totalHeight - margin.top - margin.bottom)
  const isMobile = $derived(screenWidth < 767)

  function resolveCount(val: ResponsiveCount | undefined): number | undefined {
    if (val === undefined) return undefined
    return Array.isArray(val) ? (isMobile ? val[1] : val[0]) : val
  }

  const yTickCountActual = $derived(resolveCount(yTickCount) ?? 5)
  const xTickCountActual = $derived(resolveCount(xTickCount))

  const dataQuery = createQuery<LineDatum[]>(() => ({
    queryKey: ['line', src],
    enabled: !!src && !inlineData,
    queryFn: async () => {
      const res = await fetch(`${src}?v=1`)
      if (!res.ok) throw new Error('Failed to fetch line data')
      return res.json()
    },
  }))

  const singleData = $derived(inlineData ?? dataQuery.data ?? [])
  const isLoading = $derived(!inlineData && dataQuery.isLoading)

  const labelKeys = $derived([...new Set(singleData.map((d) => d.label))])

  const seriesMap = $derived(
    new Map(
      labelKeys.map((lbl) => {
        const byDate = new Map<string, LineDatum>()
        for (const d of singleData) {
          if (d.label === lbl) byDate.set(d.date, d)
        }
        return [lbl, [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))]
      }),
    ),
  )

  const yMax = $derived(max(singleData, (d) => d.value) ?? 0)

  const xExtent = $derived(
    extent(singleData, (d) => new Date(d.date)) as [Date, Date],
  )

  const xScale = $derived(
    scaleTime().domain(xExtent).range([0, width]).nice(),
  )
  const linearScale = $derived(
    scaleLinear()
      .domain([yDomain?.[0] ?? 0, yDomain?.[1] ?? yMax * 1.1])
      .range([chartHeight, 0])
      .nice(),
  )

  const linePaths = $derived(
    new Map(
      [...seriesMap.entries()].map(([lbl, data]) => [
        lbl,
        line<LineDatum>()
          .x((d) => xScale(new Date(d.date)))
          .y((d) => linearScale(d.value))(data) ?? '',
      ]),
    ),
  )

  const areaPaths = $derived(
    new Map(
      [...seriesMap.entries()].map(([lbl, data]) => [
        lbl,
        area<LineDatum>()
          .x((d) => xScale(new Date(d.date)))
          .y0(chartHeight)
          .y1((d) => linearScale(d.value))(data) ?? '',
      ]),
    ),
  )

  let xAxisEl = $state<SVGGElement>()
  let yAxisEl = $state<SVGGElement>()

  $effect(() => {
    if (!xAxisEl || !singleData.length) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axis = axisBottom(xScale)
      .tickSize(0)
      .tickPadding(4)
      .tickSizeOuter(0)
      .tickFormat(timeFormat('%Y') as any)
    if (xTickCountActual !== undefined) axis.ticks(xTickCountActual)
    select(xAxisEl).call(axis)
    select(xAxisEl)
      .selectAll('text')
      .style('text-anchor', 'center')
      .attr('dy', '1em')
      .attr('transform', 'rotate(0)')
  })

  $effect(() => {
    if (!yAxisEl || !singleData.length) return
    select(yAxisEl).call(
      axisLeft(linearScale)
        .ticks(yTickCountActual)
        .tickSize(-width)
        .tickPadding(7)
        .tickSizeOuter(0),
    )

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

  function labelColor(lbl: string, i: number) {
    return colorMap?.[lbl] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
  }

  type TooltipState = {
    x: number
    y: number
    date: string
    value: number
    seriesLabel: string
    seriesColor: string
  }
  let tooltip = $state<TooltipState | null>(null)

  function onDotEnter(
    e: MouseEvent,
    date: string,
    value: number,
    seriesLabel: string,
    seriesColor: string,
  ) {
    tooltip = { x: e.clientX, y: e.clientY, date, value, seriesLabel, seriesColor }
  }
  function onDotMove(e: MouseEvent) {
    if (tooltip) tooltip = { ...tooltip, x: e.clientX, y: e.clientY }
  }
  function onDotLeave() {
    tooltip = null
  }
</script>

<div class="line-chart" style:--aspect-ratio={ratio}>
  {#if labelKeys.length > 1}
    <div class="legend">
      {#each labelKeys as lbl, i}
        <div class="legend-item">
          <div class="legend-swatch" style:background-color={labelColor(lbl, i)}></div>
          <span>{lbl}</span>
        </div>
      {/each}
    </div>
  {/if}
  <div class="line-chart-y">
    <span class="axis-label y">{yLabel}</span>
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
        {#each labelKeys as lbl, i}
          {#if showArea && (seriesMap.get(lbl)?.length ?? 0) > 1}
            <path
              d={areaPaths.get(lbl)}
              fill={labelColor(lbl, i)}
              fill-opacity="0.15"
              stroke="none"
            />
          {/if}
          {#if (seriesMap.get(lbl)?.length ?? 0) > 1}
            <path
              d={linePaths.get(lbl)}
              fill="none"
              stroke={labelColor(lbl, i)}
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          {/if}
          {#each seriesMap.get(lbl) ?? [] as d (d.date)}
            <circle
              role="img"
              cx={xScale(new Date(d.date))}
              cy={linearScale(d.value)}
              r="4"
              fill={labelColor(lbl, i)}
              onmouseenter={(e) => onDotEnter(e, d.date, d.value, lbl, labelColor(lbl, i))}
              onmousemove={onDotMove}
              onmouseleave={onDotLeave}
            />
          {/each}
        {/each}
      </g>
    </svg>
  </div>
  <span
    class="axis-label x"
    style:padding-left={`calc(${margin.left}px + var(--text-s))`}
  >
    {xLabel}
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
      label={tooltip.date}
      value={tooltip.value}
      seriesName={labelKeys.length > 1 ? tooltip.seriesLabel : undefined}
      seriesColor={labelKeys.length > 1 ? tooltip.seriesColor : undefined}
    />
  {/if}
</div>

<style>
  .line-chart {
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

  .line-chart-y {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .line-chart-y svg {
    flex: 1;
    min-width: 0;
    margin: -8px 0 -20px 0;
    @media screen and (max-width: 767px) {
      margin: -8px 0 -25px 0;
    }
  }

  .line-chart :global(.tick text),
  .line-chart :global(.domain) {
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }

  .line-chart :global(.tick text) {
    font-size: var(--text-s);
    fill: var(--neutral-gray-700);
    font-weight: 500;
  }

  .line-chart :global(.y-axis .tick line),
  .line-chart :global(.x-axis .tick line) {
    stroke: var(--neutral-gray-200);
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
    margin-top: 0px;
    letter-spacing: 0.1em;
  }
  .axis-label.y {
    writing-mode: vertical-rl;
    letter-spacing: 0.25em;
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
