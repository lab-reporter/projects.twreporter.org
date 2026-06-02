<script lang="ts">
  import { getCanvasContext } from './CanvasState.svelte'

  const canvasState = getCanvasContext()
  const popup = $derived(canvasState.popupData)
</script>

{#if popup?.type === 'graph-node' && popup.data}
  {@const { data } = popup}
  <div
    class={[
      'popup',
      'node-popup',
      { active: data?.tooltipsEnabled && !data.expanded },
    ]}
  >
    {#if data}
      <div class="summary">
        {#if data.label}
          <div class="name">{data.label}</div>
        {/if}
        {#if data.categoryLabel}
          <div
            class="category"
            style:--background-color={data.backgroundColor}
            style:--text-color={data.textColor}
          >
            {data.categoryLabel}
          </div>
        {/if}
      </div>

      {#if data.note || data.infoSource}
        <div class="detail">
          {#if data.note}
            <p class="note">{data.note}</p>
          {/if}

          {#if data.infoSource}
            <p class="source">資料來源｜{data.infoSource}</p>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
{/if}

{#if popup?.type === 'graph-edge' && popup.data}
  {@const { data } = popup}
  <div class={['popup', 'edge-popup', { active: data.tooltipsEnabled }]}>
    {#if data.sourceLabel && data.targetLabel}
      <div class="title">
        {data.sourceLabel} → {data.targetLabel}
      </div>
    {/if}

    {#if data.relationLabel}
      <div class="pill">{data.relationLabel}</div>
    {/if}

    {#if data.note}
      <p class="note">{data.note}</p>
    {/if}

    {#if data.infoSource}
      <p class="source">資料來源｜{data.infoSource}</p>
    {/if}
  </div>
{/if}

<style>
  .popup {
    z-index: 5000;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-radius: 3px;
    overflow: hidden;
    background: var(--neutral-white);
    opacity: 0.95;
    padding: 9px 10px;
    gap: 6px;
    width: 100%;
    visibility: hidden;
    pointer-events: auto;
  }

  .popup.active {
    visibility: inherit;
  }

  .node-popup .summary {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    background: var(--neutral-white);
  }

  .node-popup .name {
    color: var(--neutral-gray-800);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.6px;
    line-height: 1.2;
  }

  .node-popup .category {
    align-self: flex-start;
    padding: 2px 6px;
    border-radius: 2px;
    background: var(--background-color, var(--chart-earth-2));
    color: var(--text-color, var(--neutral-gray-800));
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.5;
    white-space: nowrap;
  }

  .node-popup .detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .node-popup .note {
    margin: 0;
    color: var(--neutral-gray-600);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.6px;
    line-height: 1.5;
  }

  .node-popup .source {
    margin: 0;
    color: var(--neutral-gray-500);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.5;
  }

  .edge-popup {
    text-align: center;
  }

  .edge-popup .title {
    color: var(--neutral-gray-800);
    font-size: 10px;
    font-weight: 600;
    line-height: 1.35;
  }

  .edge-popup .pill {
    align-self: stretch;
    text-align: center;
    padding: 2px 6px 3px;
    /* border-radius: 999px; */
    background: var(--neutral-gray-200);
    color: var(--neutral-gray-800);
    font-size: 8px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.4px;
  }

  .edge-popup .note {
    margin: 0;
    color: var(--neutral-gray-700);
    font-size: 11px;
    line-height: 1.4;
  }

  .edge-popup .source {
    margin: 0;
    color: var(--neutral-gray-500);
    font-size: 9px;
    line-height: 1.4;
  }
</style>
