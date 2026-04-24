<script lang="ts">
  import { scaleSqrt } from 'd3'
  import cloud from 'd3-cloud'

  import { createQuery } from '@tanstack/svelte-query'
  import { colorScale, type Word } from '../wordcloud'

  let {
    src,
    ratio = 1,
    text,
    baseColor,
  }: {
    src: string
    ratio?: number
    text?: {
      minSize?: number
      maxSize?: number
    }
    baseColor?: { hue?: number; saturation?: number; lightness?: number }
  } = $props()

  let containerWidth = $state(0)
  let computedTokens = $state<cloud.Word[]>()

  const config = $derived({
    text: {
      minSize: 8,
      maxSize: 48,
      ...text,
    },
    baseColor: {
      hue: 35,
      saturation: 65,
      lightness: 85,
      ...baseColor,
    },
  })

  const wordQuery = createQuery(() => ({
    queryKey: ['words', src],
    queryFn: async () => {
      const response = await fetch(src)
      if (!response.ok) {
        throw new Error('Failed to fetch words')
      }

      return (await response.json()) as Word[]
    },
  }))

  const words = $derived(wordQuery.data)
  const width = $derived(Math.max(containerWidth, 1))
  const height = $derived(Math.max(width / ratio, 1))

  function getColor(size: number | undefined) {
    if (!size) return '#ccc'

    const scale = scaleSqrt()
      .domain([config.text.minSize, config.text.maxSize])
      .range([0, 1])
    const factor = scale(size)
    return colorScale({
      factor,
      hue: config.baseColor.hue,
      saturation: config.baseColor.saturation,
      lightness: config.baseColor.lightness,
    })
  }

  $effect(() => {
    if (!words) return

    const tokens = words.map((word) => ({
      text: word.token,
      count: parseInt(word.count),
    }))

    const counts = tokens.map((token) => token.count)
    const domain = [Math.min(...counts), Math.max(...counts)]
    const scale = scaleSqrt()
      .domain(domain)
      .range([config.text.minSize, config.text.maxSize])

    cloud()
      .size([width, height])
      .words(
        tokens.map((t) => ({
          text: t.text,
          size: scale(t.count),
        })),
      )
      .padding(2)
      .rotate(0)
      .fontSize((d) => d.size ?? 0)
      .on('end', (result) => {
        computedTokens = result
      })
      .start()
  })
</script>

<div
  class="wordcloud"
  bind:clientWidth={containerWidth}
  style={`--aspect-ratio: ${ratio}`}
>
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio="xMinYMin"
  >
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {#each computedTokens as word (word.text)}
        <text
          font-size={`${word.size}px`}
          text-anchor="middle"
          transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
          fill={getColor(word.size)}
        >
          {word.text}
        </text>
      {/each}
    </g>
  </svg>
  {#if wordQuery.isLoading}
    <img
      src="https://www.twreporter.org/images/spinner-logo.gif"
      alt="Loading..."
      class="loading-spinner"
    />
  {/if}
</div>

<style>
  .wordcloud {
    position: relative;
    width: 100%;
    aspect-ratio: var(--aspect-ratio);
  }

  .loading-spinner {
    --size: 80px;

    position: absolute;
    inset: 0;
    margin: auto;
    width: var(--size);
    height: var(--size);
  }
</style>
