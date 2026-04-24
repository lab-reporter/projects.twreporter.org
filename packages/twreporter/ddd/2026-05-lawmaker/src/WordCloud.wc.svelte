<svelte:options customElement={{ tag: 'twreporter-wordcloud' }} />

<script lang="ts">
  import WordCloud from './lib/components/WordCloud.svelte'
  import Shell from './lib/components/layout/Shell.svelte'

  const wordclouds = [
    {
      name: '國民黨',
      labelColor: 'var(--supportive-heavy)',
      src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
    },
    {
      name: '民進黨',
      labelColor: '#748C80',
      textColor: { hue: 280, saturation: 15 },
      src: 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json',
    },
  ]
</script>

<Shell
  name="國、民兩黨補助型提案用詞"
  footnotes={[
    '註：',
    '資料來源：六都議會、報導者觀測站',
    '資料整理：黃靖緯 ｜ 設計：江世民',
  ]}
>
  <div class="container">
    {#each wordclouds as wordcloud}
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
