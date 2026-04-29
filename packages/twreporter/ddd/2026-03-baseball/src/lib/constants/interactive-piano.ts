import type { GraphicConfig } from "../components/layout/types";

/**
 * Pitch value within a score's track range.
 * 1=C, 2=C#, 3=D, 4=D#, 5=E, 6=F, 7=F#, 8=G, 9=G#, 10=A, 11=A#, 12=B
 * 13=C', 14=C#', ... (continues for higher octaves)
 * 0=B(below), -1=A#(below), ... (continues for lower octaves)
 */
export type Pitch = number;

export type PianoNoteInput = {
  pitch?: Pitch;
  duration: number;
  rest?: boolean;
  text?: string;
};

export type PianoSegment = {
  notes: PianoNoteInput[];
  name?: string;
};

export type PianoScoreConfig = {
  name: string;
  src: string;
  image: string;
  endingPadding: number;
  repeatPadding: number;
  /** [minPitch, maxPitch] defining the visible range of the piano roll grid */
  trackRange: [number, number];
  segments: PianoSegment[];
};

export type PianoNote = {
  pitch?: Pitch;
  start: number;
  duration: number;
  rest?: boolean;
  /** Index of the segment this note belongs to */
  segment: number;
  text?: string;
};

/** Maps any pitch value to a 0-11 semitone index within an octave (for piano key highlighting). */
export function pitchToSemitone(pitch: number): number {
  return (((pitch - 1) % 12) + 12) % 12;
}

export const keys: Record<
  string,
  GraphicConfig & {
    scores: PianoScoreConfig[];
  }
> = {
  A01: {
    title: "國家隊版本〈台灣尚勇〉",
    subtitle: "前奏節錄",
    scores: [
      {
        name: "〈台灣尚勇〉",
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/A01/01.mp3",
        image:
          "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/A01/01.svg",
        endingPadding: 0,
        repeatPadding: 0,
        trackRange: [1, 13],
        segments: [
          {
            notes: [
              { pitch: 2, duration: 2 },
              { pitch: 5, duration: 1 },
              { pitch: 2, duration: 1 },
              { pitch: 9, duration: 3 },
              { pitch: 9, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 9, duration: 1 },
              { pitch: 7, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 9, duration: 4 },
              { pitch: 7, duration: 2 },
              { pitch: 9, duration: 1 },
              { pitch: 7, duration: 1 },
              { pitch: 5, duration: 2 },
              { pitch: 7, duration: 1 },
              { pitch: 5, duration: 1 },
              { pitch: 4, duration: 4 },
              { pitch: 6, duration: 2, rest: true, text: "台" },
              { pitch: 6, duration: 2, rest: true, text: "灣" },
            ],
          },
        ],
      },
    ],
  },
  A03: {
    title: "棒球應援曲使用\n音階的急升帶動氣氛",
    subtitle: "台鋼雄鷹嗆司曲〈氣蓋山河〉",
    scores: [
      {
        name: "〈氣蓋山河〉",
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/A03/01.mp3",
        image:
          "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/A03/01.svg",
        endingPadding: 0,
        repeatPadding: 0,
        trackRange: [-4, 10],
        segments: [
          {
            notes: [
              { pitch: -2, duration: 2, text: "台" },
              { pitch: 5, duration: 1, text: "鋼" },
              { pitch: 5, duration: 1, text: "的" },
              { pitch: 8, duration: 2, text: "鷹" },
              { pitch: 5, duration: 2, text: "雄" },
              { pitch: 3, duration: 2, text: "攻" },
              { pitch: 1, duration: 1, text: "無" },
              { pitch: 3, duration: 1, text: "不" },
              { pitch: 5, duration: 4, text: "克" },
            ],
          },
        ],
      },
    ],
  },
  A05: {
    title: "棒球應援曲利用短「樂句」\n呼應棒球場上節奏",
    subtitle: "〈Team Taiwan〉與流行樂〈黃昏的故鄉〉對比",
    scores: [
      {
        name: "〈Team Taiwan〉",
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/A05/01.mp3?1",
        image:
          "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/A05/01.svg",
        endingPadding: 0,
        repeatPadding: 0,
        trackRange: [-2, 14],
        segments: [
          {
            name: "段落一",
            notes: [
              { pitch: 6, duration: 1 },
              { pitch: 5, duration: 1 },
              { pitch: 3, duration: 1.5 },
              { pitch: 5, duration: 1.5 },
              { pitch: 6, duration: 1 },
              { pitch: 8, duration: 2 },
              { pitch: 6, duration: 1 },
              { pitch: 13, duration: 1 },
              { pitch: 10, duration: 1.5 },
              { pitch: 8, duration: 0.5 },
              { pitch: 6, duration: 1 },
              { pitch: 5, duration: 1 },
              { pitch: 3, duration: 2 },
            ],
          },
          {
            name: "段落二",
            notes: [
              { pitch: 3, duration: 1 },
              { pitch: 1, duration: 1 },
              { pitch: -1, duration: 1.5 },
              { pitch: 1, duration: 1.5 },
              { pitch: 3, duration: 1 },
              { pitch: 1, duration: 2 },
              { pitch: 3, duration: 1 },
              { pitch: 5, duration: 1 },
              { pitch: 5, duration: 1.5 },
              { pitch: 6, duration: 1.5 },
              { pitch: 8, duration: 1 },
              { pitch: 10, duration: 2 },
            ],
          },
        ],
      },
      {
        name: "〈曾經瘋狂〉",
        src: "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/audios/A05/02.mp3?1",
        image:
          "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/A05/05.svg",
        endingPadding: 0,
        repeatPadding: 0,
        trackRange: [2, 18],
        segments: [
          {
            name: "段落一",
            notes: [
              { pitch: 5, duration: 1 },
              { pitch: 5, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 15, duration: 1 },
              { pitch: 15, duration: 1 },
              { pitch: 14, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 14, duration: 1 },
              { pitch: 17, duration: 2 },
              { pitch: 17, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 15, duration: 1 },
              { pitch: 15, duration: 1 },
              { pitch: 14, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 10, duration: 1 },
              { pitch: 12, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 17, duration: 1 },
              { pitch: 14, duration: 3 },
            ],
          },
        ],
      },
    ],
  },
};
