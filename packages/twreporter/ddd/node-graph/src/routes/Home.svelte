<script lang="ts">
    import { useQuery } from 'convex-svelte'
    import { UserButton } from 'svelte-clerk/client'
    import { api } from '~convex/api'
    import Badge from '../lib/components/Badge.svelte'
    import GraphItem from '../lib/components/graph-list/GraphItem.svelte'
    import Loading from '../lib/components/icons/Loading.svelte'
    import Logo from '../lib/components/icons/Logo.svelte'
    import LegacyGraphImport from '../lib/components/LegacyGraphImport.svelte'
    import Panel from '../lib/components/Panel.svelte'

    const graphList = useQuery(api.graphs.listGraphs, {})
</script>

<div class="header">
    <div>
        <Logo />
        <h1>節點工具</h1>
    </div>
    <UserButton />
</div>

<Panel variant="top">
    <LegacyGraphImport />
</Panel>

<Panel variant="left">請選擇節點圖或圖表</Panel>

<div class="content">
    <h1 id="graphs-title">節點圖</h1>

    {#if graphList.isLoading}
        <Loading />
    {:else if !graphList.data?.length}
        <Badge>目前沒有節點圖</Badge>
    {:else}
        {#each graphList.data as graph (graph._id)}
            <GraphItem {graph} />
        {/each}
    {/if}
</div>

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }

    .header div {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: start;
    }

    h1 {
        font-size: var(--text-l);
        font-weight: 700;
        line-height: 1.2;
    }

    .content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
    }
</style>
