<script lang="ts">
  import Header from '@/lib/components/Header.svelte'
  import MaterialSymbols from '@/lib/components/icons/MaterialSymbols.svelte'
  import ActionButton from '@/lib/components/ui/ActionButton.svelte'
  import H1 from '@/lib/components/ui/typography/H1.svelte'
  import { useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import CreateGraphForm from '../../lib/components/home/CreateGraphForm.svelte'
  import GraphItem from '../../lib/components/home/GraphItem.svelte'
  import LegacyGraphImport from '../../lib/components/home/LegacyGraphImport.svelte'
  import Loading from '../../lib/components/icons/Loading.svelte'
  import Badge from '../../lib/components/ui/Badge.svelte'
  import Panel from '../../lib/components/ui/Panel.svelte'
  import { navigate } from '../router'

  const graphList = useQuery(api.graphs.listGraphs, {})
</script>

<Header />

<Panel variant="top">
  <LegacyGraphImport />
  <ActionButton label="設定" onclick={() => navigate('/settings')}>
    <MaterialSymbols name="settings" />
  </ActionButton>
</Panel>

<Panel variant="left">
  <CreateGraphForm />
</Panel>

<div class="content">
  <H1>節點圖</H1>

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
  .content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    overflow-y: scroll;
  }
</style>
