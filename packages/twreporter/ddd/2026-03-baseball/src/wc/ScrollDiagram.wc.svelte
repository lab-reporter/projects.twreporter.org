<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-scroll-diagram" }} />

<script lang="ts">
    import Shell from "../lib/components/layout/Shell.svelte";
    import ScrollDiagram from "./ScrollDiagram.svelte";
</script>

<Shell raw name="系譜圖" --font="Noto Sans TC">
    <ScrollDiagram />
</Shell>
