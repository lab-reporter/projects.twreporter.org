<svelte:options customElement={{ tag: 'twreporter-bar-grid' }} />

<script lang="ts">
  import BarGrid from './lib/components/BarGrid.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { gridKeys } from './lib/constants/bar'

  const { key }: { key: string } = $props()
  const config = $derived(gridKeys[key])
</script>

<Shell name={config.title} footnotes={config.footnotes}>
  <BarGrid
    items={config.items}
    gridColumns={config.gridColumns}
    layout={config.layout}
    yDomain={config.yDomain}
    yTickCount={config.yTickCount}
    ratio={config.ratio}
    xLabel={config.xLabel}
    yLabel={config.yLabel}
    colorMap={config.colorMap}
    xDate={config.xDate}
    xTickCount={config.xTickCount}
    xFormat={config.xFormat}
    groupLegend={config.groupLegend}
  />
</Shell>
