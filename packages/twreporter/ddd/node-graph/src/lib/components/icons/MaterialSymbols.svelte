<script lang="ts">
  import type { MaterialSymbols } from 'material-design-icons-literal-types'
  import type { HTMLAttributes } from 'svelte/elements'

  const {
    name,
    class: clasName,
    size = 24,
    ...rest
  }: {
    name: MaterialSymbols
    size?: number
  } & HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span
  class={['material-symbols-outlined', clasName]}
  style:color="inherit"
  style:font-size={size && `${size}px`}
  {...rest}>{name}</span
>
