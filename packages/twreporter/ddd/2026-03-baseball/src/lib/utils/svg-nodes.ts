import type { NodeBounds } from '../constants/scroll-diagram'

const PADDING_FACTOR = 0.15

export function computeGroupView(
  prefix: string,
  allBounds: Record<string, NodeBounds>,
  viewportWidth: number,
  viewportHeight: number,
): { cx: number; cy: number; scale: number } | null {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let count = 0

  for (const [id, b] of Object.entries(allBounds)) {
    if (!id.startsWith(prefix)) continue
    minX = Math.min(minX, b.x)
    minY = Math.min(minY, b.y)
    maxX = Math.max(maxX, b.x + b.width)
    maxY = Math.max(maxY, b.y + b.height)
    count++
  }

  if (count === 0) return null

  const groupW = maxX - minX
  const groupH = maxY - minY
  const cx = minX + groupW / 2
  const cy = minY + groupH / 2

  const padW = groupW * (1 + PADDING_FACTOR * 2)
  const padH = groupH * (1 + PADDING_FACTOR * 2)

  const scale = Math.min(viewportWidth / padW, viewportHeight / padH)

  return { cx, cy, scale }
}
