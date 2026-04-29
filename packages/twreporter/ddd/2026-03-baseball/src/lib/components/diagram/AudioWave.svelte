<script lang="ts">
    import { getAudioContext } from "svelte-audio-player";
    import PlayControls from "../player/PlayControls.svelte";

    const { paused } = getAudioContext();
</script>

<div class="audio-wave">
    <PlayControls />
    <div class="bars" class:paused={$paused}>
        {#each { length: 5 } as _, i}
            <span class="bar" style:animation-delay={`${i * -0.15}s`}></span>
        {/each}
    </div>
</div>

<style>
    .audio-wave {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
    }

    .bars {
        display: flex;
        align-items: end;
        gap: 3px;
        height: 20px;
    }

    .bar {
        width: 3px;
        border-radius: 2px;
        background: var(--back-900, #1a1a1a);
        animation: wave 0.8s ease-in-out infinite alternate;
    }

    .paused .bar {
        animation-play-state: paused;
    }

    @keyframes wave {
        0% {
            height: 4px;
        }
        100% {
            height: 18px;
        }
    }
</style>
