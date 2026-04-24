<script lang="ts">
  import { domToPng } from 'modern-screenshot'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import type { Snippet } from 'svelte'

  let container: HTMLDivElement | null = $state(null)

  // 使用 `?download` 檢查是否要開啟下載選項
  const urlParams = new URLSearchParams(window.location.search)
  const showDownload = urlParams.has('download')

  const {
    name,
    children,
    footnotes,
  }: {
    name: string
    footnotes: string[]
    children: Snippet
  } = $props()

  const queryClient = new QueryClient()
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>

<QueryClientProvider client={queryClient}>
  <div class="outer">
    <div class="container" bind:this={container}>
      <div class="header">
        <h1>{name}</h1>
      </div>

      {@render children()}
      <div class="footer">
        <div class="footnotes">
          {#each footnotes as footnote}
            <p>{footnote}</p>
          {/each}
        </div>
        <img
          src="https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/assets/logo-black.png"
          class="logo"
          alt="報導者 The Reporter"
        />
      </div>
    </div>

    {#if showDownload}
      <div class="download-control">
        <button
          class="dl-button"
          onclick={() =>
            container &&
            domToPng(container, {
              quality: 1,
              scale: 3,
            }).then((dataUrl) => {
              const a = document.createElement('a')
              a.href = dataUrl
              a.download = `${name ?? '圖表'}／報導者.png`
              a.click()
            })}>下載 PNG</button
        >
      </div>
    {/if}
  </div>
</QueryClientProvider>

<style>
  * {
    /* 報導者 Library */
    --brand-faded: rgba(244, 198, 198, 1);
    --brand-pastel: rgba(247, 105, 119, 1);
    --brand-main: rgba(248, 11, 40, 1);
    --brand-heavy: rgba(196, 13, 35, 1);
    --brand-dark: rgba(155, 5, 30, 1);
    --neutral-white: rgba(255, 255, 255, 1);
    --neutral-gray-100: rgba(241, 241, 241, 1);
    --neutral-gray-200: rgba(226, 226, 226, 1);
    --neutral-gray-300: rgba(205, 205, 205, 1);
    --neutral-gray-400: rgba(187, 187, 187, 1);
    --neutral-gray-500: rgba(156, 156, 156, 1);
    --neutral-gray-600: rgba(128, 128, 128, 1);
    --neutral-gray-700: rgba(102, 102, 102, 1);
    --neutral-gray-800: rgba(64, 64, 64, 1);
    --neutral-gray-900: rgba(38, 38, 38, 1);
    --neutral-black: rgba(0, 0, 0, 1);
    --supportive-faded: rgba(240, 213, 190, 1);
    --supportive-pastel: rgba(227, 190, 152, 1);
    --supportive-main: rgba(192, 150, 98, 1);
    --supportive-heavy: rgba(159, 117, 68, 1);
    --supportive-dark: rgba(122, 82, 44, 1);
    --podcast-faded: rgba(196, 242, 220, 1);
    --podcast-pastel: rgba(153, 236, 201, 1);
    --podcast-main: rgba(110, 229, 181, 1);
    --podcast-heavy: rgba(60, 146, 122, 1);
    --podcast-dark: rgba(14, 53, 50, 1);
    --photography-faded: rgba(171, 222, 244, 1);
    --photography-pastel: rgba(109, 155, 224, 1);
    --photography-main: rgba(47, 88, 204, 1);
    --photography-heavy: rgba(20, 48, 113, 1);
    --photography-dark: rgba(5, 33, 66, 1);
    --kids-red: rgba(255, 93, 116, 1);
    --kids-yellow: rgba(255, 189, 0, 1);
    --kids-blue: rgba(39, 179, 245, 1);

    /* 專題圖表製作 */
    --chart-earth-1: rgba(241, 231, 223, 1);
    --chart-earth-2: rgba(240, 213, 190, 1);
    --chart-earth-3: rgba(212, 169, 110, 1);
    --chart-earth-4: rgba(156, 117, 70, 1);
    --chart-earth-5: rgba(123, 83, 45, 1);
    --chart-patina-1: rgba(222, 231, 222, 1);
    --chart-patina-2: rgba(199, 209, 199, 1);
    --chart-patina-3: rgba(142, 161, 151, 1);
    --chart-patina-4: rgba(93, 111, 110, 1);
    --chart-patina-5: rgba(66, 79, 79, 1);
    --chart-purple-1: rgba(235, 221, 240, 1);
    --chart-purple-2: rgba(208, 182, 217, 1);
    --chart-purple-3: rgba(162, 125, 180, 1);
    --chart-purple-4: rgba(119, 81, 138, 1);
    --chart-purple-5: rgba(97, 71, 102, 1);
    --chart-olive-1: rgba(231, 233, 208, 1);
    --chart-olive-2: rgba(215, 217, 154, 1);
    --chart-olive-3: rgba(178, 181, 99, 1);
    --chart-olive-4: rgba(121, 125, 69, 1);
    --chart-olive-5: rgba(94, 94, 54, 1);
    --chart-indigo-1: rgba(223, 223, 241, 1);
    --chart-indigo-2: rgba(201, 201, 237, 1);
    --chart-indigo-3: rgba(140, 141, 212, 1);
    --chart-indigo-4: rgba(102, 100, 170, 1);
    --chart-indigo-5: rgba(70, 62, 114, 1);
    --chart-red-1: rgba(245, 224, 225, 1);
    --chart-red-2: rgba(245, 191, 196, 1);
    --chart-red-3: rgba(226, 126, 133, 1);
    --chart-red-4: rgba(161, 83, 84, 1);
    --chart-red-5: rgba(105, 57, 60, 1);
    --chart-blue-1: rgba(218, 230, 237, 1);
    --chart-blue-2: rgba(190, 212, 234, 1);
    --chart-blue-3: rgba(135, 169, 212, 1);
    --chart-blue-4: rgba(81, 115, 153, 1);
    --chart-blue-5: rgba(56, 74, 98, 1);
    --chart-gray-1: rgba(232, 227, 227, 1);
    --chart-gray-2: rgba(209, 205, 205, 1);
    --chart-gray-3: rgba(170, 165, 165, 1);
    --chart-gray-4: rgba(107, 104, 104, 1);
    --chart-gray-5: rgba(70, 66, 66, 1);
  }

  * {
    --text-xs: 14px;
    --text-s: 16px;
    --text-m: 18px;
    --text-l: 24px;
    --text-xl: 28px;
    --text-xl-leading: 1.1;

    @media (max-width: 480px) {
      --text-l: 18px;
      --text-xl: 22px;
    }
  }

  * {
    --text-color: var(--neutral-gray-800);
    --backgrouond-color: var(--neutral-white);

    color: var(--text-color);

    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }

  .outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 60px 0;
  }

  .container {
    max-width: 730px;
    width: 100%;
    position: relative;
    padding: 20px;
    background: var(--backgrouond-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .header {
    display: flex;
    align-items: end;
    justify-content: space-between;
  }

  .header h1 {
    white-space: pre-wrap;
    font-size: var(--text-xl);
    line-height: var(--text-xl-leading);
    font-weight: 700;
  }

  .footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }

  .footnotes {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .footnotes p {
    font-size: var(--text-s);
    font-weight: 400;
    color: var(--neutral-gray-600);
  }

  .logo {
    width: 29px;
    height: 31px;
  }

  .download-control {
    margin-top: 12px;
  }

  .dl-button {
    padding: 5px 15px;
    background-color: #404040;
    color: white;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 5px;
  }
</style>
