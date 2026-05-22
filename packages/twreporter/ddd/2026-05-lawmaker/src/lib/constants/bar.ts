import type { BarSeries } from '../components/Bar.svelte'

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    stacked?: boolean
    layout?: 'vertical' | 'horizontal'
    yTickCount?: number
    yTickCountMobile?: number
    yMin?: number
    yMax?: number
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
    yTickCount: 10,
    yTickCountMobile: 5,
    yMin: 0,
    yMax: 500,
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
  B03: {
    title: '六都議員人均提案量隨資歷降低',
    footnotes: [
      '註：資歷9、10屆議員僅各有一人',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    stacked: false,
    layout: 'vertical',
    yTickCount: 10,
    yMin: 0,
    yMax: 200,
    bars: [
      {
        color: 'var(--chart-olive-3)',
        xLabel: '資歷（年）',
        yLabel: '人均案量',
        data: [
          { label: '1', value: 188.2 },
          { label: '2', value: 175.7 },
          { label: '3', value: 153.1 },
          { label: '4', value: 129.4 },
          { label: '5', value: 117.7 },
          { label: '6', value: 113.9 },
          { label: '7', value: 77 },
          { label: '8', value: 79.7 },
          { label: '9', value: 192 },
          { label: '10', value: 106 },
        ],
      }
    ],
  },
}
