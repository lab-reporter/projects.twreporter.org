<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

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

    let svg: SVGSVGElement | null = null;

    const width = 330;
    const height = 950;
    const margin = { top: 35, right: 0, bottom: 38, left: 46 };

    const chartData = $derived<Datum[]>(
        xKeys.map((x, xIndex) => ({
            x,
            values: Object.fromEntries(
                yKeys.map((y, yIndex) => [y, values[xIndex]?.[yIndex] ?? 0]),
            ),
        })),
    );

    const draw = () => {
        if (!svg) return;

        const root = d3.select(svg);
        root.selectAll("*").remove();

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
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

        const chart = root
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("role", "img")
            .attr("aria-label", "事故數量堆疊長條圖")
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        chart
            .append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(yScale)
                    .ticks(Math.min(yMax / 10, 10))
                    .tickSize(-innerWidth)
                    .tickFormat((value) => `${value}`),
            )
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g.selectAll(".tick line").attr("stroke", "#cfcfcf"),
            )
            .call((g) =>
                g
                    .selectAll(".tick text")
                    .attr("x", -34)
                    .attr("dy", "-0.35em")
                    .attr("fill", "#404040")
                    .attr("font-size", 18)
                    .attr("font-family", "Roboto Slab, Noto Sans TC, sans-serif"),
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
                    .attr("y", 22)
                    .attr("fill", "#404040")
                    .attr("font-size", 18)
                    .attr("font-family", "Noto Sans TC, sans-serif"),
            );
    };

    onMount(draw);
    $effect(draw);
</script>

<svg bind:this={svg} class="bar-chart"></svg>

<style>
    .bar-chart {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
    }
</style>
