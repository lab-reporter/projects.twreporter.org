<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-umpire-hex" }} />

<script lang="ts">
    import { onMount } from "svelte";
    import HexChart from "../lib/components/umpire/HexChart.svelte";
    import Footer from "../lib/components/umpire/Footer.svelte";
    import type {
        UmpireData,
        HexDatum,
        HoverPoint,
        TooltipData,
    } from "../lib/components/umpire/types";
    import Shell from "../lib/components/layout/Shell.svelte";

    // === Data state ===
    let data: UmpireData | null = $state(null);
    let loading = $state(true);
    let selectedUmpire = $state("");
    let leftYear = $state(2020);
    let rightYear = $state(2025);
    const allYears = [2020, 2021, 2022, 2023, 2024, 2025];
    const minYear = allYears[0];
    const maxYear = allYears[allYears.length - 1];

    // === Hover / Tooltip state ===
    let hoverPoint: HoverPoint | null = $state(null);
    let tooltipData: TooltipData | null = $state(null);
    let tooltipX = $state(0);
    let tooltipY = $state(0);
    let syncTooltipData: HexDatum | null = $state(null);
    let syncTooltipX = $state(0);
    let syncTooltipY = $state(0);

    // === Container width (bind:clientWidth auto-updates) ===
    // wrapperEl is bound to the outermost div that always exists,
    // so onMount can always read its real width. Placing bind:clientWidth
    // inside {:else if data} would fail because that div isn't in the DOM
    // when loading=true at onMount time.
    let wrapperEl: HTMLDivElement | undefined = $state();
    let containerWidth = $state(0);
    const isMobile = $derived(containerWidth < 500);
    let mobileActive: "left" | "right" = $state("left");

    // === Dynamic chart dimensions ===
    const chartWidth = $derived(
        isMobile
            ? containerWidth - 32
            : Math.floor((containerWidth - 32 - 12) / 2),
    );
    const chartHeight = $derived(Math.floor(chartWidth * (4.25 / 4)) + 48);

    // === Data loading ===
    onMount(async () => {
        if (wrapperEl) containerWidth = wrapperEl.clientWidth;

        try {
            const res = await fetch(
                "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/umpire/hex_heatmap_data.json",
            );
            data = await res.json();
            if (data?.umpires?.length && data.umpires.length > 0)
                selectedUmpire = data.umpires[0];
        } catch (e) {
            console.error("Failed to load data:", e);
        }
        loading = false;
    });

    // === Reactive data ===
    const leftData = $derived.by((): HexDatum[] => {
        return data?.grid[`${selectedUmpire}_${leftYear}`] ?? [];
    });
    const rightData = $derived.by((): HexDatum[] => {
        return data?.grid[`${selectedUmpire}_${rightYear}`] ?? [];
    });
    const leftTotal = $derived(leftData.reduce((s, c) => s + c.n, 0));
    const rightTotal = $derived(rightData.reduce((s, c) => s + c.n, 0));

    // Fast lookup maps keyed by rounded coordinates,
    // used to compute diff when hovering one chart vs the other
    const leftMap = $derived(buildMap(leftData));
    const rightMap = $derived(buildMap(rightData));

    function buildMap(arr: HexDatum[]): Map<string, HexDatum> {
        const m = new Map<string, HexDatum>();
        arr.forEach((d) => m.set(coordKey(d.x, d.y), d));
        return m;
    }

    function coordKey(x: number, y: number): string {
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }

    // === Year stepper ===
    type Side = "left" | "right";

    function prevYear(side: Side) {
        if (side === "left" && leftYear > minYear) leftYear--;
        if (side === "right" && rightYear > minYear) rightYear--;
    }

    function nextYear(side: Side) {
        if (side === "left" && leftYear < maxYear) leftYear++;
        if (side === "right" && rightYear < maxYear) rightYear++;
    }

    // === Hover handlers ===
    function handleHover(d: HexDatum, event: MouseEvent, source: Side) {
        tooltipData = { ...d, source };
        tooltipX = event.clientX + 14;
        tooltipY = event.clientY - 12;
        hoverPoint = { x: d.x, y: d.y, source };
    }

    function handleLeave() {
        tooltipData = null;
        hoverPoint = null;
        syncTooltipData = null;
    }

    function handleSyncMatch(d: HexDatum | null, px: number, py: number) {
        if (d) {
            syncTooltipData = d;
            syncTooltipX = px + 14;
            syncTooltipY = py - 12;
        } else {
            syncTooltipData = null;
        }
    }

    // === Tooltip diff calculation ===
    // When hovering the active chart, find matching coordinates in the
    // other chart and compute the difference in called-strike rate
    function getDiff(d: TooltipData, source: Side): number | null {
        const k = coordKey(d.x, d.y);
        const other = source === "left" ? rightMap.get(k) : leftMap.get(k);
        if (!other) return null;
        return (d.csr - other.csr) * 100;
    }

    function fmtDiff(diff: number | null): string | null {
        if (diff === null) return null;
        const abs = Math.abs(diff).toFixed(1);
        if (diff > 0.05) return `+${abs}%`;
        if (diff < -0.05) return `-${abs}%`;
        return "0%";
    }

    function diffClass(diff: number | null): string {
        if (diff === null) return "";
        if (diff > 0.05) return "diff-pos";
        if (diff < -0.05) return "diff-neg";
        return "diff-zero";
    }
