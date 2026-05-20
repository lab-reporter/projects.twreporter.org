import type { BarSeries } from '../components/Bar.svelte'

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    stacked?: boolean
    layout?: 'vertical' | 'horizontal'
    bars: (BarSeries & { src?: string; xLabel?: string; yLabel?: string })[]
  }
> = {
  B01: {
    title: '各黨提案數量',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    stacked: true,
    layout: 'horizontal',
    bars: [
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
      },
      {
        name: '志工待遇與福利（環保志工、義警義消、巡守隊）',
        color: 'var(--chart-blue-3)',
        data: [
          { label: '國民黨', value: 152 },
          { label: '民進黨', value: 71 },
          { label: '無黨籍', value: 23 },
          { label: '民眾黨', value: 4 },
          { label: '無黨團結聯盟', value: 4 },
          { label: '新黨', value: 2 },
          { label: '社會民主黨', value: 0 },
        ],
      },
    ],
  },
}
