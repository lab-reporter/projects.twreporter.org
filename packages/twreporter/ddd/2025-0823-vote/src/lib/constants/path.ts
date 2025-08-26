export const dataPath = {
  chart:
    'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/data/sheets/chart.csv',
  baseMap(area: string) {
    return `https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/map/${area}.json`
  },
  mapData:
    'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/data/sheets/vill.csv',
  chartFootnotes:
    'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/data/sheets/footnotes.csv',
  colorPalette:
    'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/data/sheets/colors.csv',
  imgStamp:
    'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/assets/stamp.png',
}
