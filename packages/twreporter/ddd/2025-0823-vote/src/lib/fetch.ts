import { parse } from 'papaparse'

export async function fetchCSV({ url, key }: { url: string; key: string }) {
  const modifiedUrl = new URL(url)
  modifiedUrl.searchParams.set(
    't',
    Math.floor(Date.now() / 1000 / 120).toString()
  )

  return await fetch(modifiedUrl.toString()).then(async (res) => {
    if (!res.ok) {
      throw Error(`Failed to fetch CSV from ${url}: ${res.statusText}`)
    }

    const csvText = await res.text()

    if (!csvText) {
      throw Error(`Empty CSV file from ${url}`)
    }

    const parsed = parse<Record<string, string>>(csvText, {
      header: true,
    })

    const lookup: Record<string, Record<string, string>> = {}

    parsed.data.forEach((row) => {
      lookup[row[key]] = row
    })

    return lookup
  })
}

export async function fetchCSVArray({ url }: { url: string }) {
  const modifiedUrl = new URL(url)
  modifiedUrl.searchParams.set(
    't',
    Math.floor(Date.now() / 1000 / 120).toString()
  )

  return await fetch(modifiedUrl.toString()).then(async (res) => {
    if (!res.ok) {
      throw Error(`Failed to fetch CSV from ${url}: ${res.statusText}`)
    }

    const csvText = await res.text()

    if (!csvText) {
      throw Error(`Empty CSV file from ${url}`)
    }

    const parsed = parse<Record<string, string>>(csvText, {
      header: true,
    })

    return parsed.data
  })
}

export async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) {
    throw Error(`Failed to fetch JSON from ${url}: ${res.statusText}`)
  }

  return await res.json()
}
