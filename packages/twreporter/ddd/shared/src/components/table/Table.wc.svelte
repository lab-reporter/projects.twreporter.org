<svelte:options customElement={{ tag: 'twreporter-table' }} />

<script lang="ts">
  import Layout from '../shared/Layout.svelte'
  import Table from './Table.svelte'
  import type { ComponentProps } from '../types'

  let { src, config }: ComponentProps = $props()
</script>

{#if src && config}
  <Layout>
    <Table {src} {config} />
  </Layout>
{/if}
