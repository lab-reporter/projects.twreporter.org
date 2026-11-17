<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CoordinateCalibration from '../lib/components/coordinate-calibration/CoordinateCalibration.svelte'

  const { Story } = defineMeta({
    title: 'Tools/Coordinate calibration',
    component: CoordinateCalibration,
    parameters: { layout: 'fullscreen' },
  })
</script>

<Story name="Default" />
