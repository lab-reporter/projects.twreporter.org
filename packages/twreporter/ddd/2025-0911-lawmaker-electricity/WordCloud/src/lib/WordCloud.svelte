<script>
  import cloud from 'd3-cloud';
  import { onMount, onDestroy } from 'svelte';

  // Props
  export let words = [];
  export let width = 320;
  export let height = 320;
  export let padding = 2;
  export let minFont = 12;
  export let maxFont = 64;
  export let randomRotate = false; // if true, words rotate either 0 or 90 degrees
  export let colH = 35;
  export let colS = 70;

  let layoutResult = [];
  let rerunTimeout;

  let minValue = 0;
  let maxValue = 1;
  function colorFor(v) {
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return '#ccc';
    if (!Number.isFinite(v)) return '#ccc';
    if (minValue === maxValue) return 'hsl(${colH}, ${colS}%, 45%)';
    const t = (v - minValue) / (maxValue - minValue);
    const lightness = 85 - t * 50;
    const saturation = t * colS;
    return `hsl(${colH}, ${saturation}%, ${lightness}%)`;
  }

  function computeScale(minVal, maxVal) {
    return function (v) {
      if (!Number.isFinite(minVal) || !Number.isFinite(maxVal)) return minFont;
      if (minVal === maxVal) return (minFont + maxFont) / 2;
      const t = (v - minVal) / (maxVal - minVal);
      return minFont + t * (maxFont - minFont);
    };
  }

  function runLayout() {
    if (!Array.isArray(words) || words.length === 0) {
      layoutResult = [];
      minValue = 0;
      maxValue = 1;
      return;
    }
    const prepared = words
      .map((w) => ({
        text: w.text ?? String(w.word ?? w.label ?? ''),
        value: Number(w.value ?? w.size ?? 1)
      }))
      .filter((w) => w.text);

    const values = prepared.map((d) => d.value);
    minValue = Math.min(...values);
    maxValue = Math.max(...values);
    const scale = computeScale(minValue, maxValue);

    const rotFn = randomRotate ? () => (Math.random() > 0.5 ? 90 : 0) : () => 0;

    const layout = cloud()
      .size([width, height])
      .words(prepared.map((d) => ({ text: d.text, size: Math.round(scale(d.value)), value: d.value })))
      .padding(padding)
      .rotate(rotFn)
      .font('sans-serif')
      .fontSize((d) => d.size)
      .on('end', (out) => {
        layoutResult = out;
      });

    layout.start();
  }

  function scheduleLayout() {
    clearTimeout(rerunTimeout);
    rerunTimeout = setTimeout(() => {
      runLayout();
    }, 0);
  }

  onMount(() => {
    runLayout();
  });

  onDestroy(() => {
    clearTimeout(rerunTimeout);
  });

  // Re-run layout when inputs change
  $: {
    words; width; height; padding; minFont; maxFont; randomRotate;
    scheduleLayout();
  }
</script>

<svg {width} {height} aria-label="Word cloud" viewBox={`0 0 ${width} ${height}`}>
  <g transform={`translate(${width / 2}, ${height / 2})`}>
    {#each layoutResult as w (w.text)}
      <text
        transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
        font-size={w.size}
        text-anchor="middle"
        fill={colorFor(w.value)}
      >{w.text}</text>
    {/each}
  </g>
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    max-width: 100%;
    display: block;
  }
  text {
    user-select: none;
    font-weight: 400;
  }
</style>
