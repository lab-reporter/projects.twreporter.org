<script lang="ts">
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { SvelteSet } from 'svelte/reactivity'
  import { toast } from 'svelte-sonner'
  import { api } from '~convex/api'
  import type { Doc, Id } from '~convex/dataModel'
  import { formatDateTime } from '../../../lib/utils/date'
  import { navigate } from '../../../routes/router'
  import ActionButton from '../ui/ActionButton.svelte'
  import Badge from '../ui/Badge.svelte'
  import Loading from '../icons/Loading.svelte'
  import MaterialSymbols from '../icons/MaterialSymbols.svelte'

  type Props = {
    graph: Doc<'graphs'>
  }

  const { graph }: Props = $props()

  const convex = useConvexClient()
  let isDesignsExpanded = $state(false)
  let isDeleting = $state(false)
  const deletingDesignIds = new SvelteSet<Id<'designs'>>()

  const designList = useQuery(api.designs.listDesignsForGraph, () =>
    isDesignsExpanded ? { graphId: graph._id } : 'skip',
  )

  async function deleteGraph() {
    if (!confirm(`確定要刪除「${graph.name}」嗎？此操作無法復原！`)) return

    isDeleting = true

    try {
      await convex.mutation(api.graphs.deleteGraph, { graphId: graph._id })
      toast.success('已刪除節點圖')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '無法刪除節點圖')
    } finally {
      isDeleting = false
    }
  }

  async function deleteDesign(design: Doc<'designs'>) {
    if (!confirm(`確定要刪除「${design.title}」嗎？此操作無法復原！`)) return

    deletingDesignIds.add(design._id)

    try {
      await convex.mutation(api.designs.deleteDesign, {
        designId: design._id,
      })
      toast.success('已刪除設計')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '無法刪除設計')
    } finally {
      deletingDesignIds.delete(design._id)
    }
  }
</script>

<div class="item">
  <div class="info">
    <div class="header">
      <h1 class="graph-title">
        {graph.name}
      </h1>
      {#if graph.description}
        <p>{graph.description}</p>
      {/if}
    </div>
    <div class="meta">
      更新於 {formatDateTime(graph.updatedAt)}
    </div>
  </div>

  <div class="actions">
    <ActionButton
      label="開啟"
      onclick={() =>
        navigate('/graphs/:graphId', {
          params: { graphId: graph._id },
        })}
    >
      <MaterialSymbols name="open_in_new" />
    </ActionButton>
    <ActionButton
      label="圖表"
      disabled={isDeleting}
      onclick={() => {
        if (isDesignsExpanded) {
          isDesignsExpanded = false
        } else {
          isDesignsExpanded = true
        }
      }}
    >
      <MaterialSymbols name="design_services" />
    </ActionButton>
    <ActionButton
      label={isDeleting ? '刪除中' : '刪除'}
      disabled={isDeleting}
      onclick={deleteGraph}
    >
      <MaterialSymbols name="delete" />
    </ActionButton>
  </div>
</div>

{#if isDesignsExpanded}
  <div class="designs">
    {#if designList.isLoading}
      <Loading />
    {:else if !designList.data?.length}
      <Badge>尚無設計</Badge>
    {:else}
      {#each designList.data as design (design._id)}
        {@const isDesignDeleting = deletingDesignIds.has(design._id)}
        <div class="design-item">
          <p>{design.title}</p>
          <div class="design-actions">
            <ActionButton
              label="開啟"
              disabled={isDesignDeleting}
              onclick={() =>
                navigate('/graphs/:graphId/designs/:designId', {
                  params: {
                    graphId: design.graphId,
                    designId: design._id,
                  },
                })}
            >
              <MaterialSymbols name="open_in_new" />
            </ActionButton>
            <ActionButton
              label={isDesignDeleting ? '刪除中' : '刪除'}
              disabled={isDesignDeleting}
              onclick={() => deleteDesign(design)}
            >
              <MaterialSymbols name="delete" />
            </ActionButton>
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}

<style>
  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 0;
    border-bottom: 1px var(--neutral-gray-400) solid;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .info .header {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .info .header h1 {
    font-size: var(--text-l);
  }

  .info .meta {
    color: var(--neutral-gray-500);
  }

  .designs {
    padding: 10px 0;
    margin-left: 20px;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .designs .design-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }

  .design-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .designs .design-item p {
    font-size: var(--text-m);
  }
</style>
