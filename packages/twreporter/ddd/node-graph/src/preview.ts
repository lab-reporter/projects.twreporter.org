import { mount } from 'svelte'
import Preview from './Preview.svelte'

const app = mount(Preview, {
  target: document.getElementById('app')!,
})

export default app
