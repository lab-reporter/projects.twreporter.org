<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import FullScreenWrapper from './FullScreenWrapper.wc.svelte'
  import EmbedCode from '../shared/EmbedCode.svelte'
  import type { FullScreenWrapperConfig } from './types'

  const { Story } = defineMeta({
    title: 'Components/FullScreenWrapper',
    component: FullScreenWrapper,
    args: {
      src: '',
      config: JSON.stringify({
        splashScreenText: '開始互動體驗',
      } satisfies FullScreenWrapperConfig),
    },
  })
</script>

<Story name="Default">
  {#snippet template({ children, ...args })}
    <div
      style:width="100%"
      style:height="500px"
      style:display="flex"
      style:align-items="center"
      style:justify-content="center"
    >
      空內容（往下滑看到元件）
    </div>
    <twreporter-full-screen-wrapper src={args.src} config={args.config}>
      <iframe
        srcdoc="<main style='padding: 2rem; font-family: sans-serif'><h1>Embedded content</h1><p>Use the wrapper controls to enter or continue reading.</p></main>"
        title="Embedded content"
        width="100%"
        height="100%"
      ></iframe>
    </twreporter-full-screen-wrapper>
    <div
      style:width="100%"
      style:height="500px"
      style:display="flex"
      style:align-items="center"
      style:justify-content="center"
    >
      空內容（往上滑看到元件）
    </div>
    <EmbedCode
      componentName="full-screen-wrapper"
      tagName="twreporter-full-screen-wrapper"
      {...args}
    />
  {/snippet}
</Story>
