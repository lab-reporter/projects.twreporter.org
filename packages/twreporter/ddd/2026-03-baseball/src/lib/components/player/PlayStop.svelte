<script lang="ts">
    import { getAudioContext } from "svelte-audio-player";
    import { toggle } from "svelte-audio-player/utils";
    import Button from "../Button.svelte";

    const paths = {
        play: "M12.5 7.5L3.00758e-07 15L9.53674e-07 -5.48698e-07L12.5 7.5L12.5 7.5Z",
        stop: "M15 15L-1.60659e-06 15L-9.53674e-07 0L15 0L15 15Z",
    };

    const { paused } = getAudioContext();
</script>

<Button
    onclick={() => toggle(paused)}
    title={$paused ? "Play" : "Stop"}
    --color="var(--primary-color)"
>
    <svg
        width="13"
        height="15"
        viewBox="0 0 13 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g filter="url(#filter0_ii_812_4524)">
            <path
                d={$paused ? paths.play : paths.stop}
                fill="var(--color, currentColor)"
            />
        </g>
        <defs>
            <filter
                id="filter0_ii_812_4524"
                x="0"
                y="-2.5"
                width="14.0566"
                height="20.4707"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="-2.5" />
                <feGaussianBlur stdDeviation="1.5625" />
                <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                />
                <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_812_4524"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="1.5" />
                <feGaussianBlur stdDeviation="1.5625" />
                <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
                />
                <feBlend
                    mode="normal"
                    in2="effect1_innerShadow_812_4524"
                    result="effect2_innerShadow_812_4524"
                />
            </filter>
        </defs>
    </svg>
</Button>

<style>
    path {
        transition: d 0.3s ease;
    }
</style>