</script>

<Shell raw name="MLB主審好球帶" --font="Roboto Slab, Noto Sans TC">
    <div class="outer">
        <div
            bind:this={wrapperEl}
            bind:clientWidth={containerWidth}
            class="wrapper"
        >
            {#if loading}
                <div class="app">
                    <div class="loading">
                        <div class="spinner"></div>
                        載入主審判決資料中...
                    </div>
                </div>
            {:else if data}
                <div class="app">
                    <h1 class="page-title">
                        <span>MLB主審好球帶</span><span>判決熱度圖</span>
                    </h1>

                    <!-- Controls -->
                    <div class="controls">
                        <div class="control-group">
                            <label for="umpire-sel">主審：</label>
                            <select id="umpire-sel" bind:value={selectedUmpire}>
                                {#each data.umpires as name}
                                    <option value={name}>{name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- Mobile: dual tab to switch which year is visible -->
                    <div class="mobile-tabs">
                        <button
                            class="mobile-tab-btn"
                            class:active={mobileActive === "left"}
                            onclick={() => (mobileActive = "left")}
                        >
                            {selectedUmpire}
                            {leftYear}
                        </button>
                        <button
                            class="mobile-tab-btn"
                            class:active={mobileActive === "right"}
                            onclick={() => (mobileActive = "right")}
                        >
                            {selectedUmpire}
                            {rightYear}
                        </button>
                    </div>

                    <!-- Chart card -->
                    <div class="chart-card">
                        <div class="charts-grid">
                            <!-- Left chart -->
                            <div
                                class="chart-panel"
                                class:hidden={isMobile &&
                                    mobileActive !== "left"}
                            >
                                <div class="chart-title">
                                    {selectedUmpire}
                                    <div class="year-stepper title-stepper">
                                        <button
                                            class="year-arrow"
                                            onclick={() => prevYear("left")}
                                            disabled={leftYear <= minYear}
                                            >&#8249;</button
                                        >
                                        <span class="year-display">
                                            {leftYear}
                                        </span>
                                        <button
                                            class="year-arrow"
                                            onclick={() => nextYear("left")}
                                            disabled={leftYear >= maxYear}
                                            >&#8250;</button
                                        >
                                    </div>
                                </div>
                                <div class="chart-subtitle">
                                    總判決數：{leftTotal.toLocaleString()}
                                </div>

                                {#if leftData.length === 0}
                                    <div class="empty-state">
                                        <div class="empty-title">
                                            此年份無資料
                                        </div>
                                        <div class="empty-desc">
                                            {selectedUmpire} 在 {leftYear} 年<br
                                            />沒有足夠的判決紀錄
                                        </div>
                                    </div>
                                {:else}
                                    <HexChart
                                        hexData={leftData}
                                        hexSize={data.hexSize}
                                        strikeZone={data.strikeZone}
                                        width={chartWidth}
                                        height={chartHeight}
                                        onHover={(d, e) =>
                                            handleHover(d, e, "left")}
                                        onLeave={handleLeave}
                                        syncPoint={!isMobile &&
                                        hoverPoint?.source === "right"
                                            ? hoverPoint
                                            : null}
                                        onSyncMatch={!isMobile &&
                                        hoverPoint?.source === "right"
                                            ? handleSyncMatch
                                            : undefined}
                                    />
                                {/if}
                            </div>

                            <!-- Right chart -->
                            <div
                                class="chart-panel"
                                class:hidden={isMobile &&
                                    mobileActive !== "right"}
                            >
                                <div class="chart-title">
                                    {selectedUmpire}
                                    <div class="year-stepper title-stepper">
                                        <button
                                            class="year-arrow"
                                            onclick={() => prevYear("right")}
                                            disabled={rightYear <= minYear}
                                            >&#8249;</button
                                        >
                                        <span class="year-display">
                                            {rightYear}
                                        </span>
                                        <button
                                            class="year-arrow"
                                            onclick={() => nextYear("right")}
                                            disabled={rightYear >= maxYear}
                                            >&#8250;</button
                                        >
                                    </div>
                                </div>
                                <div class="chart-subtitle">
                                    總判決數：{rightTotal.toLocaleString()}
                                </div>

                                {#if rightData.length === 0}
                                    <div class="empty-state">
                                        <div class="empty-title">
                                            此年份無資料
                                        </div>
                                        <div class="empty-desc">
                                            {selectedUmpire} 在 {rightYear} 年<br
                                            />沒有足夠的判決紀錄
                                        </div>
                                    </div>
                                {:else}
                                    <HexChart
                                        hexData={rightData}
                                        hexSize={data.hexSize}
                                        strikeZone={data.strikeZone}
                                        width={chartWidth}
                                        height={chartHeight}
                                        onHover={(d, e) =>
                                            handleHover(d, e, "right")}
                                        onLeave={handleLeave}
                                        syncPoint={!isMobile &&
                                        hoverPoint?.source === "left"
                                            ? hoverPoint
                                            : null}
                                        onSyncMatch={!isMobile &&
                                        hoverPoint?.source === "left"
                                            ? handleSyncMatch
                                            : undefined}
                                    />
                                {/if}
                            </div>
                        </div>

                        <!-- Legend at bottom of card -->
                        <div class="legend-bottom">
                            <div class="legend-bottom-inner">
                                <span class="legend-end bad">← 傾向判壞球</span>
                                <div class="legend-center">
                                    <div class="legend-ticks-h">
                                        <span>0%</span><span>25%</span><span
                                            >50%</span
                                        ><span>75%</span><span>100%</span>
                                    </div>
                                    <div class="legend-gradient-h"></div>
                                    <div class="legend-unit">好球率（%）</div>
                                </div>
                                <span class="legend-end good">傾向判好球 →</span
                                >
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>

                <!-- Tooltip (active chart): includes diff -->
                {#if tooltipData}
                    {@const diff = getDiff(tooltipData, tooltipData.source)}
                    {@const otherLabel =
                        tooltipData.source === "left" ? rightYear : leftYear}
                    <div
                        class="hex-tooltip"
                        style="left:{tooltipX}px; top:{tooltipY}px;"
                    >
                        <strong style="color:#555; font-size:0.72rem;">
                            {tooltipData.source === "left"
                                ? leftYear
                                : rightYear} 年
                        </strong><br />
                        好球率：{(tooltipData.csr * 100).toFixed(1)}%<br />
                        {#if diff !== null}
                            <hr
                                style="border:none; border-top:1px solid #eee; margin:4px 0;"
                            />
                            <span style="font-size:0.72rem; color:#888;"
                                >vs {otherLabel} 年：</span
                            >
                            <span class={diffClass(diff)}>{fmtDiff(diff)}</span>
                        {/if}
                    </div>
                {/if}

                <!-- Tooltip (synced chart): shows corresponding cell -->
                {#if syncTooltipData && tooltipData}
                    {@const syncSource =
                        tooltipData.source === "left" ? "right" : "left"}
                    {@const diff = getDiff(
                        { ...syncTooltipData, source: syncSource },
                        syncSource,
                    )}
                    {@const thisYear =
                        tooltipData.source === "left" ? rightYear : leftYear}
                    <div
                        class="hex-tooltip sync"
                        style="left:{syncTooltipX}px; top:{syncTooltipY}px;"
                    >
                        <strong style="color:#555; font-size:0.72rem;"
                            >{thisYear} 年</strong
                        ><br />
                        好球率：{(syncTooltipData.csr * 100).toFixed(1)}%
                    </div>
                {/if}
            {:else}
                <div class="app">
                    <div class="loading">
                        資料載入失敗，請確認 JSON 是否存在。
                    </div>
                </div>
            {/if}
        </div>
    </div>
</Shell>

<style>
    :host {
        --bg: #f4f4f4;
        --card-bg: #ffffff;
        --text-header: #000;
        --text-title: #4c4442;
        --text-sub: #444444;
        --text-muted: #888888;
        --text-foot: #999999;
        --border: #e0e0e0;
        --accent: #0d6cf2;
        --green: #28bd73;
        --radius: 10px;

        font-family: "Roboto Slab", "Noto Sans TC", sans-serif;
        color: var(--text-title);
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .outer {
        width: 100%;
        background-image: url("https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/umpire/pattern.svg");
    }

    .wrapper {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }

    .app {
        padding: 16px;
    }

    /* ===== Page title ===== */
    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-header);
        margin-bottom: 12px;
        letter-spacing: 0.02em;
    }

    .page-title span {
        display: inline-block;
    }

    /* ===== Controls ===== */
    .controls {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        flex-wrap: wrap;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .control-group label {
        font-size: 0.82rem;
        color: var(--text-sub);
        font-weight: 600;
        white-space: nowrap;
    }

    .control-group select {
        padding: 6px 12px;
        border: 1px solid var(--border);
        border-radius: 7px;
        background: #fff;
        color: var(--text-title);
        font-size: 0.85rem;
        font-family: inherit;
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s;
        min-width: 140px;
    }

    .control-group select:hover,
    .control-group select:focus {
        border-color: var(--accent);
    }

    /* ===== Year stepper arrows ===== */
    .year-stepper {
        display: flex;
        align-items: center;
        gap: 0;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: #fff;
        overflow: hidden;
    }

    .year-arrow {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background 0.15s,
            color 0.15s;
        flex-shrink: 0;
    }

    .year-arrow:hover {
        background: #f0f0f0;
        color: var(--text-title);
    }
    .year-arrow:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .year-display {
        padding: 0 10px;
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--accent);
        min-width: 40px;
        text-align: center;
        user-select: none;
        border-left: 1px solid var(--border);
        border-right: 1px solid var(--border);
        line-height: 32px;
    }

    /* ===== Legend (bottom of card, horizontal) ===== */
    .legend-bottom {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--border);
    }

    .legend-bottom-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .legend-end {
        font-size: 0.72rem;
        font-weight: 700;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .legend-end.bad {
        color: var(--accent);
    }
    .legend-end.good {
        color: var(--green);
    }

    .legend-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        flex: 1;
        max-width: 280px;
    }

    .legend-ticks-h {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 0.65rem;
        color: var(--text-muted);
    }

    .legend-gradient-h {
        width: 100%;
        height: 10px;
        border-radius: 5px;
        background: linear-gradient(
            90deg,
            #0d6cf2 0%,
            #ffffff 50%,
            #28bd73 100%
        );
        border: 1px solid var(--border);
    }

    .legend-unit {
        font-size: 0.65rem;
        color: var(--text-muted);
    }

    .chart-card {
        border-radius: var(--radius);
        padding: 16px 16px 12px;
    }

    .charts-grid {
        display: flex;
        gap: 12px;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .chart-panel {
        flex: 1;
        min-width: 230px;
    }

    .chart-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-title);
        margin-bottom: 2px;
        flex-wrap: wrap;
    }

    .title-stepper {
        border-radius: 6px;
    }

    .title-stepper .year-arrow {
        width: 24px;
        height: 24px;
        font-size: 0.85rem;
    }

    .title-stepper .year-display {
        padding: 0 6px;
        font-size: 0.85rem;
        min-width: auto;
        line-height: 24px;
        font-weight: 700;
        color: var(--text-title);
    }

    .chart-subtitle {
        text-align: center;
        font-size: 0.72rem;
        color: var(--text-muted);
        margin-bottom: 6px;
    }

    /* ===== Empty state ===== */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 40px 20px;
        color: var(--text-muted);
        text-align: center;
        min-height: 200px;
    }

    .empty-state .empty-title {
        font-size: 0.92rem;
        font-weight: 600;
        color: var(--text-sub);
    }

    .empty-state .empty-desc {
        font-size: 0.78rem;
        line-height: 1.5;
    }

    /* ===== Mobile tabs ===== */
    .mobile-tabs {
        display: none;
        justify-content: center;
        gap: 4px;
        margin-bottom: 8px;
    }

    .mobile-tab-btn {
        flex: 1;
        max-width: 140px;
        padding: 7px 0;
        border: 1px solid var(--border);
        border-radius: 7px;
        background: #fff;
        color: var(--text-muted);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
        text-align: center;
    }

    .mobile-tab-btn.active {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
    }

    /* ===== Tooltip ===== */
    .hex-tooltip {
        position: fixed;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.97);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 0.78rem;
        color: var(--text-title);
        line-height: 1.7;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        z-index: 100;
        min-width: 130px;
    }

    .hex-tooltip.sync {
        border-color: #f0a500;
    }

    .diff-pos {
        color: var(--green);
        font-weight: 700;
    }
    .diff-neg {
        color: #e53935;
        font-weight: 700;
    }
    .diff-zero {
        color: var(--text-muted);
    }

    /* ===== Loading ===== */
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
        font-size: 0.95rem;
        color: var(--text-muted);
        gap: 10px;
    }

    .spinner {
        width: 18px;
        height: 18px;
        border: 3px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* ===== Mobile breakpoint (< 500px) ===== */
    @media (max-width: 499px) {
        .app {
            padding: 12px 10px;
        }
        .mobile-tabs {
            display: flex;
        }
        .charts-grid {
            flex-direction: column;
            gap: 0;
        }
        .chart-panel {
            min-width: 100%;
        }
        .chart-panel.hidden {
            display: none;
        }
    }
</style>
