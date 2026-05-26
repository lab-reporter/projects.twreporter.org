export function normalize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
