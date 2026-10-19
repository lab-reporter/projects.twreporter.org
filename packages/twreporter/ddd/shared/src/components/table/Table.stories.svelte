<script module lang="ts">
  import EmbedCode from '../shared/EmbedCode.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TableElement from './Table.wc.svelte'

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
    <EmbedCode componentName="table" tagName="twreporter-table" {...args} />
  {/snippet}
</Story>
