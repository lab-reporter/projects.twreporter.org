import Papa from 'papaparse'
import type { ZodType } from 'zod'

export async function fetchText(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch text (${response.status} ${response.statusText}): ${url}`,
    )
  }
  return response.text()
}

export async function fetchJson<Value>(
  url: string,
  schema: ZodType<Value>,
  signal?: AbortSignal,
): Promise<Value> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch JSON (${response.status} ${response.statusText}): ${url}`,
    )
  }
  return schema.parse(await response.json())
}

export function parseCsv(csvText: string) {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: 'greedy',
  })

  if (result.errors.length > 0) {
    throw new Error(
      `Failed to parse CSV: ${result.errors.map((error) => error.message).join('; ')}`,
    )
  }

  return {
    rows: result.data,
    headers: result.meta.fields ?? [],
  }
}

export type CSVData = ReturnType<typeof parseCsv>

export function requireCsvColumns(csv: CSVData, columns: string[]): void {
  const missing = [
    ...new Set(
      columns.filter((column) => column && !csv.headers.includes(column)),
    ),
  ]
  if (missing.length) throw new Error(`找不到 CSV 欄位：${missing.join('、')}`)
}
