<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-interactive-piano" }} />

<script lang="ts">
    import Shell from "../lib/components/layout/Shell.svelte";
    import { keys } from "../lib/constants/interactive-piano";
    import InteractivePiano from "./InteractivePiano.svelte";

    const {
        key,
        "background-style": backgroundStyle = "default",
    }: { key: string; "background-style"?: "default" | "double" } = $props();
    const config = keys[key];

    const footnotes = [
        ...(config.footnotes ?? []),
        "資料整理：黃靖緯、許詩愷｜設計：江世民",
    ];
</script>

<Shell
    name={config.title}
    {footnotes}
    description={config.subtitle}
    {backgroundStyle}
>
    <InteractivePiano scores={config.scores} />
</Shell>
