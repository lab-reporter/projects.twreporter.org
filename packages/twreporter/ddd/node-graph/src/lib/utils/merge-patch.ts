export function mergePatch<T extends Record<string, unknown>>(
  current: T | undefined,
  patch: Partial<T>,
): T | undefined {
  const next = Object.fromEntries(
    Object.entries({ ...current, ...patch }).filter(
      ([, value]) => value !== undefined,
    ),
  ) as T

  return Object.keys(next).length > 0 ? next : undefined
}
