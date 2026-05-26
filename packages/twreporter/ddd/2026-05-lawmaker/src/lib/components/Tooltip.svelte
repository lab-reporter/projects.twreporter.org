<script lang="ts">
  let {
    x,
    y,
    label,
    value,
    seriesName,
    seriesColor,
  }: {
    x: number
    y: number
    label: string
    value: number
    seriesName?: string
    seriesColor?: string
  } = $props()
</script>

<div
  class="tooltip"
  style:left={x <= window.innerWidth / 2 ? `${x + 20}px` : undefined}
  style:right={x > window.innerWidth / 2
    ? `${window.innerWidth - x - 5}px`
    : undefined}
  style:top={`${y}px`}
>
  {#if seriesName}
    <div class="header">
      {label}
    </div>
    <div class="content">
      <div class="legend">
        <div class="legend-swatch" style:background-color={seriesColor}></div>
        <span class="legend-label">{seriesName}</span>
      </div>
      <span class="value">{value.toLocaleString()}</span>
    </div>
  {:else}
    <div class="content">
      <div class="legend">
        <span class="legend-label">{label}</span>
      </div>
      <span class="value">{value.toLocaleString()}</span>
    </div>
  {/if}
</div>

<style>
  .tooltip {
    position: fixed;
    pointer-events: none;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: rgba(250, 250, 250, 0.95);
    color: var(--neutral-gray-700);
    border-radius: 4px;
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    font-size: var(--text-s);
    white-space: nowrap;
    border: 1px solid var(--neutral-gray-200);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .header {
    font-size: var(--text-s);
    border-bottom: 1.5px solid var(--neutral-gray-200);
    padding: 6px 10px;
    font-weight: 500;
  }

  .legend {
    display: flex;
    align-items: center;
    align-self: stretch;
    gap: 6px;
    max-width: 200px;
    color: var(--neutral-gray-700);
    border-right: 1.5px solid var(--neutral-gray-200);
    padding: 6px 10px 8px 0;
    @media screen and (max-width: 767px) {
      max-width: 180px;
    }
  }
  .legend-swatch {
    width: 6px;
    align-self: stretch;
    border-radius: 1px;
    flex-shrink: 0;
  }
  .legend-label {
    font-size: var(--text-s);
    color: var(--neutral-gray-700);
    text-wrap: auto;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0px 10px;
  }

  .value {
    padding: 6px 0;
  }
</style>
