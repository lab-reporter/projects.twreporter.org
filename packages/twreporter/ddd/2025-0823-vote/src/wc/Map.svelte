<script lang="ts">
  import { point, pointsWithinPolygon } from '@turf/turf'
  import {
    FillLayer,
    GeoJSONSource,
    LineLayer,
    MapLibre,
    NavigationControl,
    Popup,
    SymbolLayer,
  } from 'svelte-maplibre-gl'

  import Base from '../components/Base.svelte'
  import Content from '../components/card/Content.svelte'
  import Footer from '../components/card/Footer.svelte'
  import Header from '../components/card/Header.svelte'
  import Subtitle from '../components/card/Subtitle.svelte'
  import Title from '../components/card/Title.svelte'

  import { dataPath } from '../lib/constants/path'
  import { useChartData } from '../lib/fetchers/chart'
  import { useColors } from '../lib/fetchers/colors'
  import { useMapData } from '../lib/fetchers/map'

  import { getMapConfig } from '../lib/spatial'
  import { textTemplate } from '../lib/text'

  // Web Component 裡面輸入的資料，例如 `<twreporter-map data-area="B01" map-area="新北11"></twreporter-map>`
  let {
    'map-area': area,
    'data-area': dataArea,
  }: { 'map-area': string; 'data-area': string } = $props()

  const featureConfig = {
    idKey: 'VILLCODE', // 用來和試算表資料比對的 ID 欄位
    groupKey: 'TOWNCODE', // 用來在地圖中結合同鄉鎮市區的 ID 欄位
    group: {
      // 設定顏色群組
      key: '投票意向', // 分組讀取欄位
      categories: [
        // 欄位名對照 popup 中的顏色
        '同意票多於不同意票',
        '#A61B34',
        '不同意票多於同意票',
        '#DAC3AF',
        '同意票等於不同意票',
        '#AAA',
      ] as const,
      defaultColor: '#FFF',
    },
    labelKey: 'Label', // 地圖要讀取哪個欄位作為村里的 popup 標題
    // popup 的文字模板，{{ABC}} 的內容，將會被替換為 ABC 欄位的資料
    descriptionTemplate:
      '同意－不同意差距：{{差距（同意－不同意）}} 百分點\n同意票：{{同意票比例}}（{{同意票數}}票）\n不同意票：{{不同意票比例}}（{{不同意票數}}票）',
    valueKey: '差距（同意－不同意）', // 地圖使用哪個欄位設定顏色階層
  }

  const chartQuery = useChartData(dataArea)

  let cand = $derived($chartQuery.data)
  let title = $derived(cand?.['標題'])
  let subtitle = $derived(cand?.['副標題'].replaceAll('\n', '<br>'))
  let footnotes = $derived(cand?.['地圖註解'].split('\n'))
  let passed = $derived(cand?.['人工勾選通過'] === 'TRUE')
  let stampStyle = $derived(cand?.['罷免 Stamp'])

  const colorQuery = useColors()

  let steps = $derived(
    $colorQuery.data?.steps.map((c) => [Number(c['級距']), c['顏色']]).flat()
  )

  const mapQuery = useMapData(area, featureConfig.idKey, featureConfig.groupKey)

  let mapConfig = $derived(getMapConfig($mapQuery.data?.basemap))

  let mousePosition = $state<[number, number] | undefined>(undefined)
  let showPopup = $derived(
    mousePosition !== undefined && $mapQuery.data
      ? pointsWithinPolygon(point(mousePosition), $mapQuery.data.basemap)
          .features.length > 0
      : false
  )
  let hoveredFeature = $derived(
    $mapQuery.data?.basemap.features.find(
      (feature) =>
        pointsWithinPolygon(point(mousePosition ?? [0, 0]), feature).features
          .length > 0
    )
  )

  let globalLoading = $derived(
    $mapQuery.isLoading || $chartQuery.isLoading || $colorQuery.isLoading
  )

  let map = $state<maplibregl.Map | undefined>(undefined)
</script>

