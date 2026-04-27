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
    title: '國民黨、民進黨補助型提案\n共同關注老年人相關醫療福利',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    clouds: [
      {
        name: '國民黨',
        labelColor: 'var(--supportive-heavy)',
        note: '【關注生育、家庭】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/kmt_unnested.json',
      },
      {
        name: '民進黨',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        note: '【關注女性、癌症篩檢等議題】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/dpp_unnested.json',
      },
    ],
  },
  A06: {
    title: '民眾黨、無黨團結聯盟補助型提案用詞',
    footnotes: [
      '註：無黨團結聯盟在六都共6席議員，主要提案者為新北市議員馬見Lahuy．Ipin',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    clouds: [
      {
        name: '民眾黨',
        labelColor: 'var(--supportive-heavy)',
        note: '【關注凍卵、家庭與長者】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/tpp_unnested.json',
      },
      {
        name: '無黨團結聯盟',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        note: '【關注原住民議題】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/npsu_unnested.json',
      },
    ],
  },
  A08: {
    title: '資淺與資深議員因應不同選民結構\n做出差異提案策略',
    footnotes: [
      '註：差異用詞使用「代表性比值」計算群體中常見的詞語，詳見文章方法論。',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    algo: 'linear',
    clouds: [
      {
        name: '資淺議員',
        labelColor: 'var(--supportive-heavy)',
        note: '【關注都會生活成本、年輕家庭需求與運動風潮】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/meetingTermCount_lte_3_relative.json',
      },
      {
        name: '資深議員',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        note: '【關注傳統產業勞動條件、基層公共服務人員權益與地方社群組織】',
        src: 'https://projects.twreporter.org/twreporter/ddd/2026-05-lawmaker/data/meetingTermCount_gt_3_relative.json',
      },
    ],
  },
}
