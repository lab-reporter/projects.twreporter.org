import type { Color } from '../wordcloud'

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    clouds: {
      name: string
      src: string
      labelColor: string
      textColor?: Partial<Color>
    }[]
  }
> = {
  A03: {
    title: '國、民兩黨補助型提案用詞',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    clouds: [
      {
        name: '國民黨',
        labelColor: 'var(--supportive-heavy)',
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
      {
        name: '民進黨',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
    ],
  },
  A06: {
    title: '民眾黨、無黨團結聯盟補助型提案用詞',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    clouds: [
      {
        name: '民眾黨',
        labelColor: 'var(--supportive-heavy)',
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
      {
        name: '無黨團結聯盟',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
    ],
  },
  A08: {
    title: '資淺與資深議員差異用詞',
    footnotes: [
      '註：差異用詞使用「代表性比值」計算群體中常見的詞語，詳見文章方法論。',
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    clouds: [
      {
        name: '資淺議員',
        labelColor: 'var(--supportive-heavy)',
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
      {
        name: '資深議員',
        labelColor: '#748C80',
        textColor: { hue: 280, saturation: 15 },
        src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
      },
    ],
  },
}
