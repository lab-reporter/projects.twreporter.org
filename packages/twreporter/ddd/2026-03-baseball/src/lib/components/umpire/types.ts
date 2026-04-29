export type HexDatum = {
  x: number
  y: number
  n: number
  csr: number
}

export type HexSize = {
  dx: number
  dy: number
}

export type StrikeZone = {
  xMin: number
  xMax: number
  zMin: number
  zMax: number
}

export type HoverPoint = {
  x: number
  y: number
  source: 'left' | 'right'
}

export type TooltipData = HexDatum & {
  source: 'left' | 'right'
}

export type UmpireData = {
  umpires: string[]
  grid: Record<string, HexDatum[]>
  hexSize: HexSize
  strikeZone: StrikeZone
}
