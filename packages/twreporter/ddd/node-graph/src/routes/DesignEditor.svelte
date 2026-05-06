<script lang="ts">
    import { useQuery } from 'convex-svelte'
    import { api } from '~convex/api'
    import type { Id } from '~convex/dataModel'
    import Canvas from '../lib/components/Canvas.svelte'
    import Header from '../lib/components/Header.svelte'
    import Sidebar from '../lib/components/Sidebar.svelte'
    import Topbar from '../lib/components/Topbar.svelte'
    import { route } from '../router'
    import Frame from '../lib/components/Frame.svelte'

    const graphTitle = useQuery(api.graphs.getGraphTitle, () =>
        route.params.graphId
            ? { graphId: route.params.graphId as Id<'graphs'> }
            : 'skip',
    )
</script>

<Header title={graphTitle.data ?? undefined} />
<Topbar />
<Sidebar />
{#if route.params.graphId}
    <Frame>
        <Canvas graphId={route.params.graphId} />
    </Frame>
{/if}
