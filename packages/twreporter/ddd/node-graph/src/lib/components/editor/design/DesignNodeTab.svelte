<script lang="ts">
  import SidebarCheckboxRow from '../../ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { ConvexField } from '@/lib/features/use-convex-field.svelte'
  import type { NodeStyle } from '../types'

  type NodeStyleFields = {
    [K in keyof NodeStyle]: ConvexField<NodeStyle[K]>
  }

  let {
    fields,
  }: {
    fields: NodeStyleFields
  } = $props()
</script>

<SidebarSection title="節點">
  <SidebarColorInput label="背景" bind:value={fields.backgroundColor.value} />
  <SidebarColorInput label="邊框" bind:value={fields.borderColor.value} />
  <SidebarColorInput label="文字" bind:value={fields.textColor.value} />
  <SidebarColorInput
    label="描述背景"
    bind:value={fields.descriptionBackgroundColor.value}
  />
  <SidebarColorInput
    label="描述文字"
    bind:value={fields.descriptionTextColor.value}
  />

  <button
    class="checkbox-button"
    type="button"
    onclick={() => {
      fields.descriptionDefaultOpen.value = !fields.descriptionDefaultOpen.value
    }}
  >
    <SidebarCheckboxRow
      label="預設開啟描述"
      checked={fields.descriptionDefaultOpen.value}
    />
  </button>
</SidebarSection>

<style>
  .checkbox-button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: inherit;
  }
</style>
