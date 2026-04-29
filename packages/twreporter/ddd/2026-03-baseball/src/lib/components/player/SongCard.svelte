<script lang="ts">
    import type { Snippet } from "svelte";

    let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div class="song-card">
    <div class="song-card-header">
        <div class="song-dot"></div>
        <p class="song-title">{title}</p>
    </div>
    <div class="song-card-content">
        {@render children()}
    </div>
</div>

<style>
    .song-card {
        width: 130px;
        background: white;
        border-radius: 5px;
        padding: 0px 5px 5px;
        display: flex;
        flex-direction: column;
    }

    @media (max-width: 700px) {
        .song-card {
            display: none;
        }
    }

    .song-card-header {
        background: white;
        padding: 5px 0;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .song-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--blue-primary);
        flex-shrink: 0;
    }

    .song-title {
        font-size: 11px;
        color: var(--black-900);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .song-card-content {
        background: var(--background);
        padding: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        box-shadow: inset 0 5px 10px rgba(202, 197, 187, 0.5);
        flex-grow: 1;
    }
</style>
