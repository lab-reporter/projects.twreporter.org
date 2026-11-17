<script lang="ts">
  import { untrack, type Snippet } from 'svelte'
  import {
    CalibrationViewport,
    type ViewportBounds,
    type ViewportMarker,
    type ViewportPoint,
    type ViewportView,
  } from './viewport.svelte.ts'

  const {
    label,
    bounds,
    markers,
    selected,
    triangles = [],
    image,
    background,
    probe,
    focus,
    focusSpan,
    rotation = 0,
    onpick,
    onselect,
    onhover,
  }: {
    label: string
    bounds: ViewportBounds
    markers: ViewportMarker[]
    selected?: number
    triangles?: string[]
    image?: string
    background?: Snippet<[ViewportView]>
    probe?: ViewportPoint
    focus?: ViewportPoint
    focusSpan: number
    rotation?: number
    onpick: (point: ViewportPoint) => void
    onselect: (index: number) => void
    onhover?: (point: ViewportPoint | undefined) => void
  } = $props()
  const viewport = new CalibrationViewport(
    () => bounds,
    () => rotation,
  )
  $effect(() => {
    const point = focus
    if (point) untrack(() => viewport.focus(point, focusSpan))
  })
</script>

<div class="viewport">
  {#if background}{@render background(viewport.view)}{/if}
  <svg use:viewport.mount role="group" aria-label={label}>
    <g transform={`${viewport.transform.toString()} rotate(${rotation})`}>
      {#if image}
        <image
          href={image}
          x={bounds.minX}
          y={bounds.minY}
          width={bounds.maxX - bounds.minX}
          height={bounds.maxY - bounds.minY}
          preserveAspectRatio="none"
        />
      {/if}
      {#each triangles as triangle}
        <path
          d={triangle}
          fill="none"
          stroke="#00e5ff"
          stroke-width={1 / viewport.transform.k}
          opacity="0.55"
        />
      {/each}
    </g>
    <rect
      width="100%"
      height="100%"
      fill="transparent"
      role="button"
      aria-label={`Pick a landmark in ${label}`}
      tabindex="0"
      onclick={(event) => {
        if (!event.defaultPrevented)
          onpick(viewport.point(event.clientX, event.clientY))
      }}
      onpointermove={(event) =>
        onhover?.(viewport.point(event.clientX, event.clientY))}
      onpointerleave={() => onhover?.(undefined)}
      onkeydown={(event) => {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault()
          viewport.scale(1.5)
        }
        if (event.key === '-') {
          event.preventDefault()
          viewport.scale(1 / 1.5)
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          onpick(
            viewport.point(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
            ),
          )
        }
      }}
    />
    <g transform={`${viewport.transform.toString()} rotate(${rotation})`}>
      {#each markers as marker (marker.index)}
        <g
          transform={`translate(${marker.x},${marker.y}) scale(${1 / viewport.transform.k}) rotate(${-rotation})`}
          role="button"
          tabindex="0"
          aria-label={`Select reference ${marker.index + 1}: ${marker.label}`}
          onpointerdown={(event) => event.stopPropagation()}
          onclick={(event) => {
            event.stopPropagation()
            onselect(marker.index)
          }}
          onkeydown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              onselect(marker.index)
            }
          }}
        >
          <circle
            r={selected === marker.index ? 8 : 5}
            fill={selected === marker.index ? '#ffb000' : '#1565c0'}
            stroke="white"
            stroke-width="1.5"
          />
          <text
            x="10"
            y="-9"
            fill="white"
            stroke="#111"
            stroke-width="3"
            paint-order="stroke"
            font-size="12">{marker.index + 1}</text
          >
          <title>{marker.label}</title>
        </g>
      {/each}
      {#if probe}
        <g
          transform={`translate(${probe.x},${probe.y}) scale(${1 / viewport.transform.k}) rotate(${-rotation})`}
          stroke="#ff1744"
          stroke-width="2"
          pointer-events="none"
        >
          <path d="M-12 0H12M0 -12V12" />
          <circle r="6" fill="none" />
        </g>
      {/if}
    </g>
  </svg>
  <div class="controls" aria-label={`${label} navigation`}>
    <button
      type="button"
      onclick={() => viewport.scale(1.5)}
      aria-label={`Zoom in ${label}`}>+</button
    >
    <button
      type="button"
      onclick={() => viewport.scale(1 / 1.5)}
      aria-label={`Zoom out ${label}`}>−</button
    >
    <button type="button" onclick={() => viewport.fit()}>Fit</button>
  </div>
  <span class="label">{label}</span>
</div>

<style>
  .viewport {
    position: relative;
    height: 56vh;
    min-height: 360px;
    overflow: hidden;
    background: #182126;
    border: 1px solid #ccd2d6;
    border-radius: 6px;
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
    cursor: crosshair;
  }
  .controls {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    gap: 4px;
  }
  button {
    padding: 6px 12px;
    border: 1px solid #bbb;
    border-radius: 4px;
    background: white;
    color: #182126;
    cursor: pointer;
  }
  .label {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    background: #182126cc;
    color: white;
    pointer-events: none;
  }
</style>
