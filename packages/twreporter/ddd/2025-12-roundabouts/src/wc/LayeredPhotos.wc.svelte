<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-layered-photos" }} />

<script lang="ts">
    import LayeredPhotos from "./LayeredPhotos.svelte";

    let {
        name,
        footnotes: inputFootnotes,
        ...props // We use non-destructured props to support dynamic props with group ids in them.
    }: { name: string; footnotes: string } & (
        | { base: string; layers: string }
        | {
              groups: string;
              [x: `base-${string}`]: string;
              [x: `layers-${string}`]: string;
          }
    ) = $props();

    const footnotes = inputFootnotes.split(",").map((f) => f.trim());

    const groups =
        "groups" in props
            ? props.groups.split(",").map((g) => {
                  const [id, name] = g.trim().split(" ");
                  return { id, name };
              })
            : undefined;

    let activeGroupId = $state(groups?.[0].id);
</script>

<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
    crossorigin="anonymous"
/>

<div class="container">
    <div class="header"><h1>{name}</h1></div>

    {#if "groups" in props}
        {#key activeGroupId}
            {#each groups as group}
                <!-- Use `hidden` to control group's visibility so that all elements are still rendered on load, preventing layout shift when switching groups -->
                <div hidden={activeGroupId !== group.id}>
                    <LayeredPhotos
                        base={props[`base-${group.id}`]}
                        layers={props[`layers-${group.id}`]
                            .split(",")
                            .map((layer) => {
                                const [name, src, legend] = layer
                                    .trim()
                                    .split(" ");
                                return { name, src, legend };
                            })}
                    />
                </div>
            {/each}
        {/key}

        <div class="controls">
            {#each groups as group}
                <button
                    onclick={() => (activeGroupId = group.id)}
                    class:active={activeGroupId === group.id}
                    >{group.name}</button
                >
            {/each}
        </div>
    {:else}
        <LayeredPhotos
            base={props.base}
            layers={props.layers.split(",").map((layer) => {
                const [name, src, legend] = layer.trim().split(" ");
                return { name, src, legend };
            })}
        />
    {/if}

    <div class="footer">
        <div class="footnotes">
            {#each footnotes as footnote}
                <p>{footnote}</p>
            {/each}
        </div>
        <img
            src="https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/assets/logo-black.png"
            class="logo"
            alt="報導者 The Reporter"
        />
    </div>
</div>

<style>
    * {
        --tr-text: #404040;
        color: var(--tr-text);
        font-family: "Roboto Slab", "Noto Sans TC", sans-serif;
        text-align: left !important;
    }

    .container {
        max-width: 730px;
        position: relative;
        padding: 8px 10px;
        background: #f1f1f1;
        --btn-size: 10px;
        border-top: #e2e2e2 1px solid;
        border-bottom: #e2e2e2 1px solid;
    }

    @media (min-width: 500px) {
        .container {
            padding: 10px 10px;
        }
    }

    .header {
        padding: 5px 0 0;
    }

    @media (min-width: 500px) {
        .header h1 {
            padding: 5px 0 15px;
        }
    }

    .header h1 {
        font-size: 24px;
        font-weight: bold;
        padding: 5px 0 10px;
    }

    @media (min-width: 500px) {
        .header h1 {
            font-size: 28px;
        }
    }

    @media (min-width: 500px) {
        .container {
            --btn-size: 14px;
        }
    }

    @media (min-width: 670px) {
        .container {
            --btn-size: 16px;
        }
    }

    .controls {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .controls button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 0;
        background: white;
        border-radius: 0 0 5px 5px;
        font-size: var(--btn-size);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        opacity: 0.5;
        letter-spacing: 0.7px;
    }

    .controls .active {
        opacity: 1;
        font-weight: 600;
    }

    .footer {
        padding: 10px 0 10px 0;
        display: flex;
        align-items: end;
        justify-content: space-between;
        --footer-scale: 1;
        --footer-logo-scale: 1.25;
    }

    @media (min-width: 500px) {
        .footer {
            padding: 15px 0 10px 0;
            --footer-scale: 1.6;
            --footer-logo-scale: 2;
        }
    }

    .footnotes {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    @media (min-width: 500px) {
        .footnotes {
            gap: 5px;
        }
    }

    .footer p {
        color: #acacac;
        font-size: calc(10px * var(--footer-scale));
    }

    .footer .logo {
        width: calc(14.5px * var(--footer-logo-scale));
        height: calc(15.5px * var(--footer-logo-scale));
    }
</style>
