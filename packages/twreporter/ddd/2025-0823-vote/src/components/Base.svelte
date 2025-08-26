<script lang="ts">
  import { domToPng } from 'modern-screenshot'
  import { styleOptions } from '../lib/constants/styles'
  import Card from './card/Card.svelte'

  let container: HTMLDivElement | null = null

  // 使用 `?download` 檢查是否要開啟下載選項
  const urlParams = new URLSearchParams(window.location.search)
  const showDownload = urlParams.has('download')

  let innerWidth = $state<number>(window.innerWidth)

  let {
    title,
    loading = $bindable(false),
  }: { title?: string; loading?: boolean } = $props()
  let card = $state<HTMLDivElement | null>(null)

  let scale = $derived(styleOptions.getScale(innerWidth)) // 寬度不等於 600px 時，皆使用等比例縮放
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>
<div class="outer" bind:clientWidth={innerWidth}>
  <div
    bind:this={container}
    style:width={styleOptions.width * scale + 'px'}
    style:height={styleOptions.height * scale + 'px'}
  >
    <Card bind:card bind:loading bind:scale>
      <slot />
    </Card>
  </div>
</div>

{#if showDownload}
  <div class="download-control">
    <p>
      視窗寬度：{innerWidth}px（下載前請拉寬到超過730px）
    </p>
    <button
      class="dl-button"
      onclick={() =>
        container &&
        domToPng(container, {
          quality: 1,
          width: styleOptions.width * scale,
          scale: 3,
        }).then((dataUrl) => {
          const a = document.createElement('a')
          a.href = dataUrl
          a.download = `${title ?? '圖表'}／報導者.png`
          a.click()
        })}>下載 PNG</button
    >
  </div>
{/if}

<style>
  :global(*) {
    --tr-text: #404040;
    color: var(--tr-text);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }

  :global(.maplibregl-control-container) {
    opacity: 0;
  }

  :global(.maplibregl-map:hover .maplibregl-control-container) {
    opacity: 1;
  }

  :global(.maplibregl-popup-tip) {
    display: none;
  }

  :global(.maplibregl-popup-content) {
    color: var(--tr-text);
    --tw-shadow: 0 0 #0000;
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow),
      var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background-color: #ffffffd1;
    border-radius: 0;
    padding: 10px;
  }

  .download-control {
    margin-top: 12px;
  }

  .dl-button {
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    padding: 5px 15px;
    background-color: #404040;
    color: white;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 5px;
  }

  .outer {
    width: 100%;
    height: 100%;
    max-width: 730px;
    max-height: 912.5px;
  }
</style>
