import coordinateMapData from './coordinate-map.json' with { type: 'json' }
import {
  coordinateMapSchema,
  createPositionProjector,
} from '../coordinate-map.ts'

export const coordinateMap = coordinateMapSchema.parse(coordinateMapData)
export const mapWidth = coordinateMap.width
export const mapHeight = coordinateMap.height
export const coordinateLandmarks = coordinateMap.landmarks
export const projectPosition = createPositionProjector(coordinateMap)
