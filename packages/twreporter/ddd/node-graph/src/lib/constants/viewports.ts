export type ViewportKey = 'desktop' | 'mobile' | 'social'

export const defaultViewportKey = 'desktop' satisfies ViewportKey

export const viewports: Record<
  ViewportKey,
  {
    name: string
    resolutionRatio: [number, number]
  }
> = {
  desktop: {
    name: '電腦',
    resolutionRatio: [1080, 1080],
  },
  mobile: {
    name: '行動裝置',
    resolutionRatio: [375, 667],
  },
  social: {
    name: '社群圖卡',
    resolutionRatio: [540, 675],
  },
}
