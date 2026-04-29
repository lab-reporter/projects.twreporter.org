<script lang="ts">
    import type { Snippet } from "svelte";
    import { onDestroy } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    // @ts-expect-error: Currently, web-haptics/svelte doesn't have type declaration files.
    import { createWebHaptics } from "web-haptics/svelte";

    const {
        children,
        raw = false,
        onclick,
        ...buttonProps
    }: { children: Snippet; raw?: boolean } & HTMLButtonAttributes = $props();

    const { trigger, destroy } = createWebHaptics();
    onDestroy(destroy);
</script>

<button
    {...buttonProps}
    onclick={(e) => {
        trigger();
        onclick?.(e);
    }}
    class:default-style={!raw}
>
    {@render children()}
</button>

<style>
    .default-style {
        color: var(--color);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(180deg, #fafaf8 0%, #fafaf8 100%);
        box-shadow: var(--inner-shadow);
    }
</style>
