<script lang="ts">
  import MaterialSymbols from './MaterialSymbols.svelte'
</script>

<MaterialSymbols name="progress_activity" class="spinner" />

<style>
  :global(.spinner) {
    animation: rotation 1s linear infinite;
    width: min-content;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
