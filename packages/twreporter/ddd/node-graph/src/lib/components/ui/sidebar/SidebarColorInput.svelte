<script lang="ts">
  import { generateRandomId } from '@/lib/utils/id'
  import SidebarCard from './SidebarCard.svelte'
  import SidebarInputBox from './SidebarInputBox.svelte'

  let {
    label,
    value = $bindable(),
    color = $bindable(),
  }: {
    label: string
    value?: string
    color?: string
  } = $props()

  const id = generateRandomId()
  const colorInputId = `color-${id}`
</script>

<SidebarCard title={label}>
  <SidebarInputBox>
    <label
      for={colorInputId}
      class="color-box"
      style:background-color={color ?? value}
    >
      {#if color}
        <input
          type="color"
          id={colorInputId}
          bind:value={color}
          aria-label={label}
        />
      {:else}
        <input type="color" id={colorInputId} bind:value aria-label={label} />
      {/if}
    </label>
    <input class="hex" type="text" bind:value spellcheck="false" />
  </SidebarInputBox>
</SidebarCard>

<style>
  input {
    min-width: 0;
    border: 0;
    border-radius: 4px;
    color: var(--neutral-gray-700);
    box-sizing: border-box;
    font: inherit;
    background-color: transparent;
  }

  .color-box {
    width: 15px;
    height: 15px;
    border-radius: 2px;
    border: 1px solid var(--neutral-gray-600);
    cursor: pointer;
  }

  input[type='color'] {
    width: 0px;
    visibility: hidden;
  }
</style>
