<svelte:options customElement={{ tag: 'twreporter-wordcloud' }} />

<script lang="ts">
  import WordCloud from './lib/components/WordCloud.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
  import { keys } from './lib/constants/wordcloud'

  const { key }: { key: string } = $props()

  const config = $derived(keys[key])
</script>

<Shell name={config.title} footnotes={config.footnotes}>
  <div class="container">
    {#each config.clouds as wordcloud}
      <div
        class="block label"
        style:--color={wordcloud.labelColor}
        style:--text-color="white"
      >
        {wordcloud.name}
      </div>
      <div class="block wordcloud">
        <WordCloud
          ratio={2 / 1}
          src={wordcloud.src}
          baseColor={wordcloud.textColor}
        />
      </div>
    {/each}
  </div>
</Shell>

<style>
  .container {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 5px;
  }

  .block {
    border-radius: 5px;
    background-color: var(--color, var(--neutral-gray-100));
    color: var(--text-color, var(--neutral-gray-900));
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    word-wrap: break-word;
  }

  .block.label {
    text-align: center;
    font-weight: 450;
    font-size: var(--text-m);
  }

  .block.wordcloud {
    padding: 10px;
  }
</style>
