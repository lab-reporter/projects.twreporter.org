import type { BarSeries, BarDatum, ResponsiveCount } from '../components/Bar.svelte'

export type BarGridItem = {
  label?: string
  data: BarDatum[]
  color?: string
}

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    stacked?: boolean
    layout?: 'vertical' | 'horizontal'
    yDomain?: [min?: number, max?: number]
    yTickCount?: ResponsiveCount
    colorMap?: Record<string, string>
    bars: (BarSeries & { src?: string; xLabel?: string; yLabel?: string })[]
  }
> = {
  B01: {
    title: '國民黨「支持者導向」策略：六都議員「鄰里長補助與義警消福利」提案人次遠高其他政黨',
    footnotes: [
      '註：僅統計本屆議員提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    stacked: true,
    layout: 'horizontal',
    yDomain: [0, 500],
    yTickCount: [10, 5],
    bars: [
      {
        name: '鄰里（長）補助',
        color: 'var(--chart-olive-3)',
        xLabel: '政黨',
        yLabel: '提案議員人次',
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
  B02: {
    title: '六都議員人均提案量隨資歷降低',
    footnotes: [
      '註1：資歷9、10屆議員僅各有一人',
      '註2：僅統計本屆議員提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    stacked: false,
    layout: 'vertical',
    yDomain: [0, 200],
    yTickCount: 10,
    colorMap: {
      '9': 'var(--neutral-gray-400)',
      '10': 'var(--neutral-gray-400)',
    },
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

export const gridKeys: Record<
  string,
  {
    title: string
    footnotes: string[]
    gridColumns?: number
    layout?: 'vertical' | 'horizontal'
    yDomain?: [min?: number, max?: number]
    yTickCount?: ResponsiveCount
    ratio?: number
    xLabel?: string
    yLabel?: string
    colorMap?: Record<string, string>
    items: BarGridItem[]
  }
> = {
  BG01: {
    title: '六都各黨議員提案數量',
    footnotes: [
      '註：僅統計本屆議員提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    gridColumns: 2,
    layout: 'horizontal',
    yDomain: [0],
    yTickCount: 4,
    ratio: 1.4,
    colorMap: {
      '國民黨': 'var(--chart-blue-3)',
      '民進黨': 'var(--chart-olive-3)',
      '無黨籍': 'var(--chart-gray-3)',
      '民眾黨': 'var(--chart-mint-3)',
      '新黨': 'var(--chart-earth-3)',
      '社會民主黨': 'var(--chart-indigo-3)',
      '無黨團結聯盟': 'var(--chart-purple-3)',
      '台灣基進': 'var(--chart-red-3)',
      '台聯': 'var(--chart-gray-3)',
    },
    items: [
      {
        label: '台北市',
        data: [
          { label: '國民黨', value: 101 },
          { label: '民進黨', value: 101 },
          { label: '無黨籍', value: 101 },
          { label: '民眾黨', value: 90 },
          { label: '新黨', value: 57 },
          { label: '社會民主黨', value: 22 },
        ],
      },
      {
        label: '新北市',
        data: [
          { label: '民進黨', value: 386 },
          { label: '國民黨', value: 291 },
          { label: '無黨籍', value: 55 },
          { label: '無黨團結聯盟', value: 32 },
          { label: '民眾黨', value: 5 },
        ],
      },
      {
        label: '桃園市',
        data: [
          { label: '國民黨', value: 326 },
          { label: '民進黨', value: 282 },
          { label: '無黨籍', value: 39 },
        ],
      },
      {
        label: '台中市',
        data: [
          { label: '國民黨', value: 175 },
          { label: '民進黨', value: 174 },
          { label: '無黨籍', value: 68 },
          { label: '民眾黨', value: 52 },
        ],
      },
      {
        label: '高雄市',
        data: [
          { label: '民進黨', value: 166 },
          { label: '國民黨', value: 98 },
          { label: '台灣基進', value: 26 },
          { label: '無黨籍', value: 22 },
          { label: '無黨團結聯盟', value: 4 },
        ],
      },
      {
        label: '台南市',
        data: [
          { label: '民進黨', value: 308 },
          { label: '無黨籍', value: 137 },
          { label: '國民黨', value: 134 },
          { label: '無黨團結聯盟', value: 43 },
          { label: '台聯', value: 8 },
        ],
      },
    ],
  },
}