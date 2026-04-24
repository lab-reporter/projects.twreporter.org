export type Word = {
  token: string
  count: string
}

export function colorScale({
  factor,
  ...base
}: {
  factor: number
  hue: number
  saturation: number
  lightness: number
}) {
  const lightness = base.lightness - factor * 50
  const saturation = factor * base.saturation
  return `hsl(${base.hue}, ${saturation}%, ${lightness}%)`
}
