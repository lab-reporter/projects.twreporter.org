<script lang="ts">
    import type { Snippet } from 'svelte'

    const { children }: { children: Snippet } = $props()
</script>

<div>
    {@render children()}
</div>

<style>
    div {
        padding: 4px 8px;
        background-color: black;
        color: white;
    }
</style>
