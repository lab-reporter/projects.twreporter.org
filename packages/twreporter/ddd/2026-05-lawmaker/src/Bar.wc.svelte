<svelte:options customElement={{ tag: 'twreporter-bar' }} />

<script lang="ts">
  import Bar from './lib/components/Bar.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { keys } from './lib/constants/bar'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
  const firstBar = $derived(config.bars[0])
</script>

<Shell name={config.title} footnotes={config.footnotes}>
  <div class="container">
    {#if config.stacked}
      <div class="bar-wrapper">
        <Bar
          stacked
          layout={config.layout}
          series={config.bars}
          xLabel={firstBar.xLabel}
          yLabel={firstBar.yLabel}
          yTickCount={config.yTickCount}
          yTickCountMobile={config.yTickCountMobile}
          yMin={config.yMin}
          yMax={config.yMax}
        />
      </div>
    {:else}
      {#each config.bars as bar}
        <div class="bar-wrapper">
          {#if config.bars.length > 1}
            <div class="bar-name">{bar.name}</div>
          {/if}
          <Bar
            src={bar.src}
            data={bar.data}
            color={bar.color}
            layout={config.layout}
            xLabel={bar.xLabel}
            yLabel={bar.yLabel}
            yTickCount={config.yTickCount}
          yTickCountMobile={config.yTickCountMobile}
            yMin={config.yMin}
            yMax={config.yMax}
          />
        </div>
      {/each}
    {/if}
  </div>
</Shell>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bar-wrapper {
    background-color: var(--neutral-gray-100);
    border-radius: 3px;
    padding: 25px 20px 20px 20px;
    @media screen and (max-width: 767px) {
      padding: 15px 0px 12px 10px;
    }
  }

  .bar-name {
    font-size: var(--text-m);
    font-weight: 500;
    color: var(--neutral-gray-700);
    margin-bottom: 6px;
  }
</style>
