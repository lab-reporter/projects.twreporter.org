<script lang="ts">
  import { useConvexClient } from 'convex-svelte'
  import { toast } from 'svelte-sonner'
  import { api } from '~convex/api'
  import ActionButton from './ActionButton.svelte'
  import MaterialSymbols from './icons/MaterialSymbols.svelte'

  const convex = useConvexClient()
  let importInput = $state<HTMLInputElement | null>(null)
  let isImporting = $state(false)

  async function importLegacyGraph(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    isImporting = true

    try {
      const legacyGraph = JSON.parse(await file.text())

      if (legacyGraph?.version !== '2.5') {
        throw new Error('Only legacy graph version 2.5 is supported')
      }

      const result = await convex.mutation(api.graphs.importLegacyGraph, {
        fileName: file.name,
        legacyGraph,
      })

      toast.success(
        `已匯入 ${result.nodeCount} nodes / ${result.edgeCount} edges`,
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '無法匯入舊版圖譜')
    } finally {
      isImporting = false
      input.value = ''
    }
  }
</script>

<ActionButton
  label="匯入"
  type="button"
  disabled={isImporting}
  onclick={() => importInput?.click()}
>
  <MaterialSymbols name="upload_file" />
</ActionButton>
<input
  bind:this={importInput}
  class="file-input"
  type="file"
  accept="application/json,.json"
  onchange={importLegacyGraph}
/>

<style>
  .file-input {
    display: none;
  }
</style>
