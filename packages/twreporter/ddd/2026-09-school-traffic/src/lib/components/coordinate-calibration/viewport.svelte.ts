import { select } from 'd3-selection'
import { zoom, zoomIdentity, type D3ZoomEvent } from 'd3-zoom'

export type ViewportPoint = { x: number; y: number }
export type ViewportBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}
export type ViewportMarker = ViewportPoint & { label: string; index: number }
export type ViewportView = {
  width: number
  height: number
  x: number
  y: number
  k: number
  rotation: number
}

export class CalibrationViewport {
  width = $state(1)
  height = $state(1)
  transform = $state.raw(zoomIdentity)
  view = $derived.by(() => ({
    width: this.width,
    height: this.height,
    x: this.transform.x,
    y: this.transform.y,
    k: this.transform.k,
    rotation: this.rotation(),
  }))
  node: SVGSVGElement | undefined
  behavior = zoom<SVGSVGElement, undefined>()
    .extent((): [[number, number], [number, number]] => [
      [0, 0],
      [this.width, this.height],
    ])
    .scaleExtent([0.05, 600])
    .clickDistance(4)
    .on('zoom', (event: D3ZoomEvent<SVGSVGElement, undefined>) => {
      this.transform = event.transform
    })

  constructor(
    readonly bounds: () => ViewportBounds,
    readonly rotation: () => number,
  ) {}

  mount = (node: SVGSVGElement) => {
    this.node = node
    select<SVGSVGElement, undefined>(node)
      .call(this.behavior)
      .on('dblclick.zoom', null)
    let fitted = false
    const observer = new ResizeObserver(() => {
      const { width, height } = node.getBoundingClientRect()
      this.width = width
      this.height = height
      if (!fitted && width && height) {
        this.fit()
        fitted = true
      }
    })
    observer.observe(node)
    return {
      destroy: () => {
        observer.disconnect()
        select(node).on('.zoom', null)
        this.node = undefined
      },
    }
  }

  fit() {
    if (!this.node) return
    const source = this.bounds()
    const rotation = new DOMMatrix().rotate(this.rotation())
    const corners = [
      { x: source.minX, y: source.minY },
      { x: source.maxX, y: source.minY },
      { x: source.maxX, y: source.maxY },
      { x: source.minX, y: source.maxY },
    ].map((point) => rotation.transformPoint(point))
    const bounds = {
      minX: Math.min(...corners.map((point) => point.x)),
      minY: Math.min(...corners.map((point) => point.y)),
      maxX: Math.max(...corners.map((point) => point.x)),
      maxY: Math.max(...corners.map((point) => point.y)),
    }
    const k =
      0.9 *
      Math.min(
        this.width / Math.max(1, bounds.maxX - bounds.minX),
        this.height / Math.max(1, bounds.maxY - bounds.minY),
      )
    select<SVGSVGElement, undefined>(this.node).call(
      this.behavior.transform,
      zoomIdentity
        .translate(this.width / 2, this.height / 2)
        .scale(k)
        .translate(
          -(bounds.minX + bounds.maxX) / 2,
          -(bounds.minY + bounds.maxY) / 2,
        ),
    )
  }

  focus(point: ViewportPoint, span: number) {
    if (!this.node) return
    const rotated = new DOMMatrix()
      .rotate(this.rotation())
      .transformPoint(point)
    const k = Math.max(
      this.transform.k,
      Math.min(this.width, this.height) / span,
    )
    select<SVGSVGElement, undefined>(this.node).call(
      this.behavior.transform,
      zoomIdentity
        .translate(this.width / 2, this.height / 2)
        .scale(k)
        .translate(-rotated.x, -rotated.y),
    )
  }

  scale(factor: number) {
    if (this.node)
      select<SVGSVGElement, undefined>(this.node).call(
        this.behavior.scaleBy,
        factor,
      )
  }

  point(clientX: number, clientY: number): ViewportPoint {
    const rect = this.node?.getBoundingClientRect()
    const [x, y] = this.transform.invert([
      clientX - (rect?.left ?? 0),
      clientY - (rect?.top ?? 0),
    ])
    const world = new DOMMatrix()
      .rotate(-this.rotation())
      .transformPoint({ x, y })
    return { x: world.x, y: world.y }
  }
}
