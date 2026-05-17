<script lang="ts">
  import SidebarCard from '../../sidebar/SidebarCard.svelte'
  import SidebarColorInput from '../../sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../sidebar/SidebarSection.svelte'
  import type { CanvasMetadata } from '../types'

  let {
    metadata = $bindable(),
    oncommitColor,
    oncommitText,
    error,
  }: {
    metadata: CanvasMetadata
    oncommitColor: () => void
    oncommitText: () => void
    error?: string | null
  } = $props()
</script>

<SidebarSection title="畫布">
  <SidebarColorInput
    label="背景"
    bind:value={metadata.backgroundColor}
    onchange={oncommitColor}
  />

  <SidebarCard title="標題">
    <input type="text" bind:value={metadata.title} oninput={oncommitText} />
  </SidebarCard>

  <SidebarCard title="副標題">
    <textarea rows="3" bind:value={metadata.description} oninput={oncommitText}
    ></textarea>
  </SidebarCard>

  <SidebarCard title="註腳">
    <textarea rows="4" bind:value={metadata.footnotes} oninput={oncommitText}
    ></textarea>
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
