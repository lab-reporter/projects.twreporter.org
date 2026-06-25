import type { Resolution } from '../constants/viewports'

export const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : a
}

export function resolutionToRatio(resolution: null): null
export function resolutionToRatio(
  resolution: NonNullable<Resolution>,
): NonNullable<Resolution>
export function resolutionToRatio(resolution: Resolution) {
  if (!resolution) return null

  const [width, height] = resolution
  const divisor = gcd(width, height)

  return [width / divisor, height / divisor]
}
