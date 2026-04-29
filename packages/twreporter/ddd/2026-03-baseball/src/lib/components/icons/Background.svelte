<img
    src="https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/bg-1-mobile.png?v1"
    alt="background"
    class="mobile"
/>

<img
    src="https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/bg-1-desktop.png?v1"
    alt="background"
    class="desktop"
/>

<style>
    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        transform: scale(1.15);
    }

    .mobile {
        display: none;
    }

    .desktop {
        display: block;
        transform: scale(1.15) translateY(-20px);
    }

    @media (max-width: 550px) {
        .mobile {
            display: block;
            transform: scale(1.15) translateY(-5px);
        }

        .desktop {
            display: none;
        }
    }
</style>
