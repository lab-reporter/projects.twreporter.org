<script lang="ts">
  import type { MaterialSymbols } from 'material-design-icons-literal-types'
  import type { HTMLAttributes } from 'svelte/elements'

  const {
    name,
    class: clasName,
    ...rest
  }: { name: MaterialSymbols } & HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span
  class={['material-symbols-outlined', clasName]}
  style:color="inherit"
  {...rest}>{name}</span
>
