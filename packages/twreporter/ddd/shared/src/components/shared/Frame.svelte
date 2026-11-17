<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLDivElement> & {
    topLeft?: Snippet
    topRight?: Snippet
    bottomLeft?: Snippet
    bottomRight?: Snippet
    children?: Snippet
  }

  let {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    children,
    class: className,
    ...rest
  }: Props = $props()
</script>

<div class="container">
  <div class={['frame', className]} {...rest}>
    {#if topLeft || topRight}
      <div class="top">
        {#if topLeft}
          <div class="corner">{@render topLeft()}</div>
        {/if}
        {#if topRight}
          <div class="corner right">{@render topRight()}</div>
        {/if}
      </div>
    {/if}
    {@render children?.()}
    {#if bottomLeft || bottomRight}
      <div class="bottom">
        {#if bottomLeft}
          <div class="corner">{@render bottomLeft()}</div>
        {/if}
        {#if bottomRight}
          <div class="corner right">{@render bottomRight()}</div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    container-type: inline-size;
  }

  .frame {
    --top: 25px;
    --left: 40px;
    --right: 40px;
    --bottom: 30px;

    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: var(--top) var(--right) var(--bottom) var(--left);
    flex-direction: column;
    gap: 20px;
  }

  .top,
  .bottom {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 20px;
  }

  .bottom {
    margin-top: auto;
    align-items: flex-end;
  }

  .corner {
    min-width: 0;
  }

  .right {
    margin-left: auto;
  }

  @container (max-width: 1080px) {
    .frame {
      --top: 31px;
      --left: 35px;
      --right: 30px;
      --bottom: 35px;
    }
  }

  @container (max-width: 767px) {
    .frame {
      --top: 25px;
      --left: 25px;
      --right: 25px;
      --bottom: 30px;
    }
  }
</style>
