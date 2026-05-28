<script lang="ts">
  import type { Resolution } from '@/lib/constants/viewports'
  import ActionButton from '../ui/ActionButton.svelte'
  import { resolutionToRatio } from '@/lib/utils/resolution'
  import MaterialSymbols from '../icons/MaterialSymbols.svelte'

  const { resolution }: { resolution: Resolution } = $props()
</script>

<ActionButton label="像素｜比例">
  <div class="container">
    {#if resolution}
      {@const [width, height] = resolution}
      {@const [ratioW, ratioH] = resolutionToRatio(resolution)}
      <div class="resolution-block">
        <p>{width}</p>
        <MaterialSymbols name="close" size={20} />
        <p>{height}</p>
      </div>
      <div class="ratio-block">
        {ratioW}:{ratioH}
      </div>
    {:else}
      <div class="ratio-block">滿版模式</div>
    {/if}
  </div>
</ActionButton>

<style>
  .container {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    color: var(--neutral-gray-600);
    font-size: 18px;
    line-height: 1.2;
    letter-spacing: 0.6px;
  }

  .resolution-block {
    display: flex;
    gap: 1px;
    align-items: center;
    justify-content: center;
  }

  .ratio-block {
    background-color: var(--neutral-gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px 3px 6px;
    font-size: 14px;
  }
</style>
