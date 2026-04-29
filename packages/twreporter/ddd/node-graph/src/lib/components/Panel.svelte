<script lang="ts">
    import type { Snippet } from 'svelte'

    const {
        children,
        variant,
    }: { children: Snippet; variant?: 'top' | 'left' } = $props()
</script>

<div class={['panel', variant]}>
    {@render children()}
</div>

<style>
    .panel {
        width: 100%;
        height: 100%;
        background-color: var(--neutral-gray-50);
        border-radius: 10px;
        border: 1px solid var(--neutral-gray-400);
    }

    .panel.top {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-width: 0;
        border-right-width: 0;
    }

    .panel.left {
        border-top-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0;
        border-bottom-width: 0;
    }
</style>
