import {
  prepareRichInline,
  type RichInlineItem,
} from '@chenglou/pretext/rich-inline'

export type Annotation = {
  className: string
  indicatorHTML: string
  contentTemplate: HTMLElement
}

type InlineContent = {
  items: RichInlineItem[]
  annotations: Map<number, Annotation>
}

export type BlockData = {
  template: HTMLElement
  heading: boolean
  content: InlineContent
  prepared: ReturnType<typeof prepareRichInline> | null
  pad: { left: number; right: number; top: number; bottom: number }
  margin: { top: number; bottom: number }
  lineHeight: number
}

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6, [role="heading"]'

function directChildOf(element: Element, parent: Element): Element | null {
  let child: Element | null = element
  while (child?.parentElement && child.parentElement !== parent)
    child = child.parentElement
  return child?.parentElement === parent ? child : null
}

export function sectionBlocks(start: Element, end: Element): HTMLElement[] {
  const ancestors = new Set<Element>()
  for (
    let element: Element | null = start;
    element;
    element = element.parentElement
  )
    ancestors.add(element)

  let parent: Element | null = end.parentElement
  while (parent && !ancestors.has(parent)) parent = parent.parentElement
  if (!parent) return []

  const startBlock = directChildOf(start, parent)
  const endBlock = directChildOf(end, parent)
  if (!startBlock || !endBlock) return []

  const blocks: HTMLElement[] = []
  for (
    let element = startBlock.nextElementSibling;
    element && element !== endBlock;
    element = element.nextElementSibling
  ) {
    if (element instanceof HTMLElement && element.textContent?.trim())
      blocks.push(element)
  }
  return blocks
}

function fontOf(style: CSSStyleDeclaration): string {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
}

function spacingOf(style: CSSStyleDeclaration): number {
  return style.letterSpacing === 'normal'
    ? 0
    : Number.parseFloat(style.letterSpacing) || 0
}

function extractInlineContent(target: HTMLElement): InlineContent {
  const base = getComputedStyle(target)
  const content: InlineContent = { items: [], annotations: new Map() }
  const pushText = (text: string) => {
    if (!text) return
    const last = content.items.at(-1)
    if (last && !content.annotations.has(content.items.length - 1))
      last.text += text
    else
      content.items.push({
        text,
        font: fontOf(base),
        letterSpacing: spacingOf(base),
      })
  }

  for (const node of target.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(node.nodeValue ?? '')
      continue
    }
    if (!(node instanceof HTMLElement)) continue

    const annotated = node.querySelector<HTMLElement>(
      '[class*="AnnotatedText"]',
    )
    if (!annotated) {
      pushText(node.textContent ?? '')
      continue
    }

    const text = [...annotated.childNodes]
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.nodeValue ?? '')
      .join('')
    if (!text) continue

    const indicator = annotated.querySelector<HTMLElement>(
      '[class*="Indicator"]',
    )
    const annotationContent = node.querySelector<HTMLElement>(
      '[class*="AnnotationContent"]',
    )
    const style = getComputedStyle(annotated)
    content.annotations.set(content.items.length, {
      className: annotated.className,
      indicatorHTML: indicator?.outerHTML ?? '',
      contentTemplate:
        (annotationContent?.cloneNode(true) as HTMLElement | undefined) ??
        document.createElement('div'),
    })
    content.items.push({
      text,
      font: fontOf(style),
      letterSpacing: spacingOf(style),
      extraWidth: indicator?.getBoundingClientRect().width ?? 0,
    })
  }
  const numericContent: InlineContent = { items: [], annotations: new Map() }
  for (const [index, item] of content.items.entries()) {
    const parts = item.text.split(/([（(]?[0-9０-９]+(?:[,.，．][0-9０-９]+)*[）)]?)/u)
    const annotation = content.annotations.get(index)
    for (const [partIndex, text] of parts.entries()) {
      if (!text) continue
      if (annotation)
        numericContent.annotations.set(numericContent.items.length, annotation)
      numericContent.items.push({
        ...item,
        text,
        break: partIndex % 2 ? 'never' : 'normal',
        extraWidth: 0,
      })
    }
    const last = numericContent.items.at(-1)
    if (last) last.extraWidth = item.extraWidth
  }
  return numericContent
}

function readNumber(value: string): number {
  return Number.parseFloat(value) || 0
}

export function createBlockData(block: HTMLElement): BlockData {
  const style = getComputedStyle(block)
  const content = extractInlineContent(block)
  return {
    template: block.cloneNode(false) as HTMLElement,
    heading: block.matches(HEADING_SELECTOR),
    content,
    prepared: content.items.length ? prepareRichInline(content.items) : null,
    pad: {
      left: readNumber(style.paddingLeft),
      right: readNumber(style.paddingRight),
      top: readNumber(style.paddingTop),
      bottom: readNumber(style.paddingBottom),
    },
    margin: {
      top: readNumber(style.marginTop),
      bottom: readNumber(style.marginBottom),
    },
    lineHeight:
      style.lineHeight === 'normal'
        ? readNumber(style.fontSize) * 1.5
        : readNumber(style.lineHeight),
  }
}
