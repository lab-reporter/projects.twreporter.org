<script module lang="ts">
  import EmbedCode from '@lab-reporter/ddd-shared/components/shared/EmbedCode.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Seatings from './Seatings.wc.svelte'
  const { Story } = defineMeta({
    title: 'Components/Seatings',
    component: Seatings,
    args: { src: './seatings.csv', config: './seatings.json' },
    argTypes: { src: { control: 'text' }, config: { control: 'text' } },
  })
</script>

<Story name="Default">
  {#snippet template(args)}
    <Seatings {...args} />
    <EmbedCode
      componentName="seatings"
      tagName="twreporter-seatings"
      {...args}
    />
  {/snippet}
</Story>
