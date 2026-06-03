import type { Color } from '../wordcloud'

export type ScaleAlgorithm = 'linear' | 'sqrt'

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    algo?: ScaleAlgorithm
    clouds: {
      name: string
      src: string
      note?: string
      labelColor: string
      textColor?: Partial<Color>
    }[]
  }
> = {
  A03: {
    title: '國民黨、民進黨分配型提案\n共同關注老年人相關醫療福利',
    footnotes: [
      '註：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
    ],
    clouds: [
      {
        name: '國民黨',
        labelColor: 'var(--chart-blue-3)',
        textColor: { hue: 212, saturation: 31 },
        note: '次關注生育、家庭',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/kmt_unnested.json',
      },
      {
        name: '民進黨',
        labelColor: 'var(--chart-olive-3)',
        textColor: { hue: 64, saturation: 29 },
        note: '次關注女性、癌症篩檢等議題',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/dpp_unnested.json',
      },
    ],
  },
  A06: {
    title: '民眾黨、無黨團結聯盟分配型提案用詞',
    footnotes: [
      '註1：無黨團結聯盟在六都共6席議員，主要提案者為新北市議員馬見Lahuy．Ipin',
      '註2：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
    ],
    clouds: [
      {
        name: '民眾黨',
        labelColor: 'var(--chart-mint-3)',
        textColor: { hue: 170, saturation: 20 },
        note: '關注凍卵、家庭與長者',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/tpp_unnested.json',
      },
      {
        name: '無黨團結聯盟',
        labelColor: 'var(--chart-gray-3)',
        textColor: { hue: 0, saturation: 5 },
        note: '關注原住民議題',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/npsu_unnested.json',
      },
    ],
  },
  A08: {
    title: '資淺與資深議員因應不同選民結構\n做出差異提案策略',
    footnotes: [
      '註1：差異用詞使用「代表性比值」計算群體中常見的詞語，詳見文章方法論',
      '註2：僅統計本屆議員分配型提案，自2022年12月至2025年3月',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯　｜　設計：江世民',
    ],
    algo: 'linear',
    clouds: [
      {
        name: '資淺議員（任期含３屆以下）',
        labelColor: 'var(--chart-earth-3)',
        textColor: { hue: 35, saturation: 50 },
        note: '關注都會生活成本、年輕家庭需求與運動風潮',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/meetingTermCount_lte_3_relative.json',
      },
      {
        name: '資深議員（任期３屆以上）',
        labelColor: 'var(--chart-purple-3)',
        textColor: { hue: 280, saturation: 20 },
        note: '關注傳統產業勞動條件、基層公共服務人員權益與地方社群組織',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/meetingTermCount_gt_3_relative.json',
      },
    ],
  },
}
