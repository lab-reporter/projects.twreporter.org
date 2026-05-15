<svelte:options customElement={{ tag: 'twreporter-embeddings' }} />

<script lang="ts">
  import Shell from './lib/components/layout/Shell.svelte'
  import Embeddings from './lib/components/Embeddings.svelte'
  import { keys } from './lib/constants/embeddings'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
</script>

<Shell name={config.title} footnotes={config.footnotes}>
  <Embeddings src={config.src} />
</Shell>
