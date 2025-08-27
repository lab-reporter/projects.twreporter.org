<script lang="ts">
  import { styleOptions } from '../../lib/constants/styles'
  import Loading from '../Loading.svelte'

  let innerWidth = $state<number>(window.innerWidth)
  let {
    card = $bindable(),
    loading = $bindable(false),
    scale = $bindable(1),
  } = $props()
</script>

<div
  class="card"
  style:transform={`scale(${scale})`}
  style:width={styleOptions.width + 'px'}
  style:height={styleOptions.height + 'px'}
  bind:this={card}
>
  {#if loading}
    <Loading />
  {:else}
    <slot />
  {/if}
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    background-color: #fff;
    padding: 15px 25px 20px 25px;
    transform-origin: 0px 0px;
    overflow: hidden;
  }
</style>