<Base {title} bind:loading={globalLoading}>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/5.6.1/maplibre-gl.min.css"
    rel="stylesheet"
    crossorigin="anonymous"
  />
  <Header>
    <Title>{title}</Title>
    <Subtitle>{@html subtitle}</Subtitle>
  </Header>
  <Content bind:loading={globalLoading} style="min-height: 500px;">
    {#if passed}
      <img
        src={dataPath.imgStamp}
        alt="Stamp"
        class="stamp"
        style={stampStyle}
      />
    {/if}
    <div class="legends">
      <div class="legend-titles">
        <p class="legend-label">不同意</p>
        <p class="legend-label">催票率差異（百分點）</p>
        <p class="legend-label">同意</p>
      </div>
      {#if $colorQuery.isSuccess}
        <div class="legend-item">
          {#each $colorQuery.data?.steps.slice(0, -1) as step}
            <div
              class="legend-single-wrapper"
              class:agree={+step['級距'] > 0}
              class:disagree={+step['級距'] < 0}
              class:tied={+step['級距'] === 0}
            >
              <div
                class="continuous-legend"
                style:width="40px"
                style:background={step['顏色']}
              >
                {#if +step['級距'] === 0}
                  <p>平手</p>
                {/if}
              </div>
              <p class="legend-number">
                {step['Label']}
              </p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    <MapLibre
      class="map"
      zoom={1}
      center={mapConfig?.center}
      maxBounds={mapConfig?.bounds}
      attributionControl={false}
      onmousemove={(e) => {
        mousePosition = e.lngLat.toArray() as [number, number] | undefined
      }}
      maxZoom={13}
      bind:map
      canvasContextAttributes={{
        preserveDrawingBuffer: true,
      }}
      style={{
        layers: [],
        sources: {},
        version: 8,
        glyphs: 'https://fonts.undpgeohub.org/fonts/{fontstack}/{range}.pbf',
      }}
    >
      <NavigationControl showCompass={false} position="top-left" />
      {#if $mapQuery.isSuccess && $colorQuery.isSuccess && steps}
        <GeoJSONSource data={$mapQuery.data.basemap} id="VILLCODE">
          <FillLayer
            paint={{
              'fill-color': [
                'step',
                ['to-number', ['get', featureConfig.valueKey]],
                steps[1],
                ...steps,
              ],
              'fill-outline-color': '#FFFFFF',
            }}
          />
          {#key mousePosition}
            <Popup
              bind:open={showPopup}
              offset={15}
              closeOnClick={false}
              closeOnMove={false}
              closeButton={false}
              subpixelPositioning
              lnglat={mousePosition}
              ><h1 class="popup-title">
                {hoveredFeature?.properties?.[featureConfig.labelKey]}
              </h1>
              <div class="popup-group">
                <h2 class="popup-group-name">
                  {hoveredFeature?.properties?.[featureConfig.group.key]}
                </h2>
              </div>
              <hr class="popup-separator" />
              <p class="popup-description">
                {textTemplate(
                  hoveredFeature?.properties ?? {},
                  featureConfig.descriptionTemplate
                )}
              </p>
            </Popup>
          {/key}
        </GeoJSONSource>
        <GeoJSONSource data={$mapQuery.data.groupMap} id="TOWNCODE">
          <LineLayer
            paint={{
              'line-color': '#fff',
              'line-width': 2.5,
            }}
          />
          <SymbolLayer
            layout={{
              'text-field': ['get', 'TOWNNAME'],
              'text-variable-anchor': ['center'],
              'text-justify': 'auto',
              'text-size': 11,
              'text-font': ['Noto Sans Bold'],
            }}
            paint={{
              'text-color': '#fff',
              'text-halo-color': '#333333CC',
              'text-halo-width': 1,
              'text-halo-blur': 0.5,
            }}
          />
        </GeoJSONSource>
      {/if}
    </MapLibre>
  </Content>
  <Footer footnotes={footnotes ?? []} />
</Base>

<style>
  :global(.map) {
    width: 550px;
    height: 500px;
  }

  .legends {
    display: flex;
    flex-direction: column;
    padding: 15px 0 8px 0;
    gap: 5px;
    justify-content: center;
    align-items: center;
  }
  .legend-titles {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .legend-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .legend-label {
    font-size: 14px;
    color: #404040;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .legend-single-wrapper {
    display: flex;
    flex-direction: column;
  }
  .agree {
    border-color: #666;
    border-width: 0 0 0 1px;
  }
  .disagree {
    border-color: #666;
    border-width: 0 1px 0 0;
    align-items: flex-end;
  }
  .tied {
    align-items: center;
  }

  .legend-number {
    font-size: 12px;
    color: #666;
    line-height: 1;
    font-weight: 400;
    padding: 2px 3px 0px 3px;
  }

  :global(.maplibregl-popup-content) {
    border-radius: 5px;
    padding: 4px 8px 6px 8px;
    line-height: 1;
    background-color: #ffffffcc;
  }
  :global(.maplibregl-canvas-container.maplibregl-interactive) {
    z-index: 5;
    cursor: default;
  }
  .popup-title {
    font-size: 16px;
    font-weight: 700;
    margin: 5px 0;
  }
  .popup-group {
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin: 7px 0 0 0;
    align-items: flex-end;
  }

  .popup-group-name {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  .popup-separator {
    border: 0;
    height: 1px;
    background-color: #66666640;
    margin: 7px 0 5px 0;
  }
  .popup-description {
    font-size: 12px;
    font-weight: 500;
    margin: 0;
    color: #666;
    white-space: pre-wrap;
    line-height: 1.45;
  }

  .stamp {
    position: absolute;
    width: 80px;
    height: 80px;
    transform: rotate(10deg);
    z-index: 10;
  }

  .continuous-legend {
    width: 80px;
    height: 20px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
</style>
