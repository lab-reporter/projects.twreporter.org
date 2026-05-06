<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { SvelteHTMLElements } from 'svelte/elements'
    import { getTabsContext, type TabValue } from './context'

    type Props = SvelteHTMLElements['div'] & {
        value: TabValue
        children?: Snippet
    }

    let { value, children, class: className, ...rest }: Props = $props()

    const tabs = getTabsContext()
    const selected = $derived(value === tabs.activeTabValue())
</script>

{#if children}
    <div
        class={['panel', className]}
        role="tabpanel"
        hidden={!selected}
        {...rest}
    >
        {@render children()}
    </div>
{/if}

<style>
    .panel {
        order: 1;
        flex-basis: 100%;
        min-width: 0;
    }

    .panel[hidden] {
        display: none;
    }
</style>
