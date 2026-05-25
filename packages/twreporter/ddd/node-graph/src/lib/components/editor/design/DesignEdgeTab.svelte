<script lang="ts">
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { ConvexField } from '@/lib/features/use-convex-field.svelte'
  import type { EdgeStyle } from '../types'

  type EdgeStyleFields = {
    [K in keyof EdgeStyle]: ConvexField<EdgeStyle[K]>
  }

  let {
    fields,
  }: {
    fields: EdgeStyleFields
  } = $props()
</script>

<SidebarSection title="線段">
  <SidebarColorInput label="線段" bind:value={fields.strokeColor.value} />
  <SidebarColorInput label="箭頭" bind:value={fields.arrowColor.value} />
  <SidebarColorInput
    label="標籤背景"
    bind:value={fields.labelBackgroundColor.value}
  />
  <SidebarColorInput
    label="標籤文字"
    bind:value={fields.labelTextColor.value}
  />
</SidebarSection>
