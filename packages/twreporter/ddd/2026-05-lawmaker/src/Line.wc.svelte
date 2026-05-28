<svelte:options customElement={{ tag: 'twreporter-line' }} />

<script lang="ts">
  import Line from './lib/components/Line.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { keys } from './lib/constants/line'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
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
        <Line
          src={line.src}
          data={line.data}
          showArea={line.showArea}
          colorMap={config.colorMap}
          xLabel={line.xLabel}
          yLabel={line.yLabel}
          yTickCount={config.yTickCount}
          xTickCount={config.xTickCount}
          yDomain={config.yDomain}
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

</style>
