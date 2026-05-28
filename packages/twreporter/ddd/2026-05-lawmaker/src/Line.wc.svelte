<svelte:options customElement={{ tag: 'twreporter-line' }} />

<script lang="ts">
  import Line from './lib/components/Line.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { keys } from './lib/constants/line'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
  const firstLine = $derived(config.lines[0])
</script>

<Shell
  name={config.title}
  footnotes={config.footnotes}
  backdrop={config.backdrop}
  wide={config.wide}
>
  <div class="container">
    {#each config.lines as line}
      <div class="line-wrapper">
        {#if config.lines.length > 1}
          <div class="line-name">{line.name}</div>
        {/if}
        <Line
          src={line.src}
          data={line.data}
          color={line.color}
          colorMap={config.colorMap}
          xLabel={line.xLabel}
          yLabel={line.yLabel}
          yTickCount={config.yTickCount}
          yTickCountMobile={config.yTickCountMobile}
          yMin={config.yMin}
          yMax={config.yMax}
        />
      </div>
    {/each}
  </div>
</Shell>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .line-wrapper {
    background-color: var(--neutral-gray-100);
    border-radius: 3px;
    padding: 25px 20px 20px 20px;
    @media screen and (max-width: 767px) {
      padding: 15px 0px 12px 10px;
    }
  }

  .line-name {
    font-size: var(--text-m);
    font-weight: 500;
    color: var(--neutral-gray-700);
    margin-bottom: 6px;
  }
</style>
