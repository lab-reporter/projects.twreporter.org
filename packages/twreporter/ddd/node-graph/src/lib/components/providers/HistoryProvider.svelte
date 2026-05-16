<script lang="ts">
  import { useHistory } from '@/lib/features/use-history.svelte'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()

  const history = useHistory()

  function isEditableElement(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false

    const tagName = target.tagName.toLowerCase()

    return (
      target.isContentEditable ||
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select'
    )
  }

  function handleKeyboardShortcut(event: KeyboardEvent) {
    if (!event.metaKey || event.ctrlKey || event.altKey) return
    if (event.key.toLowerCase() !== 'z') return
    if (isEditableElement(event.target)) return

    event.preventDefault()

    if (event.shiftKey) {
      void history.redo()
    } else {
      void history.undo()
    }
  }
</script>

<svelte:window onkeydown={handleKeyboardShortcut} />

{@render children()}
