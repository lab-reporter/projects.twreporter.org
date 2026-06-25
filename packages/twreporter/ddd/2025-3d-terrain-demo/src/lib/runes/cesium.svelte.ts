import * as Cesium from 'cesium'
import { parseCamera, queryContent, type Content } from '../content'
import { onMount } from 'svelte'
import { terrainServer } from '../../constants/terrain'
import { source } from '../../constants/imagery'
import type { CreateQueryResult } from '@tanstack/svelte-query'
import { getTile } from '../tiles'

/**
 * Taiwan bounding box
 * North-West: 25.45679248899884, 120.14837985134528
 * South-East: 21.897146905114784, 121.79268072509971
 */
export const rectangles = {
  taiwan: Cesium.Rectangle.fromDegrees(
    120.14837985134528,
    21.897146905114784,
    121.79268072509971,
    25.45679248899884
  ),
}

export const cesiumContainerId = 'cesium-container'

export function useCesium({
  containerId,
  viewerConfig,
  options,
  onViewerMount,
}: {
  containerId: string
  viewerConfig?: Cesium.Viewer.ConstructorOptions
  options?: {
    interaction: boolean
  }
  onViewerMount?: (viewer: Cesium.Viewer) => void
}) {
  let result: {
    viewer?: Cesium.Viewer
    query: CreateQueryResult<Content, Error>
    toStart?: () => void
  } = $state({
    query: queryContent(),
    toStart: () => {
      if (!result.viewer || !start) return

      const { position, orientation } = parseCamera(start)
      result.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromArray([
          position.x,
          position.y,
          position.z,
        ]),
        orientation: {
          heading: orientation.heading,
          pitch: orientation.pitch,
          roll: orientation.roll,
        },
      })
    },
  })

  let content = $derived(result.query.data)
  let tiles = $derived(content?.tiles)
  let start = $derived(content?.start)
  let vectors = $derived(content?.vectors)
  let images = $derived(content?.images)
  let basemap = $derived(content?.basemap)

  onMount(async () => {
    result.viewer = new Cesium.Viewer(containerId, {
      terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl(
        terrainServer
      ),
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: source.google,
          maximumLevel: 19,
        }),
        {
          brightness: 0.5,
          contrast: 1.2,
        }
      ),
      timeline: false,
      animation: false,
      fullscreenButton: false,
      vrButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      homeButton: false,
      geocoder: false,
      infoBox: false,
      creditContainer: document.createElement('div'),
      baseLayerPicker: false,
      ...viewerConfig,
    })

    if (!options?.interaction) {
      // Disable user interactions
      result.viewer.scene.screenSpaceCameraController.enableRotate = false
      result.viewer.scene.screenSpaceCameraController.enableTranslate = false
      result.viewer.scene.screenSpaceCameraController.enableZoom = false
      result.viewer.scene.screenSpaceCameraController.enableTilt = false
      result.viewer.scene.screenSpaceCameraController.enableLook = false
    }

    if (onViewerMount) {
      onViewerMount(result.viewer)
    }
  })

  $effect(() => {
    if (!result.viewer) return

    if (basemap === 'no') {
      result.viewer.scene.imageryLayers.removeAll()

      result.viewer.scene.imageryLayers.add(
        new Cesium.ImageryLayer(
          new Cesium.SingleTileImageryProvider({
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            tileHeight: 1,
            tileWidth: 1,
          })
        )
      )

      result.viewer.scene.globe.baseColor =
        Cesium.Color.fromCssColorString('#F1F1F1')

      if (!options?.interaction) {
        result.viewer.scene.morphTo2D(0)
      }
    }

    if (tiles) {
      tiles.forEach((tile) => {
        const { url, max } = getTile(tile)

        if (!url) return

        result.viewer?.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url,
            maximumLevel: max,
          })
        )
      })
    }

    if (start) {
      if (!result.toStart) return

      result.toStart()
    }

    if (vectors) {
      Cesium.GeoJsonDataSource.clampToGround = true
      vectors.forEach((vector) => {
        result.viewer?.dataSources.add(
          Cesium.GeoJsonDataSource.load(vector, {
            fill: Cesium.Color.TRANSPARENT,
            strokeWidth: 2,
            clampToGround: true,
          })
        )
      })
    }

    if (images) {
      images.forEach(async (image) => {
        result.viewer?.imageryLayers.addImageryProvider(
          await Cesium.SingleTileImageryProvider.fromUrl(image, {
            /** TODO: change to dynamic size and location */
            rectangle: Cesium.Rectangle.fromDegrees(
              121.5353550179566,
              25.01039707562923,
              121.53852914474925,
              25.012477589373418
            ),
          })
        )
      })
    }
  })

  return result
}
