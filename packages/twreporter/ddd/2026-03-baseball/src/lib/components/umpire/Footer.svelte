<script lang="ts">
    const footnotes = [
        "註1：本圖為主審視角，由本壘板後方看向投手",
        "註2：本表統計2020～2025年間MLB判決球數前10名的主審",
        "資料來源：MLB Statcast逐球數據 ｜ 資料整理：林奕甫 ｜ 設計：江世民",
    ];
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
        margin-top: 10px;
        --footer-scale: 1;
        --footer-logo-scale: 1.25;
    }

    @media (min-width: 500px) {
        .footer {
            padding: 15px 0 10px 0;
            --footer-logo-scale: 2;
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
        color: #9c9c9c;
        font-size: 10px;
    }

    .footer .logo {
        width: calc(14.5px * var(--footer-logo-scale));
        height: calc(15.5px * var(--footer-logo-scale));
    }
</style>
