<div class="player-head"></div>

<style>
    .player-head {
        left: var(--progress);
        position: absolute;
        top: 0;
        bottom: 0;
        width: 8px;
        height: calc(100% + 20px);
        margin-top: -10px;
        background: var(--text-color);
        border-radius: 3px;
        will-change: left;
        box-shadow: var(--inner-shadow);
        transition: left ease 10ms;
    }
</style>
