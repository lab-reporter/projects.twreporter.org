<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { SvelteHTMLElements } from 'svelte/elements'
    import { assets } from '../constants/assets'

    type Props = SvelteHTMLElements['div'] & {
        title?: string
        description?: string
        children: Snippet
        legends?: Snippet
        layers?: Snippet
        footnotes?: string[]
    }

    let {
        title = '社安網廣設「社福中心」關鍵樞紐壓力日常',
        description,
        children,
        legends,
        layers,
        footnotes,
        class: className,
        ...rest
    }: Props = $props()
</script>

<div class="container">
    <div class={['frame', className]} {...rest}>
        <div class="top">
            <h1 class="title">{title}</h1>
            {#if description}<h2 class="description">{description}</h2>{/if}

            {#if legends}
                {@render legends()}
            {/if}
        </div>

        <main class="canvas-slot" aria-label="圖表主內容">
            {@render children()}
        </main>

        <div class="right">
            {#if layers}
                {@render layers()}
            {/if}
            <img class="logo" src={assets.logo} alt="報導者" />
        </div>

        <footer class="bottom">
            <div class="footnotes">
                {#each footnotes as note, index (index)}
                    <p class="footnote">{note}</p>
                {/each}
            </div>
        </footer>
    </div>
</div>

<style>
    .container {
        container-type: inline-size;
    }

    .frame {
        position: relative;
        margin: auto 10px;
        aspect-ratio: 1/1;
        overflow: hidden;
        border-radius: 10px;
        background: var(--neutral-gray-100);
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
        top: var(--top);
        left: var(--left);
        display: flex;
        flex-direction: column;
        gap: var(--gap);
    }

    .right {
        --gap: 30px;

        position: absolute;
        width: fit-content;
        height: fit-content;
        bottom: var(--bottom);
        right: var(--right);

        display: flex;
        flex-direction: column;
        gap: var(--gap);
    }

    .bottom {
        position: absolute;
        width: fit-content;
        height: fit-content;
        bottom: var(--bottom);
        left: var(--left);
    }

    .title,
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
</style>
