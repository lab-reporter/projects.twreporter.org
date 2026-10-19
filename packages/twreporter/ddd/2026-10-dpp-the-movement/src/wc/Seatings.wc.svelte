<svelte:options customElement="twreporter-seatings" />

<script lang="ts">
  import Layout from '@lab-reporter/ddd-shared/components/shared/Layout.svelte'
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import Seatings from './Seatings.svelte'
  const { src, config }: ComponentProps = $props()
</script>

<Layout>
  <Seatings {src} {config} />
</Layout>
