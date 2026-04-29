<script lang="ts">
    const { title }: { title: string } = $props();
</script>

{#snippet icon()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="24"
        viewBox="0 0 14 24"
        fill="none"
    >
        <ellipse
            cx="6.39391"
            cy="17.6062"
            rx="6"
            ry="5"
            transform="rotate(4.75568 6.39391 17.6062)"
            fill="currentColor"
        />
        <rect
            x="11.873"
            width="2"
            height="18"
            transform="rotate(4.75568 11.873 0)"
            fill="currentColor"
        />
    </svg>
{/snippet}

<h2>
    {@render icon()}
    {title}
</h2>

<style>
    h2 {
        font-size: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
</style>
