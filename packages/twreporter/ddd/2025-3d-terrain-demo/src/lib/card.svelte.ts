import * as Cesium from 'cesium'
import { onDestroy } from 'svelte'
import { parseCamera, type Card, type Content } from './content'
import { getTile } from './tiles'

type LoadedResource<T> = {
  source: string
  value: T
}

type PendingVector = {
  source: string
  dataSource?: Cesium.GeoJsonDataSource
}

type CardStateOptions = {
  getViewer: () => Cesium.Viewer | undefined
  getContent: () => Content | undefined
}

const imageRectangle = Cesium.Rectangle.fromDegrees(
  121.5353550179566,
  25.01039707562923,
  121.53852914474925,
  25.012477589373418,
)

function entriesFor(
  cards: Card[],
  field: 'tile' | 'image' | 'vector',
): [number, string][] {
  return cards.flatMap((card, index) =>
    card[field] ? [[index, card[field]]] : [],
  )
}

function reconcile<T>({
  entries,
  activeIndex,
  loaded,
  add,
  remove,
}: {
  entries: [number, string][]
  activeIndex: number
  loaded: Map<number, LoadedResource<T>>
  add: (source: string) => T | undefined
  remove: (value: T) => void
}) {
  const desired = new Map(entries.filter(([index]) => index <= activeIndex))

  loaded.forEach((resource, index) => {
    if (desired.get(index) === resource.source) return

    remove(resource.value)
    loaded.delete(index)
  })

  desired.forEach((source, index) => {
    if (loaded.has(index)) return

    const value = add(source)
    if (value) loaded.set(index, { source, value })
  })
}

