<script module lang="ts">
  import EmbedCode from '@lab-reporter/ddd-shared/components/shared/EmbedCode.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import DetailedBarChart from './DetailedBarChart.wc.svelte'
  const { Story } = defineMeta({
    title: 'Components/DetailedBarChart',
    component: DetailedBarChart,
    args: {
      src: './detailed-bar-chart.csv',
      config: './detailed-bar-chart.json',
    },
    argTypes: { src: { control: 'text' }, config: { control: 'text' } },
  })
</script>

<Story name="Default">
  {#snippet template(args)}
    <DetailedBarChart {...args} />
    <EmbedCode
      componentName="detailed-bar-chart"
      tagName="twreporter-detailed-bar-chart"
      {...args}
    />
  {/snippet}
</Story>

<Story
  name="National"
  args={{ src: './national.csv', config: './national.json' }}
>
  {#snippet template(args)}
    <DetailedBarChart {...args} />
    <EmbedCode
      componentName="detailed-bar-chart"
      tagName="twreporter-detailed-bar-chart"
      {...args}
    />
  {/snippet}
</Story>
