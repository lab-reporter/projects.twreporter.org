import type { PlayerTrack } from '../rpc.ts'

export const trackColors = {
  road: '#c53f2d',
  shoulder: '#b27014',
  safe: '#206e49',
} satisfies Record<PlayerTrack[number]['kind'], string>
