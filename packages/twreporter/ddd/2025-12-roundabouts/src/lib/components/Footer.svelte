<script lang="ts">
    const { footnotes }: { footnotes: string[] } = $props();
</script>

<div class="footer">
    <div class="footnotes">
        {#each footnotes as footnote}
            <p>{footnote}</p>
        {/each}
    </div>
    <img
        src="https://projects.twreporter.org/twreporter/ddd/2025-12-roundabouts/assets/logo-black.png"
        class="logo"
        alt="報導者 The Reporter"
    />
</div>

<style>
    .footer {
        padding: 10px 0 10px 0;
        display: flex;
        align-items: end;
        justify-content: space-between;
    }

    @media (min-width: 500px) {
        .footer {
            padding: 15px 0 10px 0;
        }
    }

    .footnotes {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    @media (min-width: 500px) {
        .footnotes {
            gap: 5px;
        }
    }

    .footer p {
        color: #acacac;
        font-size: calc(10px * var(--footer-scale));
    }

    .footer .logo {
        width: calc(14.5px * var(--footer-logo-scale));
        height: calc(15.5px * var(--footer-logo-scale));
    }
</style>
