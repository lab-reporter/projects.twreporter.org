<script lang="ts">
    import { getAudioContext } from "svelte-audio-player";
    import {
        pitchToSemitone,
        type PianoNote,
        type PianoScoreConfig,
    } from "../../constants/interactive-piano";
    import PlayControls from "../player/PlayControls.svelte";
    import PlayerHead from "../player/PlayerHead.svelte";
    import SongTitle from "../player/SongTitle.svelte";
    import OutlineText from "../typography/OutlineText.svelte";
    import { getAudioElementContext } from "../../contexts/audio-element";
    import { useAnimationFrameTime } from "../../utils/animation-frame-time.svelte";
    import { onDestroy } from "svelte";

    const { score }: { score: PianoScoreConfig } = $props();

    const totalSemis = $derived(score.trackRange[1] - score.trackRange[0] + 1);

    const totalBeats = $derived(
        score.segments.reduce(
            (sum, seg) => sum + seg.notes.reduce((s, n) => s + n.duration, 0),
            0,
        ),
    );

    const { currentTime, duration, paused } = getAudioContext();

    const audioElementRef = getAudioElementContext();
    const smooth = useAnimationFrameTime(currentTime, paused, audioElementRef);
    onDestroy(smooth.destroy);

    let playerProgress = $derived(
        $duration > 0
            ? Math.min(smooth.currentTime / ($duration - score.endingPadding), 1)
            : 0,
    );

    let currentBeat = $derived(playerProgress * totalBeats);

    $effect(() => {
        // Reset player after audio finished.
        if (playerProgress === 1) {
            paused.set(true);
            currentTime.set(0);
        }
    });

    const segmentRanges = $derived.by(() => {
        let cursor = 0;
        return score.segments.map((seg) => {
            const start = cursor;
            const beats = seg.notes.reduce((sum, n) => sum + n.duration, 0);
            cursor += beats;
            return { start, beats };
        });
    });

    const segmentNotes: PianoNote[][] = $derived(
        score.segments.map((seg, segIdx) => {
            let cursor = segmentRanges[segIdx].start;
            const notes: PianoNote[] = [];
            for (const { pitch, duration, rest, text } of seg.notes) {
                notes.push({
                    start: cursor,
                    pitch,
                    duration,
                    rest,
                    segment: segIdx,
                    text,
                });
                cursor += duration;
            }
            return notes;
        }),
    );

    const allNotes = $derived(segmentNotes.flat());

    let activeNote = $derived(
        allNotes.find(
            (n) =>
                !n.rest &&
                currentBeat >= n.start &&
                currentBeat < n.start + n.duration,
        ),
    );

    let activeSegment = $derived(activeNote?.segment ?? -1);

    /**
     * Black key semitone indices and the white key index they sit below.
     *
     * White keys are ordered top-to-bottom: B(0) A(1) G(2) F(3) E(4) D(5) C(6).
     * A black key centered on the boundary below white key `wk` means its
     * center is at: (wk + 1) * keyHeight + wk * gap, where
     *   keyHeight = (100% - 6 * 3px) / 7
     *   gap = 3px
     */
    const BLACK_KEYS = [
        { semitone: 10, whiteKeyAbove: 0 },
        { semitone: 8, whiteKeyAbove: 1 },
        { semitone: 6, whiteKeyAbove: 2 },
        { semitone: 3, whiteKeyAbove: 4 },
        { semitone: 1, whiteKeyAbove: 5 },
    ] as const;

    const BLACK_KEY_HEIGHT = 23;

    /** White key semitone indices, top-to-bottom: B, A, G, F, E, D, C */
    const WHITE_KEY_SEMITONES = [11, 9, 7, 5, 4, 2, 0] as const;
</script>

<div class="title">
    <SongTitle title={score.name} />
</div>

