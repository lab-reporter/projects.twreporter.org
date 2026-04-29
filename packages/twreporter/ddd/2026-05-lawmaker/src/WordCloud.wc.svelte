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
        {#if wordcloud.note}
          <p>{wordcloud.note}</p>
        {/if}
        <WordCloud
          ratio={2 / 1}
          src={wordcloud.src}
          baseColor={wordcloud.textColor}
          algo={config.algo}
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
    border-radius: 3px;
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
    font-weight: 500;
    font-size: var(--text-m);
    line-height: 130%;
  }

  .block.wordcloud {
    flex-direction: column;
    padding: 10px;
  }

  .block.wordcloud p {
    color: var(--neutral-gray-600);
    margin-bottom: 10px;
    text-align: center;
    font-weight: 500;
  }
</style>
