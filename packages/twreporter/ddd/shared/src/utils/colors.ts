import type { Color } from '../components/shared/types.ts'

export function isDarkColor(color: Color) {
  return (
    0.2126 * parseInt(color.slice(1, 3), 16) +
      0.7152 * parseInt(color.slice(3, 5), 16) +
      0.0722 * parseInt(color.slice(5, 7), 16) <
    140
  )
}
