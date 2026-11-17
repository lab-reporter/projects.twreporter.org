<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  const {
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    children: Snippet
  } = $props()
</script>

<div {...rest}>
  {@render children()}
</div>

<style>
  div {
    --paper-grid-line: color-mix(
      in srgb,
      var(--map-panel-border) 60%,
      transparent
    );
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: inherit;
    overflow: auto;
    padding: var(--paper-padding, 10px 15px);
    border: 1px solid var(--map-panel-border);
    border-radius: 5px;
    background:
      linear-gradient(var(--paper-grid-line) 1px, transparent 1px) 0 0 / 25px
        25px,
      linear-gradient(90deg, var(--paper-grid-line) 1px, transparent 1px) 0 0 /
        25px 25px,
      var(--map-panel);
    color: var(--map-text);
    box-shadow:
      0 1px 2px rgb(31 36 32 / 8%),
      0 8px 24px rgb(31 36 32 / 14%);
    backdrop-filter: blur(7.5px);
  }
</style>
