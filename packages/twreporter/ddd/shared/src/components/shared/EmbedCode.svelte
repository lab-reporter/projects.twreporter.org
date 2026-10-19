<script lang="ts">
  import { generateAssetUrls } from '../../utils/asset-urls.ts'
  import type { ComponentProps } from '../types.ts'
  import TextAreaCopy from './TextAreaCopy.svelte'

  const {
    componentName,
    tagName,
    src,
    config,
  }: ComponentProps & {
    componentName: string
    tagName?: string
  } = $props()
  const { embedCode, schemaUrl, storybookIFrameUrl } = $derived(
    generateAssetUrls(componentName, { src, config }, tagName),
  )
  let status = $state('')
</script>

<div class="embed-code-container">
  <TextAreaCopy code={embedCode} label="Embed Code" />
  <TextAreaCopy code={schemaUrl} label="Schema URL" />
  <TextAreaCopy code={storybookIFrameUrl} label="Preview iFrame URL" />
</div>

<style>
  .embed-code-container {
    margin-top: 5px;
    padding: 30px 0;
    border-top: 1px #888 solid;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
