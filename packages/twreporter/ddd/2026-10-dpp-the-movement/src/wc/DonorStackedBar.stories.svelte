<script module lang="ts">
  import EmbedCode from '@lab-reporter/ddd-shared/components/shared/EmbedCode.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import DonorStackedBar from './DonorStackedBar.wc.svelte'

  const { Story } = defineMeta({
    title: 'Components/DonorStackedBar',
    component: DonorStackedBar,
    args: {
      src: './donor-stacked-bar.csv',
      config: './donor-stacked-bar.json',
    },
    argTypes: { src: { control: 'text' }, config: { control: 'text' } },
  })
</script>

<Story name="Default">
  {#snippet template(args)}
    <DonorStackedBar {...args} />
    <EmbedCode
      componentName="donor-stacked-bar"
      tagName="twreporter-donor-stacked-bar"
      {...args}
    />
  {/snippet}
</Story>
