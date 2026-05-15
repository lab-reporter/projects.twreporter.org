export function safeParse<T>(data: any): T | null {
  if (!data) return null

  if (!data) return null

  try {
    return JSON.parse(data) as T
  } catch {
    return null
  }
}
