import type { MaterialSymbols } from 'material-design-icons-literal-types'

export type ViewportKey = 'full' | 'desktop' | 'mobile' | 'social'

export type Resolution = [number, number] | null

export const defaultViewportKey = 'desktop' satisfies ViewportKey

export type ViewportConfig = {
  name: string
  icon: MaterialSymbols
  resolutionRatio: Resolution
  allowOverride?: boolean
}

export const viewports: Record<ViewportKey, ViewportConfig> = {
  full: {
    name: '大螢幕滿版',
    icon: 'fit_screen',
    resolutionRatio: null,
  },
  desktop: {
    name: '電腦',
    icon: 'computer',
    resolutionRatio: [1080, 1080],
  },
  mobile: {
    name: '行動裝置',
    icon: 'mobile',
    resolutionRatio: [375, 667],
  },
  social: {
    name: '社群圖卡',
    icon: 'contacts',
    resolutionRatio: [540, 675],
    allowOverride: true,
  },
}
