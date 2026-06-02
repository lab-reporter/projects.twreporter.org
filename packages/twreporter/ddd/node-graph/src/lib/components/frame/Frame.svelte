<script lang="ts">
  import type { Legends as LegendsType } from '@/lib/components/ui/legends/types'
  import { assets } from '@/lib/constants/assets'
  import type { Snippet } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import NodePopup from '../canvas/Popup.svelte'
  import Legends from '../ui/legends/Legends.svelte'
  import Controls from './Controls.svelte'
  import LayerSlider from './layer-slider/LayerSlider.svelte'
  import type { LayerSliderSteps } from './layer-slider/types'

  type Props = SvelteHTMLElements['div'] & {
    title?: string
    description?: string
    children: Snippet
    legends?: LegendsType
    layers?: LayerSliderSteps
    footnotes?: string[] | string
    controls?: boolean
    variant?: 'default' | 'social'
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
    variant = 'default',
    ...rest
  }: Props = $props()
</script>

<div class="container">
  <div class={['frame', className, { social: variant === 'social' }]} {...rest}>
    <div class="top">
      <div class="header">
        <h1 class="title">{title}</h1>
        {#if description}<h2 class="description">{description}</h2>{/if}

        {#if legends}
          <Legends {legends} />
        {/if}
      </div>
      {#if variant !== 'social'}
        <div class="node-popup-container">
          <NodePopup />
        </div>
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

    {#if footnotes}
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
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    container-type: inline-size;

    --background: var(--neutral-gray-100);
    --round: 3px;
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
    background: var(--background);
    color: var(--neutral-gray-800);

    font-family: 'Noto Sans TC', sans-serif;
    --top: 25px;
    --left: 40px;
    --right: 40px;
    --bottom: 30px;
    --popup-width: 300px;

    border-top: 1px solid var(--neutral-gray-200);
    border-bottom: 1px solid var(--neutral-gray-300);
  }

  .frame.social {
    --top: 75px;
    --left: 75px;
    --right: 75px;
    --bottom: 75px;
  }

  .top {
    --gap: 15px;

    position: absolute;
    width: fit-content;
    height: fit-content;

    top: 0;
    left: 0;
    display: flex;
    align-items: start;
    justify-content: space-between;
    width: 100%;
    pointer-events: none;
  }

  .header,
  .right,
  .bottom {
    background: color-mix(in srgb, var(--background) 70%, transparent);
    border-radius: var(--round);
  }

  .header {
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
    padding: var(--top) calc(var(--left) / 2) calc(var(--top) / 2) var(--left);
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    pointer-events: auto;
  }

  .right {
    --gap: 30px;

    position: absolute;
    width: fit-content;
    height: fit-content;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
    padding: calc(var(--bottom) / 2) var(--right) var(--bottom)
      calc(var(--right) / 2);
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

    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: calc(var(--bottom) / 2) calc(var(--left) / 2) var(--bottom)
      var(--left);
    bottom: 0;
    left: 0;
  }

  .title,
  .description,
  .footnote {
    margin: 0;
    white-space: pre-wrap;
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

  .node-popup-container {
    --popup-width: 255px;

    width: var(--popup-width);
    margin: var(--top) var(--right) 0 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  @container (max-width: 700px) {
    .frame {
      --top: 25px;
      --left: 25px;
      --bottom: 30px;
      --right: 25px;
      --popup-width: 200px;
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

    .node-popup-container {
      --popup-width: 200px;
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
