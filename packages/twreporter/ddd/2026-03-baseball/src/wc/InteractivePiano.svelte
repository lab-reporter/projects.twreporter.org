<script lang="ts">
    import AudioProvider from "../lib/components/audio/AudioProvider.svelte";
    import PianoRoll from "../lib/components/piano/PianoRoll.svelte";
    import type { PianoScoreConfig } from "../lib/constants/interactive-piano";

    const { scores }: { scores: PianoScoreConfig[] } = $props();
</script>

<div class="scores">
    {#each scores as score}
        <AudioProvider src={score.src}>
            <PianoRoll {score} />
        </AudioProvider>
    {/each}
</div>

<style>
    .scores {
        display: flex;
        flex-direction: column;
        gap: 50px;
    }

    @media (max-width: 550px) {
        .scores {
            gap: 60px;
        }
    }
</style>
