<script lang="ts">
    import * as d3 from 'd3'
    import type { HexDatum, HexSize, StrikeZone, HoverPoint } from './types'

    const {
        hexData,
        hexSize,
        strikeZone = null,
        width = 400,
        height = 380,
        onHover,
        onLeave,
        onSyncMatch,
        syncPoint = null,
    }: {
        hexData: HexDatum[]
        hexSize: HexSize
        strikeZone?: StrikeZone | null
        width?: number
        height?: number
        onHover?: (d: HexDatum, e: MouseEvent) => void
        onLeave?: () => void
        onSyncMatch?: (
            d: HexDatum | null,
            px: number,
            py: number,
        ) => void
        syncPoint?: HoverPoint | null
    } = $props()

    let svgEl: SVGSVGElement | undefined = $state()
    let containerEl: HTMLDivElement | undefined = $state()

    const margin = { top: 0, right: 30, bottom: 30, left: 30 }

    const colorScale = d3
        .scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range(['#0D6CF2', '#FFFFFF', '#28BD73'])
        .clamp(true)

    function hexPath(cx: number, cy: number, r: number): string {
        const pts: [number, number][] = []
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 180) * (60 * i - 90)
            pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
        }
        return 'M' + pts.map((p) => p.join(',')).join('L') + 'Z'
    }

    function draw() {
        if (!svgEl || !hexData || hexData.length === 0) return
        const svg = d3.select(svgEl)
        svg.selectAll('*').remove()

        const w = width - margin.left - margin.right
        const h = height - margin.top - margin.bottom

        const ppu = Math.min(w / 4, h / 4.5)
        const plotW = 4 * ppu
        const plotH = 4.5 * ppu
        const ox = (w - plotW) / 2
        const oy = (h - plotH) / 2

        const xScale = d3
            .scaleLinear()
            .domain([-2, 2])
            .range([ox, ox + plotW])
        const yScale = d3
            .scaleLinear()
            .domain([0.5, 5])
            .range([oy + plotH, oy])

        // 5% extra to fill gaps between hexagons
        const hexR = ((hexSize.dx * ppu) / Math.sqrt(3)) * 1.05

        const g = svg
            .append('g')
            .attr(
                'transform',
                `translate(${margin.left},${margin.top})`,
            )

        g.selectAll('.hex')
            .data(hexData)
            .enter()
            .append('path')
            .attr('class', 'hex')
            .attr('d', (d) => hexPath(xScale(d.x), yScale(d.y), hexR))
            .attr('fill', (d) => colorScale(d.csr))
            .attr('stroke', '#d0d0d0')
            .attr('stroke-width', 0.3)
            .style('cursor', 'crosshair')
            .on('mouseenter', (event: MouseEvent, d: HexDatum) => {
                d3.select(event.currentTarget as Element)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1.5)
                onHover?.(d, event)
            })
            .on('mouseleave', (event: MouseEvent) => {
                d3.select(event.currentTarget as Element)
                    .attr('stroke', '#d0d0d0')
                    .attr('stroke-width', 0.3)
                onLeave?.()
            })

        if (strikeZone) {
            g.append('rect')
                .attr('x', xScale(strikeZone.xMin))
                .attr('y', yScale(strikeZone.zMax))
                .attr(
                    'width',
                    xScale(strikeZone.xMax) - xScale(strikeZone.xMin),
                )
                .attr(
                    'height',
                    yScale(strikeZone.zMin) - yScale(strikeZone.zMax),
                )
                .attr('fill', 'none')
                .attr('stroke', 'rgba(255,255,255,0.9)')
                .attr('stroke-width', 2)
        }

        const axisFontSize = width < 360 ? '9px' : '11px'
        const labelFontSize = width < 360 ? '10px' : '12px'

        // X axis
        const xAxis = d3.axisBottom(xScale).ticks(5)
        g.append('g')
            .attr('transform', `translate(0,${oy + plotH})`)
            .call(xAxis)
            .selectAll('text')
            .style('fill', '#666')
            .style('font-size', axisFontSize)
        g.selectAll('.domain, .tick line').style('stroke', '#ccc')
        g.append('text')
            .attr('x', ox + plotW / 2)
            .attr('y', oy + plotH + 34)
            .attr('text-anchor', 'middle')
            .style('fill', '#555')
            .style('font-size', labelFontSize)
            .text('水平高度（呎）')

        // Y axis
        const yAxis = d3.axisLeft(yScale).ticks(5)
        g.append('g')
            .attr('transform', `translate(${ox},0)`)
            .call(yAxis)
            .selectAll('text')
            .style('fill', '#666')
            .style('font-size', axisFontSize)
        g.selectAll('.domain, .tick line').style('stroke', '#ccc')
        g.append('text')
            .attr('x', ox - 25)
            .attr('y', oy + plotH / 2)
            .attr('text-anchor', 'middle')
            .style('fill', '#555')
            .style('font-size', labelFontSize)
            .style('writing-mode', 'vertical-lr')
            .text('離地高度（呎）')

        // Sync highlight (yellow dashed outline)
        if (syncPoint) {
            const closest = hexData.reduce(
                (best, d) => {
                    const dist = Math.hypot(
                        d.x - syncPoint.x,
                        d.y - syncPoint.y,
                    )
                    return dist < best.dist ? { d, dist } : best
                },
                { d: null as HexDatum | null, dist: Infinity },
            )

            if (closest.d && closest.dist < hexSize.dx) {
                g.append('path')
                    .attr(
                        'd',
                        hexPath(
                            xScale(closest.d.x),
                            yScale(closest.d.y),
                            hexR,
                        ),
                    )
                    .attr('fill', 'none')
                    .attr('stroke', '#f0a500')
                    .attr('stroke-width', 2.5)
                    .attr('stroke-dasharray', '4,2')

                if (onSyncMatch && containerEl) {
                    const rect = containerEl.getBoundingClientRect()
                    const px =
                        rect.left + margin.left + xScale(closest.d.x)
                    const py =
                        rect.top + margin.top + yScale(closest.d.y)
                    onSyncMatch(closest.d, px, py)
                }
            } else {
                onSyncMatch?.(null, 0, 0)
            }
        } else {
            onSyncMatch?.(null, 0, 0)
        }
    }

    $effect(() => {
        draw()
    })
</script>

<div bind:this={containerEl} style="display:inline-block; width:100%;">
    <svg
        bind:this={svgEl}
        {width}
        {height}
        style="display:block; width:100%; height:auto; border-radius:6px;"
    >
    </svg>
</div>
