<script>
    import { getAudioContext } from "svelte-audio-player";
    import Button from "../Button.svelte";

    const { currentTime, paused } = getAudioContext();
</script>

<Button
    onclick={() => {
        paused.set(true);
        currentTime.set(0);
    }}
    title="Reset"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="15"
        viewBox="0 0 22 15"
        fill="none"
    >
        <g filter="url(#filter0_i_787_6021)">
            <path
                d="M10.9292 8.3575C10.2818 7.96909 10.2818 7.03091 10.9292 6.64251L20.4855 0.908701C21.152 0.508786 22 0.988901 22 1.7662L22 13.2338C22 14.0111 21.152 14.4912 20.4855 14.0913L10.9292 8.3575Z"
                fill="#BBBBBB"
            />
            <path
                d="M1.42915 8.3575C0.781815 7.96909 0.781817 7.03091 1.42916 6.64251L10.9855 0.908701C11.652 0.508786 12.5 0.988901 12.5 1.7662L12.5 13.2338C12.5 14.0111 11.652 14.4912 10.9855 14.0913L1.42915 8.3575Z"
                fill="#BBBBBB"
            />
        </g>
        <defs>
            <filter
                id="filter0_i_787_6021"
                x="0.943359"
                y="0.764651"
                width="22.0566"
                height="14.4707"
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
                <feOffset dx="1" dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_787_6021"
                />
            </filter>
        </defs>
    </svg>
</Button>

<style>
    svg {
        margin-right: 5px;
        margin-left: 2px;
    }

    path {
        box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.25) inset;
    }
</style>
