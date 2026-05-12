import {
  defaultEdgeStyle,
  defaultNodeStyle,
} from '../constants/styles'
import type {
  EdgeStyle,
  NodeStyle,
} from '../components/design-sidebar/types'

export function normalizeNodeStyle(style?: Partial<NodeStyle> | null): NodeStyle {
  return { ...defaultNodeStyle, ...style }
}

export function normalizeEdgeStyle(style?: Partial<EdgeStyle> | null): EdgeStyle {
  return { ...defaultEdgeStyle, ...style }
}
