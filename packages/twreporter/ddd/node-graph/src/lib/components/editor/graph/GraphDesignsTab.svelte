<script lang="ts">
  import { canvasState } from '@/lib/components/canvas/state.svelte'
  import Button from '@/lib/components/ui/Button.svelte'
  import SidebarCard from '@/lib/components/ui/sidebar/SidebarCard.svelte'
  import SidebarCheckboxRow from '@/lib/components/ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarSection from '@/lib/components/ui/sidebar/SidebarSection.svelte'
  import type { Id } from '~convex/dataModel'

  type DesignForm = {
    title: string
    description: string
  }
  type DesignListItem = {
    _id: Id<'designs'>
    title: string
  }

  let {
    designForm = $bindable(),
    designs,
    creatingDesign,
    onsubmit,
    onopen,
  }: {
    designForm: DesignForm
    designs: DesignListItem[]
    creatingDesign: boolean
    onsubmit: () => void
    onopen: (designId: Id<'designs'>) => void
  } = $props()
</script>

<div class="tab-body">
  <SidebarSection title="建立設計">
    <button
      class="toggle-row"
      type="button"
      onclick={() => {
        canvasState.selectionMode = !canvasState.selectionMode
      }}
    >
      <SidebarCheckboxRow
        label="選取節點"
        checked={canvasState.selectionMode}
      />
    </button>
    <SidebarCard>
      <span>已選 {canvasState.selectedNodeIds.length} 個節點</span>
    </SidebarCard>
    <div class="field">
      <label for="design-title">標題</label>
      <input id="design-title" bind:value={designForm.title} />
    </div>
    <div class="field">
      <label for="design-description">描述</label>
      <textarea id="design-description" bind:value={designForm.description}
      ></textarea>
    </div>
    <div class="actions">
      <Button
        variant="filled"
        disabled={creatingDesign || canvasState.selectedNodeIds.length === 0}
        onclick={onsubmit}
      >
        建立
      </Button>
      <Button
        variant="outlined"
        onclick={() => {
          canvasState.selectedItem = null
          canvasState.selectedNodeIds = []
        }}
      >
        清除
      </Button>
    </div>
  </SidebarSection>

  <SidebarSection title="既有設計">
    {#if designs.length === 0}
      <p class="state-text">尚無設計</p>
    {:else}
      <div class="design-list">
        {#each designs as design (design._id)}
          <button
            class="design-link"
            type="button"
            onclick={() => onopen(design._id)}
          >
            {design.title}
          </button>
        {/each}
      </div>
    {/if}
  </SidebarSection>
</div>

<style>
  .tab-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--neutral-gray-800);
    font-size: 13px;
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    min-height: 34px;
    border: 1px solid var(--neutral-gray-300);
    border-radius: 4px;
    padding: 7px 9px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    font: inherit;
    box-sizing: border-box;
  }

  textarea {
    min-height: 74px;
    resize: vertical;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .toggle-row {
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: inherit;
  }

  .design-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .design-link {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--neutral-gray-800);
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .design-link:hover {
    background: var(--neutral-gray-100);
  }

  .state-text {
    margin: 0;
    color: var(--neutral-gray-500);
    font-size: 12px;
  }
</style>
