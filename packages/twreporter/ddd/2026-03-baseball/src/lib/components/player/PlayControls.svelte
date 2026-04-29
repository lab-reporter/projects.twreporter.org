<script lang="ts">
    import Reset from "./Reset.svelte";
    import PlayStop from "./PlayStop.svelte";
</script>

<div class="player-control">
    <PlayStop />
    <Reset />
</div>

<style>
    .player-control {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
</style>
