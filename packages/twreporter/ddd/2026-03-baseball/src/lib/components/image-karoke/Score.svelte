<script lang="ts">
    import { getAudioContext } from "svelte-audio-player";
    import { toggle } from "svelte-audio-player/utils";

    const { currentTime, duration, paused } = getAudioContext();

    const { name, src }: { name: string; src: string } = $props();
</script>

<div class="scores">
    <div class="name">{name}</div>
    <div class="karaoke">
        <img alt={`${name} 簡譜`} {src} />
        <div
            class="overlay"
            style:--progress={`${($currentTime / $duration) * 100}%`}
        ></div>
    </div>
    <div class="controls">
        <button onclick={() => toggle(paused)}>
            {#if $paused}
                Play
            {:else}
                Pause
            {/if}
        </button>
    </div>
</div>

<style>
    .scores {
        display: flex;
        gap: 3px;
        align-items: center;
        justify-content: space-between;
    }

    .name {
        width: 10%;
    }

    .karaoke {
        width: 80%;
        position: relative;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to right,
            #f1f1f100 var(--progress, 0%),
            #f1f1f1aa var(--progress, 0%)
        );
        pointer-events: none;
    }

    .controls {
        width: 10%;
    }
</style>
