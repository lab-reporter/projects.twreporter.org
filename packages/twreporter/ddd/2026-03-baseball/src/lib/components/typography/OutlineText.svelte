<script lang="ts">
    const { text }: { text?: string } = $props();
</script>

<p data-text={text}>{text}</p>

<style>
    p {
        position: var(--position, absolute);
        color: #f2f1ed;
        top: var(--top, -30px);
        font-weight: 900;
        font-size: 20px;
        text-align: center;
        z-index: 0;
        filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.25));
        -webkit-text-stroke: 6px var(--outline-color);
    }

    p::before {
        position: absolute;
        top: 0;
        left: 0;
        content: attr(data-text);
        color: var(--background-color);
        -webkit-text-stroke: 0;
    }

    @media (max-width: 550px) {
        p {
            top: -25px;
            font-size: 16px;

            -webkit-text-stroke: 5px var(--outline-color);
        }
    }
</style>
