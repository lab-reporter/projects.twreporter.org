<script lang="ts">
  import type { ConvexField } from '@/lib/features/use-convex-field.svelte'
  import SidebarCard from '../../ui/sidebar/SidebarCard.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { CanvasMetadata } from '../types'

  type CanvasFields = {
    [K in keyof CanvasMetadata]: ConvexField<CanvasMetadata[K]>
  }

  let {
    fields,
  }: {
    fields: CanvasFields
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
</SidebarSection>

<SidebarSection title="圖例">
  {#each fields.legends.value as legend, index (legend.id)}
    <SidebarColorInput
      label={legend.label}
      bind:value={
        () => legend.label,
        (newLabel) => {
          fields.legends.value = [
            ...(fields.legends.value ?? []).filter(
              (l) => l.label !== legend.label,
            ),
            {
              ...legend,
              label: newLabel,
            },
          ]
        }
      }
      bind:color={
        () => legend.color,
        (newColor) => {
          fields.legends.value = [
            ...(fields.legends.value ?? []).filter(
              (l) => l.color !== legend.color,
            ),
            {
              ...legend,
              color: newColor,
            },
          ]
        }
      }
    />
    <button
      onclick={() => {
        fields.legends.value = fields.legends.value?.filter(
          (l) => l.id !== legend.id,
        )
      }}>刪除</button
    >
  {/each}
  <button
    onclick={() => {
      fields.legends.value = [
        ...(fields.legends.value ?? []),
        {
          id: new Date().getTime().toString(),
          color: '#fafafa',
          label: '圖例',
        },
      ]
    }}>新增</button
  >
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
</style>
