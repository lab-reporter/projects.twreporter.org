<script lang="ts">
  import { canvasState } from '@/lib/components/canvas/state.svelte'
  import MaterialSymbols from '@/lib/components/icons/MaterialSymbols.svelte'
  import ActionButton from '@/lib/components/ui/ActionButton.svelte'
  import Panel from '@/lib/components/ui/Panel.svelte'
  import { useHistory } from '@/lib/features/use-history.svelte'
  import { useSvelteFlow } from '@xyflow/svelte'

  const history = useHistory()
  const { fitView } = useSvelteFlow()
</script>

<Panel variant="top">
  <div>
    <ActionButton
      label="復原"
      disabled={history.undoDisabled}
      onclick={() => void history.undo()}
    >
      <MaterialSymbols name="undo" />
    </ActionButton>
    <ActionButton
      label="重做"
      disabled={history.redoDisabled}
      onclick={() => void history.redo()}
    >
      <MaterialSymbols name="redo" />
    </ActionButton>
    <!-- TODO: Implement auto-layout -->
    <ActionButton label="自動排列">
      <MaterialSymbols name="auto_awesome_motion" />
    </ActionButton>
    <ActionButton label="Fit" onclick={() => fitView()}>
      <MaterialSymbols name="fit_screen" />
    </ActionButton>
  </div>
  <div>
    <ActionButton
      label="Popup"
      aria-pressed={canvasState.tooltipsEnabled}
      onclick={() => {
        canvasState.tooltipsEnabled = !canvasState.tooltipsEnabled
      }}
    >
      <MaterialSymbols name="right_click" />
    </ActionButton>
  </div>
</Panel>
