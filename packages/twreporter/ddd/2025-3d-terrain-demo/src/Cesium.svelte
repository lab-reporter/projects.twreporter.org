<script lang="ts">
  import * as Cesium from 'cesium'
  import 'cesium/Build/Cesium/Widgets/widgets.css'
  import CardContent from './components/CardContent.svelte'
  import Loading from './components/Loading.svelte'
  import { getCard, parseCamera } from './lib/content'
  import { cesiumContainerId, useCesium } from './lib/runes/cesium.svelte'
  import { getTile } from './lib/tiles'

  const cesium = useCesium({ containerId: cesiumContainerId })
  let viewer = $derived(cesium.viewer)
  let contentQuery = $derived(cesium.query)

  let content = $derived(contentQuery?.data)
  let animation = $derived(contentQuery?.data?.animation)
  let cards = $derived(contentQuery?.data?.cards)

  let activeCardName = $state<string | null>(null)
  let activeCard = $derived(
    content && getCard({ content, name: activeCardName })
  )
  let lastCardIndex = $state<number | null>(null)

  function handleScroll() {
    if (!viewer || !cards) return

    const viewportHeight = window.innerHeight

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const cardElement = document.getElementById(card.name)

      if (!cardElement) continue

      const cardTop = cardElement.getBoundingClientRect().top
      const cardBottom = cardTop + cardElement.offsetHeight

      const triggerPoint = viewportHeight / 3

      if (cardTop <= triggerPoint && cardBottom >= triggerPoint) {
        activeCardName = card.name
        break
      }
    }
  }

  $effect(() => {
    if (!activeCard?.card || !viewer) return

    const { position, orientation } = parseCamera(activeCard.card.camera)

    viewer.camera.flyTo({
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
      duration: animation ? parseInt(animation) : 2.5,
      maximumHeight: 100,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    })

    const shouldLoadMore =
      lastCardIndex !== null && lastCardIndex < activeCard.index

    // Handle vectors (dataSources)
    const vectors = cards
      ?.map((card, index) =>
        card.vector ? ([index, card.vector] as [number, string]) : undefined
      )
      .filter((v) => v !== undefined) as [number, string][]

    const vectorsToDiff = vectors?.filter((v) => {
      if (lastCardIndex === null) return v[0] <= activeCard.index
      if (shouldLoadMore) {
        return v[0] > lastCardIndex && v[0] <= activeCard.index
      } else {
        return v[0] > activeCard.index && v[0] <= lastCardIndex
      }
    })

    if (vectorsToDiff) {
      if (shouldLoadMore || lastCardIndex === null) {
        // Add new dataSources
        vectorsToDiff.forEach(([, vectorUrl]) => {
          Cesium.GeoJsonDataSource.load(vectorUrl).then((dataSource) => {
            viewer.dataSources.add(dataSource)
          })
        })
      } else {
        // Remove dataSources
        vectorsToDiff.forEach(([, vectorUrl]) => {
          const name = vectorUrl.split('/').at(-1)

          if (!name) return

          const dataSource = viewer.dataSources.getByName(name)[0]

          if (dataSource) {
            viewer.dataSources.remove(dataSource)
          }
        })
      }
    }

    // Handle tiles (imageryLayers)
    const tiles = cards
      ?.map((card, index) => (card.tile ? [index, card.tile] : undefined))
      .filter((v) => v !== undefined) as [number, string][]

    const tilesToDiff = tiles?.filter((v) => {
      if (lastCardIndex === null) return v[0] <= activeCard.index
      if (shouldLoadMore) {
        return v[0] > lastCardIndex && v[0] <= activeCard.index
      } else {
        return v[0] > activeCard.index && v[0] <= lastCardIndex
      }
    })

    if (tilesToDiff) {
      if (shouldLoadMore || lastCardIndex === null) {
        // Add new imageryLayers
        tilesToDiff.forEach(([, tile]) => {
          const { url, max } = getTile(tile)

          if (!url) return

          const layer = viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({ url, maximumLevel: max })
          )
          layer.alpha = 0

          // Animate opacity
          const startTime = performance.now()
          const duration = 1000 // 1 second

          const animate = () => {
            const elapsed = performance.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            layer.alpha = progress

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        })
      } else {
        // Remove imageryLayers
        tilesToDiff.forEach(() => {
          const layer = viewer.imageryLayers.get(
            viewer.imageryLayers.length - 1
          )
          if (layer) {
            viewer.imageryLayers.remove(layer)
          }
        })
      }
    }

    // Handle images (SingleTileImageryProvider)
    const images = cards
      ?.map((card, index) => (card.image ? [index, card.image] : undefined))
      .filter((v) => v !== undefined) as [number, string][]

    const imagesToDiff = images?.filter((v) => {
      if (lastCardIndex === null) return v[0] <= activeCard.index
      if (shouldLoadMore) {
        return v[0] > lastCardIndex && v[0] <= activeCard.index
      } else {
        return v[0] > activeCard.index && v[0] <= lastCardIndex
      }
    })

    if (imagesToDiff) {
      if (shouldLoadMore || lastCardIndex === null) {
        // Add new imageryLayers
        imagesToDiff.forEach(([, image]) => {
          const layer = Cesium.ImageryLayer.fromProviderAsync(
            Cesium.SingleTileImageryProvider.fromUrl(image, {
              /** TODO: change to dynamic size and location */
              rectangle: Cesium.Rectangle.fromDegrees(
                121.5353550179566,
                25.01039707562923,
                121.53852914474925,
                25.012477589373418
              ),
            })
          )
          viewer.imageryLayers.add(layer)

          // Animate opacity
          const startTime = performance.now()
          const duration = 1000 // 1 second

          const animate = () => {
            const elapsed = performance.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            layer.alpha = progress

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        })
      } else {
        // Remove imageryLayers
        imagesToDiff.forEach(() => {
          const layer = viewer.imageryLayers.get(
            viewer.imageryLayers.length - 1
          )
          if (layer) {
            viewer.imageryLayers.remove(layer)
          }
        })
      }
    }

    lastCardIndex = activeCard.index
  })
</script>

<svelte:document onscroll={handleScroll} />

<div class="base">
  <div class="background">
    {#if contentQuery.isLoading}
      <div class="loading-screen"><Loading /></div>
    {/if}
    <div id={cesiumContainerId} class="map"></div>
  </div>
  <div class="scroll" style:position="relative">
    {#each cards as card}
      <CardContent {card} />
    {/each}
  </div>
</div>

<p style:height="500px">內文內文內文</p>

<style>
  .base {
    position: relative;
  }
  .background {
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
  }

  .scroll {
    position: relative;
    z-index: 1;
  }

  .map {
    height: 100%;
  }

  .loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 10;
  }

  :global(.cesium-viewer) {
    height: 100%;
  }
</style>
