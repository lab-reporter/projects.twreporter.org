<script lang="ts">
  import MaterialSymbols from '../../icons/MaterialSymbols.svelte'
  import Legend from './Legend.svelte'
  import type { Legends } from './types'

  const { legends }: { legends: Legends } = $props()

  let open = $state(true)
</script>

<div class="legends">
  <div class="items">
    {#if open}
      {#each legends as legend}
        <Legend {...legend} />
      {/each}
    {/if}
    <button onclick={() => (open = !open)}>
      <div style:display="contents" style:color="var(--neutral-white)">
        <MaterialSymbols
          name={open ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}
          size={16}
          style="background-color: var(--chart-gray-5); border-radius: 4px;"
        />
      </div>
      <span style:display={open ? 'none' : 'inline'}>圖例</span>
    </button>
  </div>
</div>

<style>
  .legends {
    width: 100%;
    z-index: 50;
    background-color: var(--neutral-white);
    padding: 7px 8px;
    border-radius: 4px;
  }

  .items {
    display: flex;
    gap: 10px 15px;
    flex-wrap: wrap;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: start;
    gap: 5px;
  }

  @container (min-width: 700px) {
    button > span {
      display: none;
    }

    .legends {
      padding: 0;
      background-color: transparent;
    }
  }
</style>
