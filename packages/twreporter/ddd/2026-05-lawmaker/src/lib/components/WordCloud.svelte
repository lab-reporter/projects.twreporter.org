<script lang="ts">
  import { scaleSqrt } from 'd3'
  import cloud from 'd3-cloud'

  import { createQuery } from '@tanstack/svelte-query'
  import { colorScale, type Word } from '../wordcloud'

  let {
    src,
    width = 500,
    height = 500,
    minSize = 12,
    maxSize = 96,
  }: {
    src: string
    width?: number
    height?: number
    minSize?: number
    maxSize?: number
  } = $props()

  let computedTokens = $state<cloud.Word[]>()

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

  function getColor(size: number | undefined) {
    if (!size) return '#ccc'

    const scale = scaleSqrt().domain([minSize, maxSize]).range([0, 1])
    const factor = scale(size)
    return colorScale({ factor, hue: 35, saturation: 70, lightness: 85 })
  }

  $effect(() => {
    if (!words) return

    const tokens = words.map((word) => ({
      text: word.token,
      count: parseInt(word.count),
    }))

    const counts = tokens.map((token) => token.count)
    const domain = [Math.min(...counts), Math.max(...counts)]
    const scale = scaleSqrt().domain(domain).range([minSize, maxSize])

    cloud()
      .size([width, height])
      .words(
        tokens.map((t) => ({
          text: t.text,
          size: scale(t.count),
        })),
      )
      .padding(3)
      .rotate(0)
      .fontSize((d) => d.size ?? 0)
      .on('end', (result) => {
        computedTokens = result
      })
      .start()
  })
</script>

<div class="wordcloud">
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${height} ${width}`}
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
  }

  .loading-spinner {
    --size: 80px;

    position: absolute;
    inset: 0;
    margin: auto;
    width: var(--size);
    height: var(--sizez);
  }
</style>
