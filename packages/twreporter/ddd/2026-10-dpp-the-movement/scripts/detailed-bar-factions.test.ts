import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseCsv } from '@lab-reporter/ddd-shared/utils/fetchers.ts'
import { buildDetailedBarChart } from '../src/lib/components/detailed-bar-chart/data.ts'
import { detailedBarChartConfigSchema } from '../src/lib/components/detailed-bar-chart/types.ts'

const readCsv = (name: string) =>
  parseCsv(
    readFileSync(new URL(`../public/${name}.csv`, import.meta.url), 'utf8'),
  )
const csv = readCsv('detailed-bar-chart')
const factions = new Map(
  readCsv('seatings').rows.map((row) => [row['姓名'], row['派系']]),
)
for (const row of csv.rows) {
  const faction = factions.get(row['候選人'])
  if (faction) assert.equal(row['是否流員'], faction === '新潮流' ? '是' : '否')
}
assert.ok(!csv.headers.includes('派系'))
const config = detailedBarChartConfigSchema.parse(
  JSON.parse(
    readFileSync(
      new URL('../public/detailed-bar-chart.json', import.meta.url),
      'utf8',
    ),
  ),
)
const originalRows = structuredClone(csv.rows)
const chart = buildDetailedBarChart(csv, config)
assert.deepEqual(csv.rows, originalRows)
const donations = chart.filters.flatMap((filter) =>
  filter.groups.flatMap((group) => group.donations),
)
assert.equal(donations.length, 176)
assert.equal(
  donations.reduce((sum, row) => sum + row.amount, 0),
  33065000,
)
assert.ok(donations.every((row) => row.cardVisible))
assert.equal(
  donations
    .filter((row) => row.highlighted)
    .reduce((sum, row) => sum + row.amount, 0),
  csv.rows
    .filter((row) => row['是否流員'] === '是')
    .reduce((sum, row) => sum + Number(row['金額']), 0),
)
const taichung = chart.filters.find((filter) => filter.value === '台中')!
const jiang = taichung.roster.find((candidate) => candidate.label === '江肇國')!
assert.ok(jiang.donations.some((row) => row.amount > 0))
assert.ok(jiang.donations.every((row) => !row.highlighted))
assert.equal(
  chart.filters
    .find((filter) => filter.value === '高雄')!
    .sections.find((section) => section.label === '市長與立委')!.candidates
    .length,
  10,
)
const li = chart.filters
  .find((filter) => filter.value === '高雄')!
  .roster.find((candidate) => candidate.label === '李柏毅')!
assert.equal(li.section, '市長與立委')
assert.ok(li.details.some((detail) => /^2018\s*議員$/.test(detail)))
assert.ok(li.details.some((detail) => /^2024\s*立委$/.test(detail)))
for (const separator of ['', ' ', '年']) {
  const formatted = buildDetailedBarChart(
    {
      ...csv,
      rows: csv.rows.map((row) => ({
        ...row,
        選舉名稱: row['選舉名稱'].replace(/^(\d{4})\s*/, `$1${separator}`),
      })),
    },
    config,
  )
  assert.equal(
    formatted.filters
      .find((filter) => filter.value === '高雄')!
      .roster.find((candidate) => candidate.label === '李柏毅')!.section,
    '市長與立委',
  )
}
const reversed = buildDetailedBarChart(
  { ...csv, rows: [...csv.rows].reverse() },
  config,
)
assert.equal(
  reversed.filters
    .find((filter) => filter.value === '高雄')!
    .roster.find((candidate) => candidate.label === '李柏毅')!.section,
  li.section,
)
const conflictingRows = csv.rows
  .filter((row) => row['候選人'] === '李柏毅')
  .map((row) => ({ ...row, 選舉名稱: '2024 選舉' }))
assert.throws(
  () => buildDetailedBarChart({ ...csv, rows: conflictingRows }, config),
  /無法依最新選舉/,
)
const nationalCsv = readCsv('national')
const nationalConfig = detailedBarChartConfigSchema.parse(
  JSON.parse(
    readFileSync(new URL('../public/national.json', import.meta.url), 'utf8'),
  ),
)
const national = buildDetailedBarChart(nationalCsv, nationalConfig).filters[0]
assert.equal(nationalCsv.rows.length, 57)
assert.equal(
  national.groups.reduce((sum, group) => sum + group.total, 0),
  5980000,
)
assert.ok(
  national.groups.every((group) =>
    group.donations.every((row) => row.cardVisible),
  ),
)
assert.ok(
  national.roster.some((candidate) =>
    candidate.donations.every((row) => !row.highlighted),
  ),
)
console.log(
  'Existing membership flags, donation totals and non-member cards passed.',
)
