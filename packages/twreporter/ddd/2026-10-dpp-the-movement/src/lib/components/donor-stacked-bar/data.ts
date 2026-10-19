import {
  requireCsvColumns,
  type CSVData,
} from '@lab-reporter/ddd-shared/utils/fetchers.ts'
import type { DonorStackedBarConfig } from './types.ts'

export function buildDonorStackedBar(
  csv: CSVData,
  config: DonorStackedBarConfig,
) {
  requireCsvColumns(csv, [
    config.columns.label,
    config.columns.description,
    ...config.series.map((series) => series.column),
  ])

  const rows = csv.rows.map((row, index) => {
    const label = row[config.columns.label]?.trim() ?? ''
    if (!label) throw new Error(`CSV 第 ${index + 2} 列缺少企業／集團名稱。`)
    const values = config.series.map((series) => {
      const source = row[series.column]?.trim() ?? ''
      const value = source ? Number(source.replace(/,/g, '')) : 0
      if (!Number.isFinite(value) || value < 0)
        throw new Error(`CSV 第 ${index + 2} 列的「${series.label}」金額無效。`)
      return { ...series, value }
    })
    return {
      label,
      description: row[config.columns.description]?.trim() ?? '',
      values,
      total: values.reduce((sum, series) => sum + series.value, 0),
    }
  })

  const min = config.axis.min
  const max =
    config.axis.max ?? Math.max(min + 1, ...rows.map((row) => row.total))
  if (max <= min) throw new Error('X 軸最大值必須大於最小值。')
  return { rows: rows.filter((row) => row.total > 0), axis: { min, max } }
}
