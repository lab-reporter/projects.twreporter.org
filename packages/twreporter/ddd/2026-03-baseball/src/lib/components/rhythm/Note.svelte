<script lang="ts">
    import type { TrackStyle } from "../../constants/interactive-music";
    import Bass from "../icons/Bass.svelte";
    import Drum from "../icons/Drum.svelte";
    import Spark from "../icons/Spark.svelte";
    import SparkTwist from "../icons/SparkTwist.svelte";

    let {
        note = 8,
        active = false,
        rest = false,
        text,
        style = "note",
        swing,
    }: {
        note?: number;
        active?: boolean;
        rest?: boolean;
        text?: string;
        style?: TrackStyle;
        swing?: true;
    } = $props();

    let pulse = $state(false);
    let color = $derived(swing ? "var(--swing-color)" : "var(--primary-color)");

    $effect(() => {
        if (active === true) {
            pulse = true;
        }
    });
</script>

<div class={`note note-${note}`} style:opacity={rest ? 0 : 1}>
    <div
        class="start"
        class:active={pulse}
        class:swing
        onanimationend={() => (pulse = false)}
    >
        {#if text}
            <p data-text={text}>{text}</p>
        {:else if style == "note"}
            {#if swing}
                <SparkTwist --color={color} />
            {:else}
                <Spark --color={color} />
            {/if}
        {:else if style == "bass"}
            <Bass --color={color} />
        {:else if style == "drum"}
            <Drum --color={color} />
        {/if}
    </div>
</div>

<style>
    .start {
        --size: 20px;

        width: var(--size, 20px);
        height: var(--size, 20px);
        transform-origin: center center;
        font-size: var(--size, 20px);
        will-change: transform;
    }

    .start:has(p) {
        height: calc(var(--size, 20px) + 10px);
    }

    .start.swing {
        transform: rotate(180deg);
        animation-composition: add;
    }

    .note-8 {
        grid-column: span 1;
    }

    .note-4 {
        grid-column: span 2;
    }

    .note-2 {
        grid-column: span 4;
    }

    .active {
        animation-name: active;
        animation-duration: 200ms;
    }

    @keyframes active {
        50% {
            transform: scale(1.5);
        }
    }

    p {
        color: #f2f1ed;
        font-weight: bold;
        text-align: center;
        z-index: 0;
        filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.25));
        -webkit-text-stroke: 6px var(--outline-color);
    }

    p::before {
        position: absolute;
        top: 0;
        left: 0;
        content: attr(data-text);
        color: var(--background-color);
        -webkit-text-stroke: 0;
    }

    @media (max-width: 550px) {
        .start {
            --size: 18px;
            margin-left: calc((20px - var(--size)) / 2 + 1px);
        }

        p {
            -webkit-text-stroke: 5px var(--outline-color);
        }
    }

    @media (max-width: 400px) {
        .start {
            --size: 16px;
            margin-left: calc((20px - var(--size)) / 2);
        }
    }
</style>
