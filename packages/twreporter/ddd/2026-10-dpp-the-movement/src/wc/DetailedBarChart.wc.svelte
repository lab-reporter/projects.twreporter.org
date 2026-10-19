<svelte:options customElement="twreporter-detailed-bar-chart" />

<script lang="ts">
  import Layout from '@lab-reporter/ddd-shared/components/shared/Layout.svelte'
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import DetailedBarChart from './DetailedBarChart.svelte'
  const { src, config }: ComponentProps = $props()
</script>

<Layout>
  <DetailedBarChart {src} {config} />
</Layout>
