<script lang="ts">
  import { onMount, type Snippet } from 'svelte'

  const {
    children,
    content,
    variant = 'dark',
  }: {
    children: Snippet
    content: Snippet
    variant?: 'dark' | 'light'
  } = $props()
  let visible = $state(false)
  let x = $state(0)
  let y = $state(0)
  let width = $state(0)
  let height = $state(0)
  let touchStart: { x: number; y: number } | undefined
  let touchMoved = false
  let touchInteraction = false

  onMount(() => {
    const dismiss = () => {
      visible = false
      if (touchStart) touchMoved = true
    }
    const keyboardInteraction = () => {
      touchInteraction = false
    }
    // Capture also catches scrolling inside a chart's horizontal viewport.
    window.addEventListener('scroll', dismiss, true)
    window.addEventListener('resize', dismiss)
    window.addEventListener('pointerdown', dismiss, true)
    window.addEventListener('keydown', keyboardInteraction, true)
    return () => {
      window.removeEventListener('scroll', dismiss, true)
      window.removeEventListener('resize', dismiss)
      window.removeEventListener('pointerdown', dismiss, true)
      window.removeEventListener('keydown', keyboardInteraction, true)
    }
  })
</script>

<div
  role="group"
  class="anchor"
  onpointerenter={(event) => {
    if (event.pointerType === 'touch') return
    touchInteraction = false
    visible = true
    x = event.clientX
    y = event.clientY
  }}
  onpointermove={(event) => {
    if (event.pointerType === 'touch') {
      if (
        touchStart &&
        Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) >
          8
      ) {
        touchMoved = true
        visible = false
      }
      return
    }
    x = event.clientX
    y = event.clientY
  }}
  onpointerleave={(event) => {
    // Touch pointers leave as soon as the finger lifts, after pointerup.
    if (event.pointerType === 'touch') return
    visible = false
  }}
  onpointerdown={(event) => {
    touchInteraction = event.pointerType === 'touch'
    if (!touchInteraction) return
    touchStart = { x: event.clientX, y: event.clientY }
    touchMoved = false
    visible = false
  }}
  onpointerup={(event) => {
    if (event.pointerType !== 'touch') return
    if (touchStart && !touchMoved) {
      x = event.clientX
      y = event.clientY
      visible = true
    }
    touchStart = undefined
  }}
  onpointercancel={() => {
    touchStart = undefined
    touchMoved = true
    visible = false
  }}
  onfocusin={(event) => {
    if (touchInteraction) return
    const bounds = event.currentTarget.getBoundingClientRect()
    x = bounds.left + bounds.width / 2
    y = bounds.bottom
    visible = true
  }}
  onfocusout={() => {
    visible = false
  }}
>
  {@render children()}
</div>

{#if visible}
  <div
    class:light={variant === 'light'}
    class="tooltip"
    role="tooltip"
    bind:clientWidth={width}
    bind:clientHeight={height}
    style:left={Math.max(8, Math.min(x + 12, window.innerWidth - width - 8)) +
      'px'}
    style:top={Math.max(8, Math.min(y + 12, window.innerHeight - height - 8)) +
      'px'}
  >
    {@render content()}
  </div>
{/if}

<style>
  .anchor {
    min-width: 0;
  }
  .tooltip {
    position: fixed;
    z-index: 100;
    width: max-content;
    max-width: min(320px, calc(100vw - 32px));
    padding: 10px 12px;
    border-radius: 6px;
    background: var(--neutral-gray-900);
    color: var(--neutral-white);
    font-size: 13px;
    line-height: 1.6;
    box-shadow: 0 4px 14px
      color-mix(in srgb, var(--neutral-black) 20%, transparent);
    pointer-events: none;
  }
  .tooltip :global(*) {
    color: inherit;
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }
  .tooltip.light {
    border: 1px solid var(--neutral-gray-200);
    padding: 0;
    border-radius: 6px;
    background: #ffffffee;
    color: var(--neutral-gray-800);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
  }
</style>
