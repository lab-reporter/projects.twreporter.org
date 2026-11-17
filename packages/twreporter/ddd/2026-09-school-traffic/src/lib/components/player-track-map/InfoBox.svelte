<script lang="ts">
  import PaperCard from './PaperCard.svelte'
  import type { InfoBox as InfoBoxData } from '../../rpc.ts'

  const {
    id,
    info,
    onclose,
  }: {
    id: string
    info: InfoBoxData
    onclose: () => void
  } = $props()
</script>

<div {id} class="info-box" role="dialog" aria-labelledby={`${id}-title`}>
  <PaperCard style="--paper-padding: 10px">
    <div class="header">
      <h3 id={`${id}-title`}>{info.infoName}</h3>
      <button
        type="button"
        class="close"
        onclick={onclose}
        aria-label="關閉資訊">×</button
      >
    </div>
    {#if info.inspectItemSequence}
      <p class="item">{info.inspectItemSequence}</p>
    {/if}
    <p class="content">{info.infoContent}</p>
    {#if info.laws.length}
      <div class="sources">
        {#each info.laws as law}
          <p>{law}</p>
        {/each}
      </div>
    {/if}
  </PaperCard>
</div>

<style>
  .info-box {
    --map-text: #404040;
    --map-muted: rgb(64 64 64 / 60%);
    z-index: 1;
    position: absolute;
    position-anchor: --selected-marker;
    position-area: right;
    position-try-fallbacks:
      flip-inline,
      bottom span-all,
      top span-all,
      span-all;
    box-sizing: border-box;
    width: min(300px, calc(100vw - 32px));
    inset: auto;
    max-height: calc(100dvh - 32px);
    margin: 12px;
    padding: 0;
    overflow: visible;
    border: 0;
    background: transparent;
    font-family: inherit;
  }

  .header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
  }

  .close {
    flex-shrink: 0;
    border: 0;
    padding: 0 4px;
    background: transparent;
    color: inherit;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
  }

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  .item {
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--map-muted);
  }

  .content {
    white-space: pre-line;
    color: inherit;
    letter-spacing: 0.01em;
  }

  .sources {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-top: 5px;
  }

  .sources p {
    white-space: pre-line;
    font-size: 12px;
    line-height: 1.6;
    color: var(--map-muted);
  }
</style>
