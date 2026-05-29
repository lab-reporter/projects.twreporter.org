<script lang="ts">
  import { getCanvasContext } from './CanvasState.svelte'

  const canvasState = getCanvasContext()
  const data = $derived(canvasState.popupData)
</script>

<div
  class={['node-popup', { active: data?.tooltipsEnabled && !data.expanded }]}
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

<style>
  .node-popup {
    z-index: 5000;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 3px;
    overflow: hidden;
    background: var(--neutral-white);
    opacity: 0.95;
    padding: 8px 10px;
    gap: 3px;
    width: 100%;
    visibility: hidden;
    pointer-events: auto;
  }

  .node-popup.active {
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
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.6px;
    line-height: 1.2;
    white-space: nowrap;
  }

  .node-popup .category {
    align-self: flex-start;
    padding: 2px 4px;
    border-radius: 2px;
    background: var(--background-color, var(--chart-earth-2));
    color: var(--text-color, var(--neutral-gray-800));
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.5;
    white-space: nowrap;
  }

  .node-popup .detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--neutral-gray-50);
  }

  .node-popup .note {
    margin: 0;
    color: var(--neutral-gray-700);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.6px;
    line-height: 1.5;
  }

  .node-popup .source {
    margin: 0;
    color: var(--neutral-gray-500);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.5;
  }
</style>
