<svelte:options customElement="twreporter-full-screen-wrapper" />

<script lang="ts">
  import { onMount } from 'svelte'
  import Layout from '../shared/Layout.svelte'
  import type { ComponentPropsWithChildren } from '../types'
  import FullScreenWrapper from './FullScreenWrapper.svelte'
  import { createWrapperController } from './controller.svelte.ts'
  import { WrapperConnection } from './connection.ts'

  const { src, config, children }: ComponentPropsWithChildren = $props()
  const controller = createWrapperController()
  const connection = new WrapperConnection($host(), controller)
  onMount(() => connection.mount())
</script>

<Layout hideInEditor>
  <FullScreenWrapper {src} {config} {controller}>
    {#snippet children()}
      <slot onslotchange={connection.ready} />
    {/snippet}
  </FullScreenWrapper>
</Layout>
