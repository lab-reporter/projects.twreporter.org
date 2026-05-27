<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import type { LayerSliderSteps } from './layer-slider/types'
  import type { Legends as LegendsType } from '@/lib/components/ui/legends/types'
  import Legends from '../ui/legends/Legends.svelte'
  import LayerSlider from './layer-slider/LayerSlider.svelte'
  import { assets } from '@/lib/constants/assets'
  import Controls from './Controls.svelte'

  type Props = SvelteHTMLElements['div'] & {
    title?: string
    description?: string
    children: Snippet
    legends?: LegendsType
    layers?: LayerSliderSteps
    footnotes?: string[] | string
    controls?: boolean
  }

  let {
    title,
    description,
    children,
    legends,
    layers,
    footnotes,
    class: className,
    controls = false,
    ...rest
  }: Props = $props()
</script>

<div class="container">
  <div class={['frame', className]} {...rest}>
    <div class="top">
      <h1 class="title">{title}</h1>
      {#if description}<h2 class="description">{description}</h2>{/if}

      {#if legends}
        <Legends {legends} />
      {/if}
    </div>

    <main class="canvas-slot">
      {@render children()}
    </main>

    <div class="right">
      {#if layers}
        <LayerSlider steps={layers} />
      {/if}
      {#if controls}
        <Controls />
      {/if}
      <img class="logo" src={assets.logo} alt="報導者" />
    </div>

    <footer class="bottom">
      <div class="footnotes">
        {#if typeof footnotes === 'string'}
          <p class="footnote">{footnotes}</p>
        {:else}
          {#each footnotes as note, index (index)}
            <p class="footnote">{note}</p>
          {/each}
        {/if}
      </div>
    </footer>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    container-type: inline-size;

    --background: var(--neutral-gray-100);
    --round: 10px;
  }

  .top,
  .right,
  .bottom {
    z-index: 10;
  }

  .frame {
    position: relative;
    width: 100%;
    height: 100%;
    margin: auto;
    overflow: hidden;
    border-radius: var(--round);
    background: var(--background);
    color: var(--neutral-gray-800);

    font-family: 'Noto Sans TC', sans-serif;
    --top: 25px;
    --left: 40px;
    --right: 40px;
    --bottom: 30px;
  }

  .top {
    --gap: 15px;

    position: absolute;
    width: fit-content;
    height: fit-content;

    background: var(--background);
    border-radius: var(--round);
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
    padding: var(--top) var(--left);
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    max-width: calc(100% - var(--left) - var(--right));
  }

  .right {
    --gap: 30px;

    position: absolute;
    width: fit-content;
    height: fit-content;
    background: var(--background);
    border-radius: var(--round);
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
    padding: var(--bottom) var(--right);
    bottom: 0;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap);
  }

  .bottom {
    position: absolute;
    width: fit-content;
    height: fit-content;

    background: var(--background);
    border-radius: var(--round);
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: var(--bottom) var(--left);
    bottom: 0;
    left: 0;
  }

  .title,
  .description,
  .footnote {
    margin: 0;
  }

  .title {
    --size: 32px;

    font-size: var(--size);
    font-weight: 700;

    line-height: 1.25;
    letter-spacing: 0.4px;
  }

  .description {
    --size: 16px;

    font-size: var(--size);
    font-weight: 400;

    line-height: 1.25;
    letter-spacing: 0.4px;
  }

  .canvas-slot {
    width: 100%;
    height: 100%;
  }

  .layers-slot {
    position: absolute;
    inset-block-start: 2.53%;
    inset-inline-end: 2.5%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  .footnotes {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 5px;
  }

  .footnote {
    --size: 16px;
    color: var(--neutral-gray-500);
    font-size: var(--size);
    line-height: 1.3;
    white-space: pre-wrap;
  }

  .logo {
    --size: 48px;
    display: block;
    inline-size: var(--size);
    block-size: auto;
    flex: 0 0 auto;
  }

  @container (max-width: 700px) {
    .frame {
      --top: 25px;
      --left: 25px;
      --bottom: 30px;
      --right: 25px;
    }

    .top {
      --gap: 5px;
    }

    .right {
      --gap: 5px;
    }

    .title {
      --size: 24px;
    }

    .footnote {
      --size: 12px;
    }

    .logo {
      --size: 26px;
    }
  }

  @container (max-width: 1080px) {
    .frame {
      --top: 31px;
      --left: 35px;
      --bottom: 35px;
      --right: 30px;
    }

    .top {
      --gap: 15px;
    }

    .right {
      --gap: 19px;
    }

    .title {
      --size: 32px;
    }

    .footnote {
      --size: 12px;
    }

    .logo {
      --size: 26px;
    }
  }
</style>
