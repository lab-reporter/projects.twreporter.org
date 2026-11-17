import { Delaunay } from 'd3-delaunay'
import { type CoordinateMap } from '../../coordinate-map.ts'

export function fitCoordinateMap({
  width,
  height,
  vertices,
}: Pick<CoordinateMap, 'width' | 'height' | 'vertices'>): CoordinateMap {
  if (vertices.length < 3)
    throw new Error('Add at least three reference points.')
  for (const [index, point] of vertices.entries()) {
    if (
      vertices
        .slice(0, index)
        .some(
          (other) => Math.hypot(point.x - other.x, point.z - other.z) < 1e-6,
        )
    ) {
      throw new Error(
        `Reference ${index + 1} shares a SOG position with another point.`,
      )
    }
  }

  // Partition the input space so each SOG position has one interpolated drone position.
  const { triangles } = Delaunay.from(
    vertices,
    (point) => point.x,
    (point) => point.z,
  )
  const sections: CoordinateMap['sections'] = []

  for (let index = 0; index < triangles.length; index += 3) {
    const indices: CoordinateMap['sections'][number]['vertices'] = [
      triangles[index],
      triangles[index + 1],
      triangles[index + 2],
    ]
    const [p, q, r] = indices.map((vertex) => vertices[vertex])
    if (!p || !q || !r) throw new Error('The mesh references a missing point.')
    const determinant = (q.x - p.x) * (r.z - p.z) - (r.x - p.x) * (q.z - p.z)
    if (Math.abs(determinant) < 1e-8)
      throw new Error(
        'Spread reference points across the road, as well as along it.',
      )

    const a =
      ((q.u - p.u) * (r.z - p.z) - (r.u - p.u) * (q.z - p.z)) / determinant
    const b =
      ((q.x - p.x) * (r.u - p.u) - (r.x - p.x) * (q.u - p.u)) / determinant
    const d =
      ((q.v - p.v) * (r.z - p.z) - (r.v - p.v) * (q.z - p.z)) / determinant
    const e =
      ((q.x - p.x) * (r.v - p.v) - (r.x - p.x) * (q.v - p.v)) / determinant
    sections.push({
      vertices: indices,
      a,
      b,
      c: p.u - a * p.x - b * p.z,
      d,
      e,
      f: p.v - d * p.x - e * p.z,
    })
  }
  if (!sections.length)
    throw new Error('Reference points must enclose an area.')

  return { width, height, vertices, sections, landmarks: vertices }
}
