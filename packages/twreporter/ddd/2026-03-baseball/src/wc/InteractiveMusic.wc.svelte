<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-interactive-music" }} />

<script lang="ts">
    import Shell from "../lib/components/layout/Shell.svelte";
    import AudioProvider from "../lib/components/audio/AudioProvider.svelte";
    import { keys, type TrackConfig } from "../lib/constants/interactive-music";
    import InteractiveMusic from "./InteractiveMusic.svelte";
    import SongTitle from "../lib/components/player/SongTitle.svelte";

    const { key }: { key: string } = $props();

    const config = keys[key];

    const footnotes = [
        ...(config.footnotes ?? []),
        "資料整理：黃靖緯、許詩愷｜設計：江世民",
    ];

    let activeMusic: TrackConfig = $state(config.states.default);
</script>

<Shell
    name={config.title}
    {footnotes}
    description={config.subtitle}
    backgroundStyle="alternative"
>
    <AudioProvider src={activeMusic.src}>
        <InteractiveMusic
            states={config.states}
            bind:active={activeMusic}
            songTitle={config.songTitle}
            endingPadding={config.endingPadding}
            repeatPadding={config.repeatPadding}
        />
    </AudioProvider>
    {#snippet headerChildren()}
        <SongTitle title={config.songTitle} />
    {/snippet}
</Shell>
