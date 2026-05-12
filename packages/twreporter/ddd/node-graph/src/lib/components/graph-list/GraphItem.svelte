<script lang="ts">
    import { useQuery } from 'convex-svelte'
    import { api } from '~convex/api'
    import type { Doc } from '~convex/dataModel'
    import { formatDateTime } from '../../../lib/utils/date'
    import { navigate } from '../../../router'
    import ActionButton from '../ActionButton.svelte'
    import Badge from '../Badge.svelte'
    import Loading from '../icons/Loading.svelte'
    import MaterialSymbols from '../icons/MaterialSymbols.svelte'

    const { graph }: { graph: Doc<'graphs'> } = $props()

    let isDesignsExpanded = $state(false)

    const designList = useQuery(api.designs.listDesignsForGraph, () =>
        isDesignsExpanded ? { graphId: graph._id } : 'skip',
    )
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
                <div class="design-item">
                    <p>{design.title}</p>
                    <ActionButton
                        label="開啟"
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

    .designs .design-item p {
        font-size: var(--text-m);
    }
</style>
