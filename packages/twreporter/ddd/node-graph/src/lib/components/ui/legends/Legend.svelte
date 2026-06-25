<script lang="ts">
  import type { Legend } from './types'

  const { color, label }: Legend = $props()
</script>

<div class="legend">
  <div style:background-color={color} class="box"></div>
  <span class="label">{label}</span>
</div>

<style>
  .legend {
    --size: 18px;

    font-size: var(--size);
    color: var(--neutral-gray-800);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .box {
    width: var(--size);
    height: var(--size);

    border-radius: 4px;
  }

  .label {
    white-space: nowrap;
  }

  @container (min-width: 1080px) {
    .legend {
      --size: 20px;
    }
  }
</style>
