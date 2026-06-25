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
    <div class="wordcloud-wrapper">
      <div class="block label">
        <div class="icon" style:--color={wordcloud.labelColor}></div>
        <div class="label">{wordcloud.name}</div>
      </div>
        {#if wordcloud.note}
          <div class="block note">{wordcloud.note}</div>
        {/if}
      <div class="block wordcloud">
        <WordCloud
          ratio={2 / 1}
          src={wordcloud.src}
          baseColor={wordcloud.textColor}
          algo={config.algo}
        />
      </div>
      </div>
    {/each}
  </div>
</Shell>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .wordcloud-wrapper {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'label note'
      'label wordcloud';
    gap: 0px;
    border-radius: 3px;
    border: 1px solid var(--neutral-gray-200);
  }

  .block {
    background-color: var(--neutral-gray-100);
    color: var(--text-color, var(--neutral-gray-900));
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    word-wrap: break-word;
    border: 1px solid var(--neutral-gray-200);
  }

  .icon {
    width: var(--text-m);
    height: var(--text-m);
    background-color: var(--color, black);
    border-radius: 2px;
  }

  .label {
    grid-area: label;
    gap: 6px;
    text-align: center;
    font-weight: 500;
    font-size: var(--text-m);
    letter-spacing: 0.1em;
    color: var(--neutral-gray-800);
    writing-mode: vertical-rl;
    text-orientation: upright;
  }

  .block.wordcloud {
    grid-area: wordcloud;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    justify-content: center;
    background-color: var(--neutral-gray-50);
  }

  .block.note {
    grid-area: note;
    color: var(--neutral-gray-600);
    text-align: center;
    font-weight: 500;
    font-size: var(--text-s);
  }
</style>
