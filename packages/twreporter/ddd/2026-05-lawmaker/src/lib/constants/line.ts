import type { LineDatum, ResponsiveCount } from '../components/Line.svelte'

export type LineGridItem = {
  label?: string
  data: LineDatum[]
  color?: string
}

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    xTickCount?: ResponsiveCount
    yTickCount?: ResponsiveCount
    xDomain?: [min?: string, max?: string]
    yDomain?: [min?: number, max?: number]
    colorMap?: Record<string, string>
    lines: ({ src?: string; data?: LineDatum[]; xLabel?: string; yLabel?: string; showArea?: boolean })[]
    backdrop?: boolean
    wide?: boolean
  }
> = {
  L01: {
    title: '六都除新北、台北都是執政黨提出較多補助議案',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    backdrop: false,
    xTickCount: 10,
    yTickCount: [10, 5],
    xDomain: ['1988', '1999'],
    yDomain: [0, 15000],
    colorMap: {
      '第一屆': 'var(--chart-olive-3)',
      '第二屆': 'var(--chart-blue-3)',
      '第三屆': 'var(--chart-red-3)',
    },
    lines: [
      {
        showArea: true,
        xLabel: '年分',
        yLabel: '提案數',
        data: [
          { label: '第一屆', date: '1988', "value": 12681 },
          { label: '第一屆', date: '1989', "value": 13264 },
          { label: '第一屆', date: '1990', "value": 13953 },
          { label: '第一屆', date: '1991', "value": 13921 },
          { label: '第二屆', date: '1992', "value": 13932 },
          { label: '第二屆', date: '1993', "value": 13157 },
          { label: '第二屆', date: '1994', "value": 11159 },
          { label: '第二屆', date: '1995', "value": 11631 },
          { label: '第三屆', date: '1996', "value": 12045 },
          { label: '第三屆', date: '1997', "value": 13160 },
          { label: '第三屆', date: '1998', "value": 14240 },
          { label: '第三屆', date: '1999', "value": 14501 },
        ],
      }
    ],
  }
}
