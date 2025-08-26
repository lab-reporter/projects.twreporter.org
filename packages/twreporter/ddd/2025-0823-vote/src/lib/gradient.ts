export type ColorStop = {
  stop: number
  color: string
}

export function createGradient(stops: ColorStop[]): string {
  let sortedStops = stops.sort((a, b) => a.stop - b.stop)

  const direction = 'to right'
  const unit = '%'

  const min = sortedStops[0].stop
  const max = sortedStops[sortedStops.length - 1].stop
  const range = max - min

  sortedStops = sortedStops.map((item) => ({
    ...item,
    stop: ((item.stop - min) / range) * 100,
  }))

  const gradientStops: string[] = sortedStops.map(
    (item) => `${item.color} ${item.stop}${unit}`
  )

  return `linear-gradient(${direction}, ${gradientStops.join(', ')})`
}