<div class="container">
    <div class="piano-keys">
        <div class="white-keys">
            {#each WHITE_KEY_SEMITONES as semitone}
                <div
                    class="key white-key"
                    class:active={activeNote?.pitch != null &&
                        pitchToSemitone(activeNote.pitch) === semitone}
                ></div>
            {/each}
        </div>
        <div class="black-keys-layer">
            {#each BLACK_KEYS as { semitone, whiteKeyAbove }}
                {@const wk = whiteKeyAbove}
                <div
                    class="key black-key"
                    class:active={activeNote?.pitch != null &&
                        pitchToSemitone(activeNote.pitch) === semitone}
                    style:top={`calc(${wk + 1} * (100% - 18px) / 7 + ${wk} * 3px + 1.5px - ${BLACK_KEY_HEIGHT / 2}px)`}
                    style:height={`${BLACK_KEY_HEIGHT}px`}
                ></div>
            {/each}
        </div>
    </div>

    <div class="piano-roll">
        {#each segmentRanges as range, segIdx}
            {@const segMeasures = Math.floor(range.beats / 4)}
            {@const notes = segmentNotes[segIdx]}
            {@const segment = score.segments[segIdx]}
            {@const inSegment =
                currentBeat >= range.start &&
                currentBeat < range.start + range.beats}
            <div
                class="segment"
                class:dimmed={activeSegment !== -1 && segIdx !== activeSegment}
                style:flex={range.beats}
                class:with-name={Boolean(segment.name)}
            >
                {#if Boolean(segment.name)}
                    <div class="segment-name"><span>{segment.name}</span></div>
                {/if}
                <div class="rows">
                    {#each Array(totalSemis) as _, i}
                        <div
                            class="row"
                            class:row-even={i % 2 === 0}
                            class:row-odd={i % 2 !== 0}
                        ></div>
                    {/each}
                </div>

                <div class="grid-lines">
                    {#each Array(segMeasures) as _, i}
                        <div
                            class="measure-line"
                            style:left={`${(((i + 1) * 4) / range.beats) * 100}%`}
                        ></div>
                    {/each}
                </div>

                <div class="note-bars">
                    {#each notes as note}
                        <div
                            class="note-bar"
                            class:rest={note.rest}
                            class:active={activeNote === note}
                            style:left={`${((note.start - range.start) / range.beats) * 100}%`}
                            style:width={`${(note.duration / range.beats) * 100}%`}
                            style:top={`${((score.trackRange[1] - (note.pitch ?? score.trackRange[0])) / totalSemis) * 100}%`}
                            style:height={`${(1 / totalSemis) * 100}%`}
                        >
                            <OutlineText text={note.text} />
                        </div>
                    {/each}
                </div>

                {#if inSegment}
                    <PlayerHead
                        --progress={`${((currentBeat - range.start) / range.beats) * 100}%`}
                    ></PlayerHead>
                {/if}
            </div>
        {/each}
    </div>
</div>

<div class="controls">
    <PlayControls />
</div>

<style>
    .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: end;
        margin-top: -60px;
    }

    .container {
        display: flex;
        align-items: stretch;
        gap: 10px;
        min-height: 235px;
        margin-top: 30px;
    }

    .container:has(.segment-name) {
        margin-top: 40px;
    }

    @media (max-width: 550px) {
        .title {
            justify-content: start;
            margin-top: unset;
        }

        .container {
            margin-top: 20px;
        }

        .container:has(.segment-name) {
            margin-top: 30px;
        }
    }

    .piano-keys {
        position: relative;
        width: 105px;
        flex-shrink: 0;
        border-radius: 5px;
        overflow: hidden;
    }

    @media (max-width: 700px) {
        .piano-keys {
            width: 50px;
        }
    }

    .white-keys {
        display: flex;
        flex-direction: column;
        gap: 3px;
        height: 100%;
    }

    .key {
        transition: background 0.15s ease;
        box-shadow: var(--inner-shadow);
    }

    .key.active {
        background: var(--red-primary);
    }

    .white-key {
        flex: 1 0 0;
        min-height: 1px;
        background: var(--track-background);
        border-radius: 0 5px 5px 0;
    }

    .black-keys-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        pointer-events: none;
    }

    .black-key {
        position: absolute;
        left: 0;
        width: 100%;
        background: var(--black-900);
        border-radius: 0 3px 3px 0;
    }

    .piano-roll {
        display: flex;
        gap: 4px;
        flex-grow: 1;
    }

    .segment {
        position: relative;
        flex-shrink: 0;
        transition: opacity 0.15s ease;
    }

    .segment.with-name {
        margin-top: 10px;
    }

    .segment-name {
        position: absolute;
        width: 100%;
        height: 30px;
        top: -30px;
        border-radius: 5px 5px 0 0;
        background: rgba(255, 255, 255, 0.5);
        box-shadow: 2px 2px 4px 0 rgba(255, 255, 255, 0.25) inset;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .segment-name span {
        font-weight: 500;
        background-color: var(--outline-color);

        color: transparent;

        -webkit-background-clip: text;
        background-clip: text;

        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
    }

    .segment.dimmed {
        opacity: 0.3;
    }

    .rows {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .row {
        flex: 1 0 0;
        min-height: 1px;
    }

    .row-even {
        background: rgba(255, 255, 255, 0.3);
    }

    .row-odd {
        background: rgba(255, 255, 255, 0.8);
    }

    .grid-lines {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .measure-line {
        position: absolute;
        top: 0;
        height: 100%;
        width: 2px;
        background: var(--background-color);
    }

    .note-bars {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .note-bar {
        position: absolute;
        background: var(--note-bar-color);
        transition: background 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        box-shadow: var(--inner-shadow-heavy);
    }

    .note-bar.active {
        background: var(--primary-color);
    }

    .note-bar.rest {
        color: var(--black-800);
        background: transparent;
        box-shadow: none;
    }

    .controls {
        margin-top: 20px;
    }
</style>
