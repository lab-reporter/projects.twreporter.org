<script lang="ts">
    import * as d3 from "d3";

    type Datum = {
        x: string;
        values: Record<string, number>;
    };

    let {
        xKeys,
        yKeys,
        values,
        colors,
    }: {
        xKeys: string[];
        yKeys: string[];
        values: number[][];
        colors: string[];
    } = $props();

    let svg = $state<SVGSVGElement | null>(null);
    let width = $state(0);
    let height = $state(0);

    const margin = { top: 25, right: 10, bottom: 27.5, left: 32.5 };

    const chartData = $derived<Datum[]>(
        xKeys.map((x, xIndex) => ({
            x,
            values: Object.fromEntries(
                yKeys.map((y, yIndex) => [y, values[xIndex]?.[yIndex] ?? 0]),
            ),
        })),
    );

    const draw = () => {
        if (!svg || width <= 0 || height <= 0) return;

        const root = d3.select(svg);
        root.selectAll("*").remove();

        const chartWidth = Math.max(width, margin.left + margin.right);
        const chartHeight = Math.max(height, margin.top + margin.bottom);
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = chartHeight - margin.top - margin.bottom;
        const totals = chartData.map((datum) =>
            yKeys.reduce((sum, key) => sum + datum.values[key], 0),
        );
        const maxTotal = d3.max(totals) ?? 0;
        const yMax = Math.max(10, Math.ceil(maxTotal / 10) * 10);

        const xScale = d3
            .scaleBand<string>()
            .domain(xKeys)
            .range([0, innerWidth])
            .paddingInner(0.28)
            .paddingOuter(0.08);

        const yScale = d3
            .scaleLinear()
            .domain([0, yMax])
            .nice()
            .range([innerHeight, 0]);

        const colorScale = d3
            .scaleOrdinal<string, string>()
            .domain(yKeys)
            .range(colors);

        root.attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`).attr(
            "role",
            "img",
        );

        const chart = root
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        chart
            .append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-innerWidth)
                    .tickFormat((value) => `${value}`),
            )
            .call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line").attr("stroke", "#cfcfcf"))
            .call((g) =>
                g
                    .selectAll(".tick text")
                    .attr("x", -10)
                    .attr("dy", "-0.35em")
                    .attr("fill", "#404040")
                    .attr("font-size", 12)
                    .attr(
                        "font-family",
                        "Roboto Slab, Noto Sans TC, sans-serif",
                    ),
            );

        chart
            .append("line")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", innerHeight)
            .attr("y2", innerHeight)
            .attr("stroke", "#404040")
            .attr("stroke-width", 2);

        const stacks = d3
            .stack<Datum>()
            .keys(yKeys)
            .value((datum, key) => datum.values[key] ?? 0)(chartData);

        chart
            .append("g")
            .selectAll("g")
            .data(stacks)
            .join("g")
            .attr("fill", (series) => colorScale(series.key))
            .selectAll("rect")
            .data((series) => series)
            .join("rect")
            .attr("x", (datum) => xScale(datum.data.x) ?? 0)
            .attr("y", (datum) => yScale(datum[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", (datum) => yScale(datum[0]) - yScale(datum[1]));

        chart
            .append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                    .selectAll("text")
                    .attr("y", 15)
                    .attr("fill", "#404040")
                    .attr("font-size", 12)
                    .attr("font-family", "Noto Sans TC, sans-serif"),
            );
    };

    $effect(draw);
</script>

<div class="chart-wrapper">
    <div
        class="chart-inner"
        bind:clientWidth={width}
        bind:clientHeight={height}
    >
        {#if width > 0 && height > 0}
            <svg bind:this={svg} class="bar-chart" {width} {height}></svg>
        {/if}
    </div>
</div>

<style>
    .chart-wrapper {
        flex: 1;
        min-height: 0;
        min-width: 0;
        position: relative;
    }

    .chart-inner {
        position: absolute;
        inset: 0;
    }

    .bar-chart {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
</style>
