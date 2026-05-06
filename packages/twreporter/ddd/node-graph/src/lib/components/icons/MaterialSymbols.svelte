<script lang="ts">
    import type { MaterialSymbols } from 'material-design-icons-literal-types'

    const { name }: { name: MaterialSymbols } = $props()
</script>

<span class="material-symbols-outlined">{name}</span>
