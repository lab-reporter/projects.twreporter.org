<script lang="ts">
    import type { Snippet } from "svelte";

    const { children }: { children: Snippet } = $props();
</script>

<div>
    {@render children()}
</div>

<style>
    div {
        background-color: var(--neutral-gray-900);
        padding: 7.5px;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        box-shadow: 5px 3px 10px 0 rgba(0, 0, 0, 0.1);
        font-size: var(--btn-size);
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: 0.72px;
        color: var(--neutral-white);
    }

    @media (max-width: 400px) {
        div {
            padding: 5px;
        }
    }
</style>
