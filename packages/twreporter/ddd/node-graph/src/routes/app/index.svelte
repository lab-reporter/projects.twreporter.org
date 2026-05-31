<script lang="ts">
  import { useQuery } from 'convex-svelte'
  import { UserButton } from 'svelte-clerk/client'
  import { api } from '~convex/api'
  import Badge from '../../lib/components/ui/Badge.svelte'
  import CreateGraphForm from '../../lib/components/home/CreateGraphForm.svelte'
  import GraphItem from '../../lib/components/home/GraphItem.svelte'
  import Loading from '../../lib/components/icons/Loading.svelte'
  import Logo from '../../lib/components/icons/Logo.svelte'
  import LegacyGraphImport from '../../lib/components/home/LegacyGraphImport.svelte'
  import Panel from '../../lib/components/ui/Panel.svelte'
  import ActionButton from '@/lib/components/ui/ActionButton.svelte'
  import MaterialSymbols from '@/lib/components/icons/MaterialSymbols.svelte'
  import { navigate } from '../router'
  import Header from '@/lib/components/Header.svelte'

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
  .content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    overflow-y: scroll;
  }
</style>