function fadeIn(
  layer: Cesium.ImageryLayer,
  layers: Cesium.ImageryLayerCollection,
) {
  layer.alpha = 0
  const startTime = performance.now()
  const duration = 1000

  const animate = (now: number) => {
    if (!layers.contains(layer)) return

    layer.alpha = Math.min((now - startTime) / duration, 1)
    if (layer.alpha < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

export class CardState {
  activeIndex = $state(0)

  private viewer?: Cesium.Viewer
  private readonly tileLayers = new Map<
    number,
    LoadedResource<Cesium.ImageryLayer>
  >()
  private readonly imageLayers = new Map<
    number,
    LoadedResource<Cesium.ImageryLayer>
  >()
  private readonly markerLabels = new Map<
    number,
    LoadedResource<Cesium.Label[]>
  >()
  private readonly vectors = new Map<number, PendingVector>()
  private labelCollection?: Cesium.LabelCollection

  constructor(private readonly options: CardStateOptions) {
    $effect(() => {
      const viewer = this.options.getViewer()
      const content = this.options.getContent()

      if (!viewer || !content?.cards.length) return

      if (this.activeIndex >= content.cards.length) {
        this.activeIndex = 0
        return
      }

      if (this.viewer && this.viewer !== viewer) this.destroyResources()
      this.viewer = viewer

      const card = content.cards[this.activeIndex]
      this.flyTo(card, content.animation)
      this.syncResources(content.cards)
    })

    onDestroy(() => this.destroyResources())
  }

  get cards() {
    return this.options.getContent()?.cards ?? []
  }

  get hasCards() {
    return this.cards.length > 0
  }

  private flyTo(card: Card, animation?: string) {
    if (!this.viewer) return

    const { position, orientation } = parseCamera(card.camera)

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromArray([
        position.x,
        position.y,
        position.z,
      ]),
      orientation,
      duration: animation ? parseInt(animation) : 2.5,
      maximumHeight: 100,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    })
  }

  private syncResources(cards: Card[]) {
    if (!this.viewer) return

    this.syncVectors(entriesFor(cards, 'vector'))

    reconcile({
      entries: entriesFor(cards, 'tile'),
      activeIndex: this.activeIndex,
      loaded: this.tileLayers,
      add: (tile) => this.addTile(tile),
      remove: (layer) => this.viewer?.imageryLayers.remove(layer),
    })

    reconcile({
      entries: entriesFor(cards, 'image'),
      activeIndex: this.activeIndex,
      loaded: this.imageLayers,
      add: (image) => this.addImage(image),
      remove: (layer) => this.viewer?.imageryLayers.remove(layer),
    })

    reconcile({
      entries: cards.flatMap((card, index) =>
        index === this.activeIndex && card.markers
          ? [[index, JSON.stringify(card.markers)]]
          : [],
      ),
      activeIndex: this.activeIndex,
      loaded: this.markerLabels,
      add: (source) => this.addMarkers(JSON.parse(source)),
      remove: (labels) => {
        labels.forEach((label) => this.labelCollection?.remove(label))
      },
    })
  }

  private addTile(tile: string) {
    if (!this.viewer) return

    const { url, max } = getTile(tile)
    if (!url) return

    const layer = this.viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url,
        maximumLevel: max,
      }),
    )
    fadeIn(layer, this.viewer.imageryLayers)
    return layer
  }

  private addImage(image: string) {
    if (!this.viewer) return

    const layer = Cesium.ImageryLayer.fromProviderAsync(
      Cesium.SingleTileImageryProvider.fromUrl(image, {
        /** TODO: change to dynamic size and location */
        rectangle: imageRectangle,
      }),
    )
    this.viewer.imageryLayers.add(layer)
    fadeIn(layer, this.viewer.imageryLayers)
    return layer
  }

  private addMarkers(markers: NonNullable<Card['markers']>) {
    if (!this.viewer) return

    const collection =
      this.labelCollection ??
      (this.labelCollection = this.viewer.scene.primitives.add(
        new Cesium.LabelCollection({ scene: this.viewer.scene }),
      ))

    return markers.flatMap(({ x, y, label }) => {
      const longitude = Number(x)
      const latitude = Number(y)
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        console.warn(`Invalid marker coordinates: ${x}, ${y}`)
        return []
      }

      return [
        collection.add({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          text: label,
          font: '16px sans-serif',
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.WHITE,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString(
            'rgba(0, 0, 0, 0.65)',
          ),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }),
      ]
    })
  }

  private syncVectors(entries: [number, string][]) {
    if (!this.viewer) return

    const desired = new Map(
      entries.filter(([index]) => index <= this.activeIndex),
    )

    this.vectors.forEach((resource, index) => {
      if (desired.get(index) === resource.source) return

      if (resource.dataSource) {
        this.viewer?.dataSources.remove(resource.dataSource)
      }
      this.vectors.delete(index)
    })

    desired.forEach((source, index) => {
      if (this.vectors.has(index)) return

      const pending: PendingVector = { source }
      this.vectors.set(index, pending)

      Cesium.GeoJsonDataSource.load(source)
        .then((dataSource) => {
          if (this.vectors.get(index) !== pending || !this.viewer) return

          pending.dataSource = dataSource
          this.viewer.dataSources.add(dataSource)
        })
        .catch((error) => {
          if (this.vectors.get(index) === pending) this.vectors.delete(index)
          console.error(`Failed to load vector: ${source}`, error)
        })
    })
  }

  private destroyResources() {
    if (this.viewer && !this.viewer.isDestroyed()) {
      this.tileLayers.forEach(({ value }) =>
        this.viewer?.imageryLayers.remove(value),
      )
      this.imageLayers.forEach(({ value }) =>
        this.viewer?.imageryLayers.remove(value),
      )
      this.vectors.forEach(({ dataSource }) => {
        if (dataSource) this.viewer?.dataSources.remove(dataSource)
      })
      if (this.labelCollection) {
        this.viewer.scene.primitives.remove(this.labelCollection)
      }
    }

    this.tileLayers.clear()
    this.imageLayers.clear()
    this.markerLabels.clear()
    this.vectors.clear()
    this.labelCollection = undefined
    this.viewer = undefined
  }
}
