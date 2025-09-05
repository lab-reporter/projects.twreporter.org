import { bbox, buffer, center, featureCollection, union } from '@turf/turf'
import type {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
  GeoJSON,
  BBox,
  Feature,
} from 'geojson'

function expandToAspectRatio(bbox: BBox, targetAspectRatio: number): BBox {
  const [minX, minY, maxX, maxY] = bbox

  // Calculate current dimensions
  const currentWidth = maxX - minX
  const currentHeight = maxY - minY
  const currentAspectRatio = currentWidth / currentHeight

  // Calculate center point
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  let newWidth: number
  let newHeight: number

  if (currentAspectRatio < targetAspectRatio) {
    // Current bbox is too tall, expand width
    newHeight = currentHeight
    newWidth = newHeight * targetAspectRatio
  } else {
    // Current bbox is too wide, expand height
    newWidth = currentWidth
    newHeight = newWidth / targetAspectRatio
  }

  // Calculate new bounds centered on the original center
  const halfWidth = newWidth / 2
  const halfHeight = newHeight / 2

  return [
    centerX - halfWidth,
    centerY - halfHeight,
    centerX + halfWidth,
    centerY + halfHeight,
  ]
}

export function getMapConfig(
  basemap?: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>
) {
  if (!basemap) return

  const bounds: BBox = basemap
    ? bbox(buffer(basemap, 3) as GeoJSON)
    : [121.5, 25.025, 121.58, 25.1]

  const expandedBounds = expandToAspectRatio(bounds, 1.3)

  const geojsonCenter = (
    basemap ? center(basemap).geometry.coordinates : [121.54, 25.06]
  ) as [number, number]

  return {
    bounds: [
      [expandedBounds[0], expandedBounds[1]],
      [expandedBounds[2], expandedBounds[3]],
    ] as [[number, number], [number, number]],
    center: geojsonCenter,
  }
}

export function mergeFeaturesById(
  geojson: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>,
  idKey: string
) {
  const featureMap = new Map<
    string,
    Feature<Polygon | MultiPolygon, GeoJsonProperties>
  >()

  for (const feature of geojson.features) {
    const groupId = feature.properties?.[idKey]
    if (groupId) {
      const existing = featureMap.get(groupId)
      if (existing) {
        const merged = union(featureCollection([existing, feature]))
        if (merged) {
          merged.properties = feature.properties
          featureMap.set(groupId, merged)
        }
      } else {
        featureMap.set(groupId, feature)
      }
    }
  }

  return featureCollection(Array.from(featureMap.values()))
}
