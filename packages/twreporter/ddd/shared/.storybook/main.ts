import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.svelte'],
  addons: ['@storybook/addon-svelte-csf'],
  framework: '@storybook/svelte-vite',
  viteFinal(config) {
    const componentScript = globSync('components/**/*.js', {
      cwd: resolve(import.meta.dirname, '../dist'),
    })[0]
    const timestamp = componentScript?.match(/-(\d+)\.js$/)?.[1]

    config.define = {
      ...config.define,
      'import.meta.env.VITE_BUILD_TIMESTAMP': JSON.stringify(timestamp),
    }

    config.server = {
      ...config.server,
      watch: {
        ignored: ['**/local/**'],
      },
    }

    return config
  },
  staticDirs: [{ from: '../local', to: '/local' }],
}

export default config
