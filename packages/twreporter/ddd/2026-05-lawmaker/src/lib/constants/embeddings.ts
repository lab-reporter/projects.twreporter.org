export type EmbeddingsConfig = {
  title: string
  footnotes: string[]
  src: string
}

export const keys: Record<string, EmbeddingsConfig> = {
  E01: {
    title: '相似議案提案內容',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    src: new URL('./data/EmbedingData.json', import.meta.url).href,
  },
}
