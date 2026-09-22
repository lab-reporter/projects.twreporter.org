import { parse } from 'papaparse'
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
  const result = parse<Record<string, string>>(csvText, {
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
