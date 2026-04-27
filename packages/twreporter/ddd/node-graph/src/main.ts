import { mount } from 'svelte'
import Layout from './Layout.svelte'

const app = mount(Layout, {
  target: document.getElementById('app')!,
})

export default app
