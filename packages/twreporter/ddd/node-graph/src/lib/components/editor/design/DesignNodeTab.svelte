<script lang="ts">
  import SidebarCheckboxRow from '../../ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { NodeStyle } from '../types'

  let {
    nodeStyle = $bindable(),
    oncommit,
    error,
  }: {
    nodeStyle: NodeStyle
    oncommit: () => void
    error?: string | null
  } = $props()
</script>

<SidebarSection title="節點">
  <SidebarColorInput
    label="背景"
    bind:value={nodeStyle.backgroundColor}
    onchange={oncommit}
  />
  <SidebarColorInput
    label="邊框"
    bind:value={nodeStyle.borderColor}
    onchange={oncommit}
  />
  <SidebarColorInput
    label="文字"
    bind:value={nodeStyle.textColor}
    onchange={oncommit}
  />
  <SidebarColorInput
    label="描述背景"
    bind:value={nodeStyle.descriptionBackgroundColor}
    onchange={oncommit}
  />
  <SidebarColorInput
    label="描述文字"
    bind:value={nodeStyle.descriptionTextColor}
    onchange={oncommit}
  />

  <button
    class="checkbox-button"
    type="button"
    onclick={() => {
      nodeStyle.descriptionDefaultOpen = !nodeStyle.descriptionDefaultOpen
      oncommit()
    }}
  >
    <SidebarCheckboxRow
      label="預設開啟描述"
      checked={nodeStyle.descriptionDefaultOpen}
    />
  </button>

  {#if error}<p class="error">{error}</p>{/if}
</SidebarSection>

<style>
  .checkbox-button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: inherit;
  }

  .error {
    margin: 0;
    color: #b42318;
    font-size: 12px;
    line-height: 1.4;
  }
</style>
