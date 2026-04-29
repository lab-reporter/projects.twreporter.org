<script lang="ts">
    import type { Snippet } from 'svelte'

    const { children }: { children: Snippet } = $props()
</script>

<div class="layout">
    {@render children()}
</div>

<style>
    .layout {
        display: grid;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        grid-template-columns: 300px 1fr;
        grid-template-rows: 85px 1fr;
    }
</style>
