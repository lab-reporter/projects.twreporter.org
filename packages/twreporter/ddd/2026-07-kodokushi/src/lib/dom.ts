export type ElementOptions<K extends keyof HTMLElementTagNameMap> = Omit<
  Partial<HTMLElementTagNameMap[K]>,
  'style'
> & {
  style?: Partial<CSSStyleDeclaration>
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: ElementOptions<K>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  if (!options) return element

  const { style, ...properties } = options
  Object.assign(element, properties)
  if (style) Object.assign(element.style, style)
  return element
}
