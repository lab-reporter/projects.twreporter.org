<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TableElement from './Table.wc.svelte'
  import { generateEmbedCode } from '../../storybook/generate-embed-code'
  import EmbedCode from '../../storybook/EmbedCode.svelte'

  const { Story } = defineMeta({
    title: 'Components/Table',
    component: TableElement,
    args: {
      src: 'https://projects.twreporter.org/twreporter/ddd/2026-07-transnational-repression/1.csv',
      config:
        'https://projects.twreporter.org/twreporter/ddd/2026-07-transnational-repression/1.json',
    },
    argTypes: {
      src: { control: 'text' },
      config: { control: 'text' },
    },
  })
</script>

<Story name="Default">
  {#snippet template(args)}
    <TableElement {...args} />
    <EmbedCode code={generateEmbedCode('table', args)} />
  {/snippet}
</Story>
