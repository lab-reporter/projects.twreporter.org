import type { MaterialSymbols } from 'material-design-icons-literal-types'

export type ViewportKey = 'desktop' | 'mobile' | 'social'

export type Resolution = [number, number]

export const defaultViewportKey = 'desktop' satisfies ViewportKey

export const viewports: Record<
  ViewportKey,
  {
    name: string
    icon: MaterialSymbols
    resolutionRatio: Resolution
  }
> = {
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
  },
}
