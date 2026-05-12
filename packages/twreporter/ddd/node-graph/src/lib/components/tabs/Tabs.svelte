<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { SvelteHTMLElements } from 'svelte/elements'
    import { setTabsContext, type TabValue } from './context'

    type Props = SvelteHTMLElements['div'] & {
        activeTabValue?: TabValue
        children?: Snippet
    }

    let {
        activeTabValue = $bindable<TabValue | undefined>(),
        children,
        class: className,
        ...rest
    }: Props = $props()

    setTabsContext({
        activeTabValue: () => activeTabValue,
        selectTab(value) {
            activeTabValue = value
        },
    })
</script>

<div class={['tabs-root', className]} {...rest}>
    {@render children?.()}
</div>

<style>
    .tabs-root {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column;
        gap: 15px;
        overflow: hidden;
    }
</style>
