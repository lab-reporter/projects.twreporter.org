export type Word = {
  token: string
  count: string
}

export type Color = {
  hue: number
  saturation: number
  lightness: number
}

export function colorScale({
  factor,
  ...base
}: {
  factor: number
} & Color) {
  const lightness = base.lightness - factor * 50
  const saturation = factor * base.saturation
  return `hsl(${base.hue}, ${saturation}%, ${lightness}%)`
}
