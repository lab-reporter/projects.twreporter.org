import type { LayerSliderStep } from './types'

export const layerSliderState = $state<{ activeStep: LayerSliderStep | null }>({
  activeStep: null,
})
