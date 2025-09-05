const STORAGE_BASE_URL =
  'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote'

export const dataPath = {
  chart: `${STORAGE_BASE_URL}/data/sheets/chart.csv`,
  mapData: `${STORAGE_BASE_URL}/data/sheets/vill.csv`,
  chartFootnotes: `${STORAGE_BASE_URL}/data/sheets/footnotes.csv`,
  colorPalette: `${STORAGE_BASE_URL}/data/sheets/colors.csv`,
  baseMap(area: string) {
    return `${STORAGE_BASE_URL}/map/${area}.json`
  },
  imgStamp: `${STORAGE_BASE_URL}/assets/stamp.png`,
}
