<script lang="ts">
    import type { Snippet } from "svelte";
    import { AudioPlayer } from "svelte-audio-player";
    import AudioController from "./AudioController.svelte";

    const { src, children }: { src: string; children: Snippet } = $props();
</script>

<AudioPlayer {src}>
    <AudioController>
        {@render children()}
    </AudioController>
</AudioPlayer>
