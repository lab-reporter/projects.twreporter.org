import { z } from 'zod'
import {
  coordinateMapSchema,
  coordinateVertexSchema,
  createPositionProjector,
  type CoordinateVertex,
  type MapPoint,
  type WorldPoint,
} from '../../coordinate-map.ts'
import { fitCoordinateMap } from './mapping.ts'

const storageKey = 'school-traffic-manual-calibration'
const draftSchema = coordinateMapSchema
  .pick({ width: true, height: true })
  .extend({
    points: z.array(coordinateVertexSchema),
    sogUrl: z.url(),
  })
type Selection =
  | { kind: 'inspect' }
  | { kind: 'point'; index: number }
  | { kind: 'pick-world' }
  | { kind: 'pick-image'; world: WorldPoint }

export class CoordinateCalibration {
  width = $state(2000)
  height = $state(128)
  points = $state.raw<CoordinateVertex[]>([])
  selection = $state<Selection>({ kind: 'pick-world' })
  history = $state.raw<CoordinateVertex[][]>([])
  message = $state('')
  showMesh = $state(false)
  probe = $state<WorldPoint>()
  focus = $state<{ world: WorldPoint; image: MapPoint }>()
  sogUrl = $state('')
  sogUrlInput = $state('')

  constructor(url: string) {
    this.sogUrl = url
    this.sogUrlInput = url
  }
  result = $derived.by(() => {
    if (this.points.length < 3) return { kind: 'incomplete' } as const
    try {
      const map = fitCoordinateMap({
        width: this.width,
        height: this.height,
        vertices: this.points,
      })
      return {
        kind: 'valid',
        map,
        project: createPositionProjector(map),
      } as const
    } catch (cause) {
      return {
        kind: 'invalid',
        error:
          cause instanceof Error
            ? cause.message
            : 'Unable to calculate the mapping.',
      } as const
    }
  })
  selectedIndex = $derived(
    this.selection.kind === 'point' ? this.selection.index : undefined,
  )
  correctedProbe = $derived(
    this.probe && this.result.kind === 'valid'
      ? this.result.project(this.probe)
      : undefined,
  )

  restore() {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const draft = draftSchema.parse(JSON.parse(saved))
      this.width = draft.width
      this.height = draft.height
      this.points = draft.points
      this.selection = this.points.length
        ? { kind: 'inspect' }
        : { kind: 'pick-world' }
      this.sogUrl = draft.sogUrl
      this.sogUrlInput = draft.sogUrl
      this.message = 'Restored your saved draft.'
    } catch {
      this.message =
        'Could not restore the saved draft. Import an exported map to continue.'
    }
  }

  save() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          width: this.width,
          height: this.height,
          points: this.points,
          sogUrl: this.sogUrl,
        }),
      )
    } catch {
      this.message =
        'This browser could not save the draft. Export your map before leaving.'
    }
  }

  replace(points: CoordinateVertex[]) {
    this.history = [...this.history, this.points]
    this.points = points
    this.save()
  }

  update(index: number, values: Partial<CoordinateVertex>) {
    this.replace(
      this.points.map((point, pointIndex) =>
        pointIndex === index ? { ...point, ...values } : point,
      ),
    )
  }

  select(index: number) {
    this.selection = { kind: 'point', index }
  }

  focusPoint(index: number) {
    const point = this.points[index]
    if (!point) return
    this.select(index)
    this.focus = {
      world: { x: point.x, z: point.z },
      image: { u: point.u, v: point.v },
    }
  }

  pickWorld(world: WorldPoint) {
    if (this.selection.kind === 'point')
      this.update(this.selection.index, world)
    else if (
      this.selection.kind === 'pick-world' ||
      this.selection.kind === 'pick-image'
    )
      this.selection = { kind: 'pick-image', world }
    else this.probe = world
  }

  pickImage(image: MapPoint) {
    if (
      image.u < 0 ||
      image.u > this.width ||
      image.v < 0 ||
      image.v > this.height
    )
      return
    if (this.selection.kind === 'point')
      this.update(this.selection.index, image)
    else if (this.selection.kind === 'pick-image') {
      this.replace([
        ...this.points,
        {
          landmark: `Reference ${this.points.length + 1}`,
          ...this.selection.world,
          ...image,
        },
      ])
      this.select(this.points.length - 1)
    }
  }

  remove(index: number) {
    this.replace(this.points.filter((_, pointIndex) => pointIndex !== index))
    this.selection = this.points.length
      ? { kind: 'point', index: Math.min(index, this.points.length - 1) }
      : { kind: 'pick-world' }
  }

  undo() {
    const previous = this.history.at(-1)
    if (!previous) return
    this.points = previous
    this.history = this.history.slice(0, -1)
    this.selection = this.points.length
      ? { kind: 'inspect' }
      : { kind: 'pick-world' }
    this.message = 'Undid the last edit.'
    this.save()
  }

  async importMap(file: File) {
    try {
      const map = coordinateMapSchema.parse(JSON.parse(await file.text()))
      createPositionProjector(map)
      this.width = map.width
      this.height = map.height
      this.points = structuredClone(map.vertices)
      this.history = []
      this.selection = { kind: 'point', index: 0 }
      this.message = `Imported ${file.name}.`
      this.save()
    } catch (cause) {
      this.message =
        cause instanceof Error ? cause.message : 'Could not import this map.'
    }
  }

  exportMap() {
    if (this.result.kind !== 'valid') return
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(this.result.map, null, 2) + '\n'], {
        type: 'application/json',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'coordinate-map.json'
    link.click()
    URL.revokeObjectURL(url)
    this.message =
      'Exported coordinate-map.json. Replace src/lib/constants/coordinate-map.json to apply it.'
  }

  reset() {
    this.replace([])
    this.selection = { kind: 'pick-world' }
    this.focus = undefined
    this.probe = undefined
    this.message = 'Cleared all reference points.'
  }
}
