<svelte:options customElement="twreporter-player-track" />

<script lang="ts">
  import { onMount } from 'svelte'
  import Layout from '@lab-reporter/ddd-shared/components/shared/Layout.svelte'
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import PlayerTrackMap from './PlayerTrackMap.svelte'
  import { PlayerConnection } from '../lib/components/player-track-map/player.svelte.ts'

  const { config = '' }: ComponentProps = $props()
  const connection = new PlayerConnection()
  onMount(() => connection.mount($host()))
</script>

<Layout hideInEditor>
  <PlayerTrackMap
    {config}
    getTrack={connection.player?.getTrack}
    getInfoBoxes={connection.player?.getInfoBoxes}
  />
</Layout>
