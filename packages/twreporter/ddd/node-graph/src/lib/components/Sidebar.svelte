<script lang="ts">
    import Panel from './Panel.svelte'
    import TabContent from './tabs/TabContent.svelte'
    import TabList from './tabs/TabList.svelte'
    import Tabs from './tabs/Tabs.svelte'

    const tabValues = {
        nodes: 'nodes',
        edges: 'edges',
        groups: 'groups',
        canvas: 'canvas',
    }

    const tabLabels = {
        [tabValues.nodes]: '節點',
        [tabValues.edges]: '線段',
        [tabValues.groups]: '群組',
        [tabValues.canvas]: '畫布',
    }

    let activeTabValue = $state(tabValues.nodes)
</script>

<Panel variant="left">
    <Tabs bind:activeTabValue>
        <TabList
            tabs={Object.entries(tabLabels).map(([value, label]) => ({
                label,
                value,
            }))}
        />
        <TabContent value={tabValues.nodes}>節點</TabContent>
        <TabContent value={tabValues.edges}>線段</TabContent>
        <TabContent value={tabValues.groups}>群組</TabContent>
        <TabContent value={tabValues.canvas}>畫布</TabContent>
    </Tabs>
</Panel>
