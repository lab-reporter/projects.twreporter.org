<svelte:options customElement={{ tag: 'twreporter-table' }} />

<script lang="ts">
  import Table from './lib/components/Table.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { keys } from './lib/constants/table'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
</script>

<Shell name={config.title} footnotes={config.footnotes} wide={config.wide}>
  <Table
    tables={config.tables}
    gridColumns={config.gridColumns}
    highlightColor={config.highlightColor}
    highlightHoverColor={config.highlightHoverColor}
  />
</Shell>
