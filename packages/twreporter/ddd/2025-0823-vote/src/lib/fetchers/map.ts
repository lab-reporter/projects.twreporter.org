import { createQuery } from '@tanstack/svelte-query'
import { fetchCSV, fetchJSON } from '../fetch'
import { dataPath } from '../constants/path'
import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from 'geojson'
import { mergeFeaturesById } from '../spatial'

export const useMapData = (area: string, idKey: string, groupKey: string) =>
  createQuery({
    queryKey: ['map', area],
    queryFn: async () => {
      const basemap = await fetchJSON<
        FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>
      >(dataPath.baseMap(area)).then((json) => ({
        ...json,
        features: json.features.filter((f) => f.properties?.NOTE === null),
      }))

      const data = await fetchCSV({
        url: dataPath.mapData,
        key: idKey,
      })

      return {
        groupMap: mergeFeaturesById(basemap, groupKey),
        basemap: {
          ...basemap,
          features: basemap.features.map((feature) => {
            const id = feature.properties?.[idKey]
            if (id && data?.[id]) {
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  ...data[id],
                },
              }
            }

            return feature
          }),
        },
      }
    },
    retry: true,
  })
