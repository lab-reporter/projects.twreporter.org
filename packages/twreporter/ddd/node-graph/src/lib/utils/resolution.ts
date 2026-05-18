import type { Resolution } from '../constants/viewports'

export const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : a
}

export function resolutionToRatio([width, height]: Resolution) {
  const divisor = gcd(width, height)

  return [width / divisor, height / divisor]
}
