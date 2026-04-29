<script lang="ts">
    import { getAudioContext } from "svelte-audio-player";
    import PlayControls from "../lib/components/player/PlayControls.svelte";
    import PlayerHead from "../lib/components/player/PlayerHead.svelte";
    import Note from "../lib/components/rhythm/Note.svelte";
    import type {
        TrackConfig,
        TrackStates,
    } from "../lib/constants/interactive-music";
    import { getAudioElementContext } from "../lib/contexts/audio-element";
    import { useAnimationFrameTime } from "../lib/utils/animation-frame-time.svelte";
    // @ts-expect-error: Currently, web-haptics/svelte doesn't have type declaration files.
    import { onDestroy } from "svelte";
    import { createWebHaptics } from "web-haptics/svelte";

    const { trigger, destroy } = createWebHaptics();
    onDestroy(destroy);

    let {
        songTitle,
        states,
        endingPadding,
        repeatPadding,
        active = $bindable(),
    }: {
        songTitle: string;
        states: TrackStates;
        endingPadding: number;
        repeatPadding: number;
        active: TrackConfig;
    } = $props();

    const totalBeats = $derived(
        active?.tracks[0].notes.reduce((acc, item) => acc + item.length, 0) ??
            0,
    );
    const { currentTime, duration, repeat, paused } = getAudioContext();
    repeat.set(true);

    const audioElementRef = getAudioElementContext();
    const smooth = useAnimationFrameTime(currentTime, paused, audioElementRef);
    onDestroy(smooth.destroy);

    let playerProgress = $derived(
        $duration > 0
            ? Math.min(smooth.currentTime / ($duration - endingPadding), 1)
            : 0,
    );

    $effect(() => {
        if (smooth.currentTime > $duration - endingPadding + repeatPadding) {
            currentTime.set(0);
        }
    });

    const instruments = $derived(
        active?.tracks.map((instrument) => ({
            ...instrument,
            notes: instrument.notes.reduce(
                (acc, { length, rest, text, swing }, i) => {
                    return [
                        ...acc,
                        {
                            sum: (acc[i - 1]?.sum ?? 0) + (length ?? 0),
                            rest,
                            note: 8 / length,
                            length,
                            text,
                            swing,
                        },
                    ];
                },
                [] as {
                    sum: number;
                    rest?: boolean;
                    note: number;
                    length: number;
                    text?: string;
                    swing?: true;
                }[],
            ),
        })),
    );
</script>

<div class="container">
    <div class="player">
        <div class="instruments">
            {#each instruments as { name }}
                <div class="instrument">
                    <p>{name}</p>
                </div>
            {/each}
        </div>
        <div
            class="tracks"
            style:--background-size-frac={`${(100 / totalBeats) * 2}%`}
        >
            {#each instruments as { notes, style }}
                <div class="notes" style:--total-beats={totalBeats}>
                    {#each notes as { sum, note, rest, length, text, swing }}
                        <Note
                            active={playerProgress >
                                (sum - length) / totalBeats}
                            {rest}
                            {note}
                            {text}
                            {style}
                            {swing}
                        />
                    {/each}
                </div>
            {/each}
            <PlayerHead --progress={`${playerProgress * 100}%`}></PlayerHead>
        </div>
    </div>
</div>

<div class="controls">
    <PlayControls />
    <div class="state-control">
        <button
            onclick={() => {
                trigger();
                active = states.default;
            }}
            class:active={active.name == states.default.name}
            ><span>{states.default.name}</span></button
        >
        <button
            onclick={() => {
                trigger();
                active = states.alternative;
            }}
            class:active={active.name == states.alternative.name}
            ><span>{states.alternative.name}</span></button
        >
    </div>
</div>

<style>
    .container {
        display: flex;
        align-items: stretch;
        gap: 10px;
    }

    .player {
        display: flex;
        gap: 9px;
        position: relative;
        width: 100%;
    }

    .instruments {
        display: flex;
        flex-direction: column;
        gap: 9px;
        width: 80px;
    }

    @media (max-width: 550px) {
        .instruments {
            width: 30px;
        }
    }

    .instrument {
        flex-shrink: 0;
        width: 100%;
        height: 40px;
        background: var(--track-background);
        box-shadow: var(--inner-shadow);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        overflow: hidden;
    }

    @media (max-width: 550px) {
        .instrument {
            height: 50px;
            padding: 5px 8px;
        }
    }

    .instrument p {
        font-weight: bold;
        font-size: 16px;
        color: var(--text-color);
        width: 100%;
        text-align: center;
    }

    .tracks {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 9px;
        position: relative;
    }

    .notes {
        flex: 1;
        height: 40px;
        background: var(--background-muted);
        background-image: linear-gradient(
            to right,
            var(--background-color) 2px,
            transparent 2px
        );
        background-size: calc(var(--background-size-frac, 12.5%) - 5px) 100%;
        background-position: left 29.6px top 0;
        padding: 0px 20px;
        border-radius: 10px;
        display: grid;
        grid-template-columns: repeat(var(--total-beats, 8), 1fr);
        align-items: center;
        justify-items: start;
        min-width: 0;
        box-shadow: var(--inner-shadow);
    }

    .controls {
        padding: 5px 0 15px;
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
    }

    .state-control {
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: var(--rounded-full);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
    }

    .state-control button {
        color: var(--primary-color);
        font-size: 15px;
        cursor: pointer;
        padding: 0 15px;
        border-radius: var(--rounded-full);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 100%;

        &:hover {
            color: var(--primary-color);
        }
    }

    .state-control button span {
        font-weight: 500;
        background-color: var(--primary-color);

        color: transparent;

        -webkit-background-clip: text;
        background-clip: text;
        padding-bottom: 1px;

        text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.1);
    }

    .state-control button.active {
        background: white;
        color: var(--primary-color);
        box-shadow: var(--inner-shadow);
    }
</style>
