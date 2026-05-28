import type { LineSeries, LineDatum } from '../components/Line.svelte'

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
    yTickCount?: number
    yTickCountMobile?: number
    yMin?: number
    yMax?: number
    colorMap?: Record<string, string>
    lines: (LineSeries & { src?: string; xLabel?: string; yLabel?: string })[]
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
    yTickCount: 10,
    yTickCountMobile: 5,
    yMin: 0,
    yMax: 500,
    lines: [
      {
        name: '鄰里（長）補助',
        color: 'var(--chart-olive-3)',
        xLabel: '政黨',
        yLabel: '提案數',
        data: [
          { label: '國民黨', value: 288 },
          { label: '民進黨', value: 219 },
          { label: '無黨籍', value: 34 },
          { label: '民眾黨', value: 16 },
          { label: '新黨', value: 3 },
          { label: '無黨團結聯盟', value: 2 },
          { label: '社會民主黨', value: 1 },
        ],
      }
    ],
  }
}
