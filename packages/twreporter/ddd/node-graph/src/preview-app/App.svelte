<script lang="ts">
  import { localStore } from '@/lib/features/local-store.svelte'
  import Layout from '../routes/layout.svelte'

  let inputHtml = localStore('preview-embed-code-input', '')
</script>

<Layout --overflow="scroll" --height="fit-content">
  <div class="layout">
    <h1>Embed Code 測試預覽頁</h1>

    <p>請在此貼上圖表工具產生的 Embed Code</p>
    <textarea bind:value={inputHtml.value}></textarea>

    <div class="preview">
      {@html inputHtml.value}
    </div>
  </div>
</Layout>

<style>
  /* Simulating article page layout, see packages/twreporter/ddd/shared/embed.css */
  :root {
    --body-width: calc(300 / 375 * 100%);
  }

  @media (max-width: 767px) {
    :root {
      --body-width: 93.2vw;
    }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    :root {
      --body-width: 512px;
    }
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    :root {
      --body-width: 550px;
    }
  }

  @media (min-width: 1440px) {
    :root {
      --body-width: 730px;
    }
  }

  h1 {
    font-size: var(--text-l);
    font-weight: 700;
  }

  .layout {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    gap: 15px;
  }

  textarea {
    width: 500px;
    height: 100px;
  }

  .preview {
    width: var(--body-width);
    padding: 100px 0;
    margin: 0 auto;
    margin-bottom: 500px;
    outline: 1px solid var(--neutral-gray-300);
  }
</style>
