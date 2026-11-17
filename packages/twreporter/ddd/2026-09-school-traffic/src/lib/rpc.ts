import { CallOptions, type RemoteProxy } from 'penpal'
import { z } from 'zod'
import { createConnection } from '@lab-reporter/ddd-shared/components/full-screen-wrapper/rpc.ts'

export const playerTrackPointSchema = z.object({
  segment: z.number().int().positive(),
  t: z.number().nonnegative(),
  x: z.number(),
  z: z.number(),
  kind: z.enum(['road', 'shoulder', 'safe']),
})

export const playerTrackSchema = z.array(playerTrackPointSchema)
export type PlayerTrack = z.infer<typeof playerTrackSchema>

export const infoBoxSchema = z.object({
  id: z.string().min(1),
  zoneId: z.string().min(1),
  x: z.number(),
  z: z.number(),
  infoName: z.string(),
  infoContent: z.string().min(1),
  inspectItemSequence: z.string(),
  laws: z.array(z.string()),
})
export const infoBoxesSchema = z.array(infoBoxSchema)
export type InfoBox = z.infer<typeof infoBoxSchema>

export type PlayerApi = {
  getTrack(): PlayerTrack
  getInfoBoxes(): InfoBox[]
}

export type GetTrack = RemoteProxy<PlayerApi>['getTrack']
export type GetInfoBoxes = RemoteProxy<PlayerApi>['getInfoBoxes']

export function connectPlayer(options: Parameters<typeof createConnection>[0]) {
  const connection = createConnection<PlayerApi>(options)
  void connection.promise.catch((error) => {
    console.error('Player connection failed', error)
  })
  return {
    async getTrack() {
      const player = await connection.promise
      return playerTrackSchema.parse(
        await player.getTrack(new CallOptions({ timeout: 5000 })),
      )
    },
    async getInfoBoxes() {
      const player = await connection.promise
      return infoBoxesSchema.parse(
        await player.getInfoBoxes(new CallOptions({ timeout: 5000 })),
      )
    },
    destroy: connection.destroy,
  }
}
