import {
  requireCsvColumns,
  type CSVData,
} from '@lab-reporter/ddd-shared/utils/fetchers.ts'
import type { SeatingsConfig } from './types.ts'
import { isDarkColor } from '@lab-reporter/ddd-shared/utils/colors.ts'

export function buildSeatings(csv: CSVData, config: SeatingsConfig) {
  requireCsvColumns(csv, Object.values(config.columns))
  const rows = csv.rows.map((row, index) => {
    const group = row[config.columns.group]?.trim() ?? ''
    const category = row[config.columns.category]?.trim() ?? ''
    const label = row[config.columns.label]?.trim() ?? ''
    if (!group || !category || !label)
      throw new Error(`CSV 第 ${index + 2} 列缺少分組、類別或名稱。`)
    return {
      id: index,
      group,
      category,
      label,
      description: row[config.columns.description]?.trim() ?? '',
    }
  })
  const seenCategories = [...new Set(rows.map((row) => row.category))]
  const categoryOrder = [
    ...new Set([
      ...config.categories.map((category) => category.value),
      ...seenCategories,
    ]),
  ].filter((value) => seenCategories.includes(value))
  const categories = categoryOrder.map((value) => {
    const configured = config.categories.find(
      (category) => category.value === value,
    )
    const color = configured?.color ?? 'var(--neutral-gray-300)'
    const dark = configured ? isDarkColor(configured.color) : false
    return {
      value,
      label: configured?.label || value,
      color,
      textColor: dark ? 'var(--neutral-white)' : 'var(--neutral-gray-900)',
      count: rows.filter((row) => row.category === value).length,
    }
  })
  const groups = [...new Set(rows.map((row) => row.group))].map((label) => {
    const members = rows.filter((row) => row.group === label)
    const sections = categories
      .map((category) => ({
        category,
        seats: members.filter((row) => row.category === category.value),
      }))
      .filter((section) => section.seats.length)
    const focusCount = members.filter(
      (row) => row.category === config.focusCategory,
    ).length
    return {
      label,
      count: members.length,
      sections,
      focusCount,
      focusPercent: Math.round((focusCount / members.length) * 100),
    }
  })
  return { categories, groups, rows }
}
