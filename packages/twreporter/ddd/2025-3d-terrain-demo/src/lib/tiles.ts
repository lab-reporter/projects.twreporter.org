import { source } from '../constants/imagery'

export function getTile(tile: string) {
  const pattern = /^([^.;]+)(?:\.([^;]+))?(?:;(.+))?$/
  const match = tile.match(pattern)
  if (!match) return { url: null, max: null }
  const tileName = match[1]
  const tileExt = match[2] ?? 'png'
  const tileMax = Number(match[3]) ?? 19

  return {
    url: `${source.selfhostedBaseUrl}/${tileName}/{z}/{x}/{y}.${tileExt}`,
    max: tileMax,
  }
}
