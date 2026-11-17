<script lang="ts">
  import Frame from '@lab-reporter/ddd-shared/components/shared/Frame.svelte'
  import Logo from '@lab-reporter/ddd-shared/components/shared/Logo.svelte'
  import Shell from '@lab-reporter/ddd-shared/components/shared/Shell.svelte'
  import { createGraphic } from '@lab-reporter/ddd-shared/utils/graphic-data.svelte.ts'
  import ScrollerBase from '@reuters-graphics/graphics-components/ScrollerBase'
  import { createQuery } from '@tanstack/svelte-query'
  import mapImage from '../assets/map.jpg?no-inline'
  import mapAfterImage from '../assets/map-after.jpg?no-inline'
  import mapMobileImage from '../assets/map-mobile.jpg?no-inline'
  import mapAfterMobileImage from '../assets/map-after-mobile.jpg?no-inline'
  import defaultConfig from '../../public/player-track-map.json'
  import { playerTrackMapConfigSchema } from '../lib/components/player-track-map/types.ts'
  import { PlayerTrackMapScroller } from '../lib/components/player-track-map/scroller.svelte.ts'
  import Marker from '../lib/components/player-track-map/Marker.svelte'
  import InfoBox from '../lib/components/player-track-map/InfoBox.svelte'
  import PaperCard from '../lib/components/player-track-map/PaperCard.svelte'
  import { createTrackPaths } from '../lib/components/player-track-map/track.ts'
  import {
    mapHeight,
    mapWidth,
    projectPosition,
  } from '../lib/constants/coordinate-map.ts'
  import { trackColors } from '../lib/constants/track.ts'
  import type { GetInfoBoxes, GetTrack, PlayerTrack } from '../lib/rpc.ts'

  const {
    getTrack,
    getInfoBoxes,
    config = '',
  }: {
    getTrack?: GetTrack
    getInfoBoxes?: GetInfoBoxes
    config?: string
  } = $props()
  const id = $props.id()
  const edit = new URLSearchParams(window.location.search).has('edit')
  const graphic = createGraphic(
    'twreporter-player-track',
    playerTrackMapConfigSchema,
    () => ({ src: '', config }),
  )
  const fallbackConfig = playerTrackMapConfigSchema.parse(defaultConfig)
  const mapConfig = $derived(graphic.config ?? fallbackConfig)
  const cards = $derived(mapConfig.cards)
  const scroller = new PlayerTrackMapScroller(() => cards)
  let imageWidth = $state(mapWidth)
  let imageHeight = $state(mapHeight)
  let visible = $state(false)
  const track = createQuery(() => ({
    queryKey: ['player-track', id],
    enabled: visible && !!getTrack,
    queryFn: () => {
      if (!getTrack) throw new Error('The player is not connected')
      return getTrack()
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
    retry: false,
    gcTime: 0,
  }))
  const infoBoxes = createQuery(() => ({
    queryKey: ['player-info-boxes', id],
    enabled: visible && !!getInfoBoxes,
    queryFn: () => {
      if (!getInfoBoxes) throw new Error('The player is not connected')
      return getInfoBoxes()
    },
    staleTime: Infinity,
    gcTime: 0,
  }))
  const markers = $derived(
    (infoBoxes.data ?? []).flatMap((info) => {
      const pixel = projectPosition(info)
      return pixel.u >= 0 &&
        pixel.u <= mapWidth &&
        pixel.v >= 0 &&
        pixel.v <= mapHeight
        ? [{ info, pixel }]
        : []
    }),
  )
  let selectedId: string | undefined = $state()
  const selected = $derived(
    infoBoxes.data?.find((info) => info.id === selectedId),
  )
  const paths = $derived(createTrackPaths(track.data ?? []))
  const progress = $derived(Math.max(0, Math.min(1, scroller.progress)))
  const legend = $derived.by(() => {
    const seconds = { road: 0, shoulder: 0, safe: 0 }
    let previous: PlayerTrack[number] | undefined

    for (const point of track.data ?? []) {
      if (previous?.segment === point.segment) {
        seconds[previous.kind] += point.t - previous.t
      }
      previous = point
    }

    const total = seconds.road + seconds.shoulder + seconds.safe
    const isAfter = scroller.view == 'after'

    const regions = [
      { label: '車道', color: trackColors.road, duration: seconds.road },
      {
        label: '路肩',
        color: trackColors.shoulder,
        duration: isAfter ? 0 : seconds.shoulder,
      },
      {
        label: '安全區域',
        color: trackColors.safe,
        duration: isAfter ? seconds.safe + seconds.shoulder : seconds.safe,
      },
    ]

    return regions.map(({ label, color, duration }) => ({
      label,
      color,
      percentage: total > 0 ? Math.round((duration / total) * 100) : null,
    }))
  })
</script>

{#if graphic.error || graphic.loading}
  <Shell error={graphic.error} loading={graphic.loading} />
{:else}
  <div
    class="scrolly"
    style:--map-width={imageWidth}
    style:--map-height={imageHeight}
    style:--progress={progress}
  >
    <ScrollerBase
      bind:progress={scroller.progress}
      bind:visible
      query=".scroll-space"
    >
      {#snippet backgroundSnippet()}
        <section>
          {#if visible}
            <div class="map" role="region" aria-label="上學路線地圖">
              <div class="map-frame">
                <div class="map-content">
                  <picture>
                    <source
                      media="(max-width: 767px), (max-height: 767px) and (pointer: coarse)"
                      srcset={mapMobileImage}
                    />
                    <img
                      class="map-before"
                      src={mapImage}
                      alt=""
                      decoding="async"
                      bind:naturalWidth={imageWidth}
                      bind:naturalHeight={imageHeight}
                    />
                  </picture>
                  <picture>
                    <source
                      media="(max-width: 767px), (max-height: 767px) and (pointer: coarse)"
                      srcset={mapAfterMobileImage}
                    />
                    <img
                      class="map-after"
                      class:visible={scroller.view === 'after'}
                      src={mapAfterImage}
                      alt=""
                      decoding="async"
                    />
                  </picture>
                  <svg
                    class="route"
                    class:clipped={scroller.clipRoutes}
                    viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                    preserveAspectRatio="none"
                    role="img"
                  >
                    {#each paths as path}
                      <path
                        d={path.d}
                        fill="none"
                        stroke="var(--map-panel)"
                        stroke-width="9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        vector-effect="non-scaling-stroke"
                      />
                    {/each}
                    {#each paths as path}
                      <path
                        d={path.d}
                        fill="none"
                        stroke={trackColors[
                          scroller.view === 'after' && path.kind === 'shoulder'
                            ? 'safe'
                            : path.kind
                        ]}
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        vector-effect="non-scaling-stroke"
                      />
                    {/each}
                  </svg>
                  {#each markers as { info, pixel } (info.id)}
                    <Marker
                      {info}
                      {pixel}
                      {edit}
                      selected={selectedId === info.id}
                      highlighted={scroller.highlightedMarkerIds.includes(
                        info.zoneId,
                      )}
                      infoBoxId={`${id}-info-box`}
                      onselect={() => (selectedId = info.id)}
                    />
                  {/each}
                </div>
                {#each cards as card}
                  <div
                    class="scroll-card"
                    style:--card-position={card.position}
                  >
                    <PaperCard>
                      {#if card.title}
                        <h2>{card.title}</h2>
                      {/if}
                      {#if card.text}
                        <p>{card.text}</p>
                      {/if}
                    </PaperCard>
                  </div>
                {/each}
              </div>
            </div>
            {#if selected}
              <InfoBox
                id={`${id}-info-box`}
                info={selected}
                onclose={() => (selectedId = undefined)}
              />
            {/if}
          {/if}
        </section>
      {/snippet}
      {#snippet foregroundSnippet()}
        <div class="frame-track">
          <div class="graph-frame">
            <Frame style="gap: 18px">
              {#snippet topLeft()}
                <PaperCard>
                  {#if graphic.editable}
                    <h1
                      contenteditable="plaintext-only"
                      bind:innerText={mapConfig.title}
                    ></h1>
                  {:else}
                    <h1>{mapConfig.title}</h1>
                  {/if}
                </PaperCard>
              {/snippet}
              <div class="graph-control-container">
                <div class="graph-controls">
                  <div class="legend">
                    <PaperCard>
                      <h2>通行時間占比</h2>
                      <dl>
                        {#each legend as item (item.label)}
                          <div class="legend-row">
                            <dt>
                              <span
                                class="legend-swatch"
                                style:background-color={item.color}
                                aria-hidden="true"
                              ></span>
                              {item.label}
                            </dt>
                            <dd>
                              {item.percentage === null
                                ? '未體驗'
                                : `${item.percentage}%`}
                            </dd>
                          </div>
                        {/each}
                      </dl>
                    </PaperCard>
                  </div>
                  <div class="view-tabs" role="group" aria-label="道路改善前後">
                    <PaperCard style="--paper-padding: 0">
                      <button
                        type="button"
                        aria-pressed={scroller.view === 'before'}
                        onclick={() => (scroller.view = 'before')}>現況</button
                      >
                      <button
                        type="button"
                        aria-pressed={scroller.view === 'after'}
                        onclick={() => (scroller.view = 'after')}
                        >改善建議</button
                      >
                    </PaperCard>
                  </div>
                </div>
              </div>
              {#snippet bottomLeft()}
                <div class="footnotes">
                  <PaperCard>
                    {#each mapConfig.footnotes as footnote, index}
                      {#if graphic.editable}
                        <p
                          contenteditable="plaintext-only"
                          bind:innerText={mapConfig.footnotes[index]}
                        ></p>
                      {:else}
                        <p>{footnote}</p>
                      {/if}
                    {/each}
                  </PaperCard>
                </div>
              {/snippet}
              {#snippet bottomRight()}
                <Logo />
              {/snippet}
            </Frame>
          </div>
        </div>
        <div
          class="scroll-space"
          style:height={`${(cards.length + 1) * 100}svh`}
          aria-hidden="true"
        ></div>
      {/snippet}
    </ScrollerBase>
  </div>
{/if}

<style>
  .scrolly {
    --map-panel: rgba(244, 241, 231, 0.6);
    --map-panel-border: rgba(226, 221, 207, 0.5);
    --map-text: #1f2420;
    --map-accent: #3f5a33;
    --map-muted: #6c7066;
    --map-danger: #c53f2d;
    color: var(--map-text);
    font-family: 'Noto Sans TC', sans-serif;
  }

  .scrolly * {
    text-align: start !important;
  }

  .scrolly :global(svelte-scroller-background-container) {
    pointer-events: auto;
    will-change: auto;
  }

  .scrolly :global(svelte-scroller-foreground) {
    pointer-events: none;
  }

  section {
    anchor-scope: --selected-marker;
    isolation: isolate;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100dvh;
  }

  .map {
    z-index: 0;
    overflow: clip;
    container-type: size;
    width: 100%;
    height: 100%;
    position: relative;
    touch-action: pan-y;
  }

  .scroll-card {
    position: absolute;
    top: 50%;
    left: calc(50cqw + (100% - 100cqw) * var(--card-position));
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: min(360px, calc(100cqw - 48px));
    pointer-events: auto;
  }

  .map-after {
    opacity: 0;
    transition: opacity 400ms ease;
  }

  .map-after.visible {
    opacity: 1;
  }

  .route {
    --route-viewport: 100cqw;
  }

  .route.clipped {
    clip-path: inset(
      0 0 0
        calc(
          100% - var(--route-viewport) / 2 - (100% - var(--route-viewport)) *
            var(--progress)
        )
    );
  }

  .scroll-card h2 {
    margin: 0;
    font-size: var(--text-m);
  }

  .scroll-card p {
    white-space: pre-line;
    font-size: var(--text-s);
  }

  .scroll-card h2 + p {
    margin-top: 10px;
  }

  .frame-track {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  .graph-frame {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100dvh;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 900;
    line-height: 36px;
    white-space: pre-wrap;
  }

  .footnotes {
    max-width: 100%;
  }

  .footnotes p {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: var(--map-muted);
    white-space: pre-wrap;
  }

  [contenteditable] {
    min-height: 1lh;
    pointer-events: auto;
    cursor: text;
  }

  .graph-control-container {
    flex: 1;
    min-height: 0;
  }

  .graph-controls {
    width: 100%;
    position: sticky;
    padding: 0 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 16px;
    top: 65px; /* Top bar */
  }

  .legend {
    width: max-content;
    min-width: 180px;
    flex-shrink: 0;
    font-size: var(--text-xs);
  }

  .legend h2 {
    margin: 0 0 12px;
    font-size: inherit;
    font-weight: 600;
  }

  .legend dl {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
  }

  .legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    white-space: nowrap;
  }

  .legend dt {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legend dd {
    margin: 0;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }

  .legend-swatch {
    width: 28px;
    height: 5px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .view-tabs {
    flex-shrink: 0;
  }

  .view-tabs button {
    width: 36px;
    padding: 25px 6px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 16px;
    line-height: 1;
    border-radius: 5px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    text-align: center;
    cursor: pointer;
    pointer-events: auto;
  }

  .view-tabs button + button {
    border-top: 1px solid var(--map-panel-border);
  }

  .view-tabs button[aria-pressed='true'] {
    background: var(--map-accent);
    color: var(--map-panel);
    font-weight: 600;
  }

  .view-tabs button:focus-visible {
    outline: 2px solid var(--map-accent);
    outline-offset: -3px;
  }

  .map-frame {
    position: relative;
    width: max-content;
    height: 100%;
    transform: translateX(calc((100cqw - 100%) * var(--progress)));
  }
  .map-content {
    position: relative;
    width: max-content;
    height: 100%;
    transform: rotate(180deg);
  }
  .map-before {
    display: block;
    width: auto;
    height: 100%;
    max-width: none;
  }
  .map-content picture {
    display: contents;
  }
  .map-after,
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
  }
  @media (prefers-reduced-motion: reduce) {
    .map-after {
      transition: none;
    }
  }

  @media (max-width: 767px) {
    .route {
      --route-viewport: 100cqh;
    }

    h1 {
      font-weight: 600;
    }

    .view-tabs button {
      width: 33px;
      font-size: 14px;
    }

    .graph-frame {
      position: relative;
      height: 100%;
    }

    .scroll-card {
      top: calc(50cqh + (100% - 100cqh) * var(--card-position));
      left: 50%;
    }

    .map-frame {
      width: 100%;
      height: auto;
      aspect-ratio: var(--map-height) / var(--map-width);
      overflow: clip;
      transform: translateY(calc((100cqh - 100%) * var(--progress)));
    }
    .map-content {
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% * var(--map-width) / var(--map-height));
      height: calc(100% * var(--map-height) / var(--map-width));
      transform-origin: top left;
      transform: rotate(-90deg) translateX(-100%);
    }
    .map-before {
      width: 100%;
      height: 100%;
    }
  }
</style>
