import type { BarSeries, BarDatum, ResponsiveCount } from '../components/Bar.svelte'

export type BarGridItem = {
  label?: string
  data: BarDatum[]
  color?: string
  // Per-chart overrides (fall back to the grid-level value)
  ratio?: ResponsiveCount
  yLabel?: string
  yDomain?: [min?: number, max?: number]
  yTickCount?: ResponsiveCount
  xLabel?: string
  xDomain?: [min?: string, max?: string]
  xTickCount?: ResponsiveCount
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
    xDate?: boolean
    xTickCount?: ResponsiveCount
    xFormat?: string
    colorMap?: Record<string, string>
    bars: (BarSeries & { src?: string; xLabel?: string; yLabel?: string })[]
  }
> = {
  B01: {
    title: '國民黨「支持者導向」策略：六都議員「鄰里長補助與義警消福利」提案人次遠高其他政黨',
    footnotes: [
      '註：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
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
    title: '六都議員人均分配型提案隨資歷降低',
    footnotes: [
      '註1：資歷9、10屆議員僅各有一人，分別為台中市國民黨籍議員張瀞分，與台北市無黨籍議員陳政忠',
      '註2：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
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
    xDate?: boolean
    xTickCount?: ResponsiveCount
    xFormat?: string
    ratio?: ResponsiveCount
    xLabel?: string
    yLabel?: string
    colorMap?: Record<string, string>
    groupLegend?: boolean
    items: BarGridItem[]
  }
> = {
  BG01: {
    title: '六都各黨議員分配型提案數量',
    footnotes: [
      '註：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
    ],
    gridColumns: 2,
    layout: 'horizontal',
    yDomain: [0],
    yTickCount: 4,
    ratio: 1.4,
    colorMap: {
      國民黨: 'var(--chart-blue-3)',
      民進黨: 'var(--chart-olive-3)',
      無黨籍: 'var(--chart-gray-3)',
      民眾黨: 'var(--chart-mint-3)',
      新黨: 'var(--chart-earth-3)',
      社會民主黨: 'var(--chart-indigo-3)',
      無黨團結聯盟: 'var(--chart-purple-3)',
      台灣基進: 'var(--chart-red-3)',
      台聯: 'var(--chart-gray-3)',
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
  BG02: {
    title: '傅崐萁夫婦執政至今，\n蘇色萍家族企業標案金額屢創新高',
    footnotes: [
      '註：本表取2010至2025年傅崐萁夫婦任花蓮縣長期間，花蓮縣府及一級子機關之決標案件。2018年9月13日至12月25日，傅崐萁遭判刑解職，由顏新章、蔡碧仲代理縣長',
      '資料來源：台灣採購公報網',
      '資料整理：簡毅慧　｜　設計：江世民',
    ],
    gridColumns: 1,
    layout: 'vertical',
    groupLegend: true,
    yDomain: [0],
    yTickCount: 4,
    ratio: [1.8, 1],
    xDate: true,
    xTickCount: [8, 4],
    xFormat: '%Y',
    colorMap: {
      傅崐萁執政: 'var(--chart-blue-3)',
      徐榛蔚執政: 'var(--chart-blue-4)',
    },
    items: [
      {
        label: '蘇家標案數',
        yLabel: '提案數（件）',
        yTickCount: 10,
        xTickCount: [5, 5],
        data: [
          { label: '2010', value: 29, category: '傅崐萁執政' },
          { label: '2011', value: 23, category: '傅崐萁執政' },
          { label: '2012', value: 27, category: '傅崐萁執政' },
          { label: '2013', value: 45, category: '傅崐萁執政' },
          { label: '2014', value: 36, category: '傅崐萁執政' },
          { label: '2015', value: 42, category: '傅崐萁執政' },
          { label: '2016', value: 37, category: '傅崐萁執政' },
          { label: '2017', value: 32, category: '傅崐萁執政' },
          { label: '2018', value: 35, category: '傅崐萁執政' },
          { label: '2019', value: 29, category: '徐榛蔚執政' },
          { label: '2020', value: 39, category: '徐榛蔚執政' },
          { label: '2021', value: 32, category: '徐榛蔚執政' },
          { label: '2022', value: 35, category: '徐榛蔚執政' },
          { label: '2023', value: 31, category: '徐榛蔚執政' },
          { label: '2024', value: 24, category: '徐榛蔚執政' },
          { label: '2025', value: 29, category: '徐榛蔚執政' },
        ],
      },
      {
        label: '蘇家標案金額',
        yLabel: '金額（新台幣億元）',
        yDomain: [0, 8],
        yTickCount: 8,
        xTickCount: [5, 5],
        data: [
          { label: '2010', value: 0.96389000, category: '傅崐萁執政' },
          { label: '2011', value: 1.46190000, category: '傅崐萁執政' },
          { label: '2012', value: 1.09925000, category: '傅崐萁執政' },
          { label: '2013', value: 1.54593000, category: '傅崐萁執政' },
          { label: '2014', value: 0.86098000, category: '傅崐萁執政' },
          { label: '2015', value: 1.13301228, category: '傅崐萁執政' },
          { label: '2016', value: 1.92628000, category: '傅崐萁執政' },
          { label: '2017', value: 1.68238053, category: '傅崐萁執政' },
          { label: '2018', value: 3.36449842, category: '傅崐萁執政' },
          { label: '2019', value: 3.99886511, category: '徐榛蔚執政' },
          { label: '2020', value: 2.52601161, category: '徐榛蔚執政' },
          { label: '2021', value: 3.59148529, category: '徐榛蔚執政' },
          { label: '2022', value: 2.80302906, category: '徐榛蔚執政' },
          { label: '2023', value: 4.07945535, category: '徐榛蔚執政' },
          { label: '2024', value: 5.30636110, category: '徐榛蔚執政' },
          { label: '2025', value: 7.34266231, category: '徐榛蔚執政' },
        ],
      },
    ],
  },
}
