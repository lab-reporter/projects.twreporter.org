import { mount } from 'svelte'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('twreporter-3d-terrain')!,
})

export default app
