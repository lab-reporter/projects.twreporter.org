<script lang="ts">
  import { localStore } from '@/lib/features/local-store.svelte'
  import Layout from '../routes/layout.svelte'

  let inputHtml = localStore('preview-embed-code-input', '')
</script>

<Layout>
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
  h1 {
    font-size: var(--text-l);
    font-weight: 700;
  }

  .layout {
    padding: 20px;
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
  }

  .preview {
    width: 100%;
  }
</style>
