<svelte:options customElement={{ tag: 'twreporter-wordcloud' }} />

<script lang="ts">
  import WordCloud from './lib/components/WordCloud.svelte'
  import Shell from './lib/components/layout/Shell.svelte'
</script>

<Shell
  name="國、民兩黨補助型提案用詞"
  footnotes={[
    '註：',
    '資料來源：六都議會、報導者觀測站',
    '資料整理：黃靖緯 ｜ 設計：江世民',
  ]}
>
  <WordCloud
    src="https://storage.googleapis.com/data-reporter-infographics/dev/2026-05-lawmaker/data/test.json"
  />
</Shell>
