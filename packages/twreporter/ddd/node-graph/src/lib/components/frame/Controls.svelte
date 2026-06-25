<script lang="ts">
  import {
    useSvelteFlow,
    type ViewportHelperFunctionOptions,
  } from '@xyflow/svelte'
  import MaterialSymbols from '../icons/MaterialSymbols.svelte'

  const { zoomIn, zoomOut, fitView } = useSvelteFlow()

  const transitionConfig: ViewportHelperFunctionOptions = {
    duration: 0.5,
    interpolate: 'smooth',
  }
</script>

<div class="container">
  <MaterialSymbols name="pinch_zoom_in" size={16} />
  <div class="controls">
    <button onclick={() => zoomIn(transitionConfig)}
      ><MaterialSymbols name="add" size={16} /></button
    >
    <button onclick={() => zoomOut(transitionConfig)}
      ><MaterialSymbols name="remove" size={16} /></button
    >
    <button onclick={() => fitView(transitionConfig)}
      ><MaterialSymbols name="expand_content" size={16} /></button
    >
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: var(--neutral-gray-400);
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    gap: 5px;
    background-color: var(--neutral-offwhite);
    border-radius: 5px;
    color: var(--text-color);
  }
</style>
