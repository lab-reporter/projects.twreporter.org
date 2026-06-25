<script lang="ts">
  import Button from '@/lib/components/ui/Button.svelte'
  import SidebarCard from '@/lib/components/ui/sidebar/SidebarCard.svelte'
  import SidebarSection from '@/lib/components/ui/sidebar/SidebarSection.svelte'
  import { createEmptyDesignForm } from '@/lib/features/editor/graph/form'
  import { navigate, route } from '@/routes/router'
  import { useConvexClient } from 'convex-svelte'
  import type { FunctionReturnType } from 'convex/server'
  import { toast } from 'svelte-sonner'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import { getCanvasContext } from '../../canvas/CanvasState.svelte'
  import EmptyState from '../../ui/EmptyState.svelte'

  type Designs = FunctionReturnType<typeof api.designs.listDesignsForGraph>

  let {
    designs,
  }: {
    designs: Designs
  } = $props()

  const convex = useConvexClient()
  const canvasState = getCanvasContext()
  let designForm = $state(createEmptyDesignForm())
  const graphId = route.params.graphId as Id<'graphs'>
</script>

<div class="tab-body">
  <SidebarSection title="建立設計">
    <SidebarCard>
      <span>已選 {canvasState.selectedItems.length} 個節點</span>
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
        onclick={async () => {
          const title = designForm.title.trim()
          if (!title) return

          const selectedNodeIds = canvasState.selectedItems.map(
            (item) => item.id,
          ) as Id<'nodes'>[]

          try {
            const designId = await convex.mutation(api.designs.createDesign, {
              graphId,
              title,
              description: designForm.description.trim() || undefined,
            })

            if (selectedNodeIds.length > 0) {
              await convex.mutation(api.designs.addNodesToDesign, {
                designId,
                nodeIds: selectedNodeIds,
              })
            }

            navigate('/graphs/:graphId/designs/:designId', {
              params: {
                graphId,
                designId,
              },
            })
          } catch {
            toast.error('無法建立設計')
          }
        }}
      >
        建立
      </Button>
      <Button variant="outlined" onclick={() => canvasState.clearSelections()}
        >清除</Button
      >
    </div>
  </SidebarSection>

  <SidebarSection title="既有設計">
    {#if !designs || designs.length === 0}
      <EmptyState message="尚無設計" />
    {:else}
      <div class="design-list">
        {#each designs as design (design._id)}
          <button
            class="design-link"
            type="button"
            onclick={() => {
              canvasState.clearSelections()
              navigate('/graphs/:graphId/designs/:designId', {
                params: {
                  graphId,
                  designId: design._id,
                },
              })
            }}
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
</style>
