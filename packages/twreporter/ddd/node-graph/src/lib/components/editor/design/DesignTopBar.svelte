<script lang="ts">
  import { canvasState } from '@/lib/components/canvas/state.svelte'
  import MaterialSymbols from '@/lib/components/icons/MaterialSymbols.svelte'
  import ActionButton from '@/lib/components/ui/ActionButton.svelte'
  import Button from '@/lib/components/ui/Button.svelte'
  import Dialog from '@/lib/components/ui/Dialog.svelte'
  import Panel from '@/lib/components/ui/Panel.svelte'
  import ViewResolution from '@/lib/components/ui/ViewResolution.svelte'
  import {
    viewports,
    type Resolution,
    type ViewportKey,
  } from '@/lib/constants/viewports'
  import { useHistory } from '@/lib/features/use-history.svelte'
  import { copyToClipboard } from '@/lib/utils/copy'
  import { exportAndDownloadImage } from '@/lib/utils/export'
  import { useSvelteFlow } from '@xyflow/svelte'

  let {
    activeLayoutKey = $bindable(),
    frameRef,
    frameResolutionRatio,
    title,
    embedCode,
  }: {
    activeLayoutKey: ViewportKey
    frameRef: HTMLDivElement | null | undefined
    frameResolutionRatio: Resolution
    title?: string | undefined
    embedCode?: string
  } = $props()

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
    <ViewResolution resolution={frameResolutionRatio} />
    {#each Object.entries(viewports) as [key, { icon, name }] (key)}
      <ActionButton
        label={name}
        aria-pressed={activeLayoutKey === key}
        onclick={() => {
          activeLayoutKey = key as ViewportKey
        }}
      >
        <MaterialSymbols name={icon} />
      </ActionButton>
    {/each}
  </div>
  <div>
    <Button
      variant="outlined"
      onclick={() =>
        exportAndDownloadImage({
          ref: frameRef,
          title,
        })}>匯出圖檔</Button
    >
    <Dialog title="複製嵌入碼">
      {#snippet trigger()}
        <Button variant="filled">嵌入碼</Button>
      {/snippet}
      <div class="embed-dialog">
        <textarea readonly value={embedCode} aria-label="嵌入碼"></textarea>
        <div class="embed-actions">
          <Button
            variant="filled"
            disabled={!embedCode}
            onclick={() => {
              copyToClipboard(embedCode ?? '')
            }}
          >
            複製
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</Panel>

<style>
  .embed-dialog {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .embed-dialog textarea {
    width: 100%;
    min-height: 180px;
    resize: vertical;
    padding: 12px;
    border: 1px solid var(--neutral-gray-300);
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--neutral-gray-800);
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
  }

  .embed-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
