export type Column = {
  key: string
  label: string
  width?: number
  align?: 'left' | 'right' | 'center'
}

export type TableConfig = {
  label?: string
  src: string
  columns: Column[]
  filter?: (row: Record<string, string | number>) => boolean
}

export const keys: Record<
  string,
  {
    title: string
    footnotes: string[]
    gridColumns?: number
    tables: TableConfig[]
  }
> = {
  T01: {
    title: '六都議員最常提哪些主題的分配性議案？',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    tables: [
      {
        src: new URL('./data/01_前五名分配性議案主題.json', import.meta.url).href,
        columns: [
          { key: '主題', label: '主題' },
          { key: '次數', label: '次數', align: 'center' },
        ],
      },
    ],
  },
  G01: {
    title: '六都前三名補助型提案主題',
    footnotes: [
      '資料來源：六都議會提案系統、報導者觀測站',
      '資料整理：黃靖緯 ｜ 設計：江世民',
    ],
    gridColumns: 3,
    tables: ['台北市', '新北市', '台中市', '桃園市', '台南市', '高雄市'].map((city) => ({
      label: city,
      src: new URL('./data/02_前三名主題表.json', import.meta.url).href,
      filter: (row) => row['縣市'] === city,
      columns: [
        { key: '標籤名稱', label: '主題' },
        { key: '佔比', label: '佔比', width: 0.25, align: 'center' },
      ],
    })),
  },
}
