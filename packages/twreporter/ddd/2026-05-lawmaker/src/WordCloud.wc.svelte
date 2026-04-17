<svelte:options customElement={{ tag: "twreporter-wordcloud" }} />

<script lang="ts">
    import WordCloud from "./wc/WordCloud.svelte";
    import Shell from './lib/components/layout/Shell.svelte'
</script>

<Shell
    name="國、民兩黨補助型提案用詞"
>

<WordCloud />
</Shell>
