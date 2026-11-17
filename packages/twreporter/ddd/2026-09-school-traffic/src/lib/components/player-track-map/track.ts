import type { PlayerTrack } from '../../rpc.ts'
import { projectPosition } from '../../constants/coordinate-map.ts'

type TrackPath = { kind: PlayerTrack[number]['kind']; d: string }
type TrackPixel = Pick<PlayerTrack[number], 'segment' | 'kind'> &
  ReturnType<typeof projectPosition>

export function createTrackPaths(track: PlayerTrack) {
  const paths: TrackPath[] = []
  let previous: TrackPixel | undefined
  let run: TrackPath | undefined

  for (const point of track) {
    const pixel = projectPosition(point)
    if (previous?.segment === point.segment) {
      if (run?.kind === previous.kind) {
        run.d += `L${pixel.u},${pixel.v}`
      } else {
        run = {
          kind: previous.kind,
          d: `M${previous.u},${previous.v}L${pixel.u},${pixel.v}`,
        }
        paths.push(run)
      }
    } else {
      run = undefined
    }
    previous = { ...pixel, segment: point.segment, kind: point.kind }
  }
  return paths
}
