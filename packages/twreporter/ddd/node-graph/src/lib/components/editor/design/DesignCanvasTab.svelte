<script lang="ts">
  import SidebarCard from '../../ui/sidebar/SidebarCard.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { ConvexField } from '@/lib/features/use-convex-field.svelte'
  import type { CanvasMetadata } from '../types'

  type CanvasFields = {
    [K in keyof CanvasMetadata]: ConvexField<CanvasMetadata[K]>
  }

  let {
    fields,
    error,
  }: {
    fields: CanvasFields
    error?: string | null
  } = $props()
</script>

<SidebarSection title="畫布">
  <SidebarColorInput label="背景" bind:value={fields.backgroundColor.value} />

  <SidebarCard title="標題">
    <input type="text" bind:value={fields.title.value} />
  </SidebarCard>

  <SidebarCard title="副標題">
    <textarea rows="3" bind:value={fields.description.value}></textarea>
  </SidebarCard>

  <SidebarCard title="註腳">
    <textarea rows="4" bind:value={fields.footnotes.value}></textarea>
  </SidebarCard>

  {#if error}<p class="error">{error}</p>{/if}
</SidebarSection>

<style>
  input,
  textarea {
    width: 100%;
    min-width: 0;
    border: 0;
    border-radius: 4px;
    background: var(--neutral-gray-50);
    color: var(--neutral-gray-800);
    box-sizing: border-box;
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 14px;
    line-height: 1.45;
  }

  input {
    min-height: 32px;
    padding: 6px 8px;
  }

  textarea {
    resize: vertical;
    padding: 7px 8px;
  }

  .error {
    margin: 0;
    color: #b42318;
    font-size: 12px;
    line-height: 1.4;
  }
</style>
