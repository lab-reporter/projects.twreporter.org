<svelte:options customElement={{ tag: 'twreporter-layered-photos' }} />

<script lang="ts">
  import LayeredPhotos from './LayeredPhotos.svelte'

  let { name, base, layers }: { name: string; base: string; layers: string } =
    $props()
</script>

<LayeredPhotos
  {name}
  {base}
  layers={layers.split(',').map((layer) => {
    const [name, src, legend] = layer.trim().split(' ')
    return { name, src, legend }
  })}
/>
