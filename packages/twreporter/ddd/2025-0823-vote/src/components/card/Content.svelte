<script lang="ts">
  import Loading from '../Loading.svelte'

  let { loading = $bindable(), style }: { loading?: boolean; style?: string } =
    $props()
</script>

<div class="card-content" {style}>
  {#if loading}
    <Loading />
  {:else}
    <slot />
  {/if}
</div>

<style>
  .card-content {
    background-color: #f1f1f1;
    width: 100%;
    height: 100%;
    margin: 5px 0;
    border-radius: 7px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    position: relative;
  }
</style>
