<script lang="ts">
    const { legends }: { legends: { name: string; color: string }[] } =
        $props();
</script>

<div class="legends">
    {#each legends as legend}
        <div class="legend">
            <div class="legend-box" style:--color={legend.color}></div>
            <p class="legend-text">{legend.name}</p>
        </div>
    {/each}
</div>

<style>
    .legends {
        width: 100%;
        height: 25px;
        display: flex;
        flex-wrap: wrap;
        gap: 2.5px 5px;
        align-items: center;
        justify-content: center;
        --size: 10px;
    }

    .legend {
        display: flex;
        gap: 2px;
        align-items: center;
        justify-content: center;
    }

    .legend-box {
        width: var(--size);
        height: var(--size);
        background-color: var(--color);
    }

    .legend-text {
        font-size: calc(var(--size) * (6 / 5));
        white-space: nowrap;
    }
</style>
