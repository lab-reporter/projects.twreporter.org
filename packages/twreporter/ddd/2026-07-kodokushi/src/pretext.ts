import {
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
  type RichInlineCursor,
} from '@chenglou/pretext/rich-inline'
import { createBlockData, type Annotation, type BlockData } from './content'
import {
  blockedIntervals,
  createMask,
  createMediaElement,
  EDITOR_MODE,
  type IllustrationMask,
  type IndexedSpec,
} from './illustrations'
import { createElement } from './lib/dom'
import { subtractIntervals } from './lib/layout'

const BASE_WIDTH = 580

type PositionedMask = { mask: IllustrationMask; top: number }
type AnnotationState = {
  spans: HTMLElement[]
  lastY: number
  blockTop: number
  shell: HTMLElement
}

function createFlowTarget(
  blocks: HTMLElement[],
  blockData: BlockData[],
): HTMLElement {
  const reference =
    blocks.find((_, index) => !blockData[index].heading) ?? blocks[0]
  const target = createElement('div', {
    className: reference.className,
    style: {
      cssText: reference.style.cssText,
      padding: '0',
      marginTop: '0',
      marginBottom: '0',
    },
  })
  target.dataset.dddFlow = ''
  blocks[0].before(target)
  for (const block of blocks) block.remove()
  return target
}

function appendAnnotationPopovers(
  annotations: Map<Annotation, AnnotationState>,
): void {
  for (const [annotation, state] of annotations) {
    state.spans
      .at(-1)
      ?.insertAdjacentHTML('beforeend', annotation.indicatorHTML)
    const popover = annotation.contentTemplate.cloneNode(true) as HTMLElement
    Object.assign(popover.style, {
      position: 'absolute',
      top: `${state.lastY - state.blockTop + 4}px`,
      left: '0',
      right: '0',
      zIndex: '2',
      // Custom annotation style below
      backdropFilter: 'blur(10px)',
      background: 'rgba(255, 255, 255, 0.8)',
    })
    state.shell.append(popover)
    for (const span of state.spans)
      span.addEventListener('click', () => {
        popover.style.display =
          popover.style.display === 'block' ? 'none' : 'block'
      })
  }
}

function mediaBottom(positioned: PositionedMask[], scale: number): number {
  return positioned.reduce(
    (bottom, { mask, top }) =>
      Math.max(
        bottom,
        top + (mask.width * scale * mask.sampleHeight) / mask.sampleWidth,
      ),
    0,
  )
}

export async function rewrapSection(
  blocks: HTMLElement[],
  specs: IndexedSpec[],
): Promise<(() => void) | undefined> {
  const blockData = blocks.map(createBlockData)
  const masks = (await Promise.allSettled(specs.map(createMask))).flatMap(
    (result) => (result.status === 'fulfilled' ? [result.value] : []),
  )
  if (!masks.length) return

  const masksByAnchor = new Map<number, IllustrationMask[]>()
  for (const mask of masks) {
    const anchored = masksByAnchor.get(mask.anchor) ?? []
    anchored.push(mask)
    masksByAnchor.set(mask.anchor, anchored)
    if (mask.anchor >= blockData.length)
      console.warn(
        `Illustration ${mask.index} targets missing block ${mask.anchor}`,
      )
  }

  const target = createFlowTarget(blocks, blockData)
  // Clip at the viewport, allowing illustrations to extend past the text column.
  const clipping = createElement('style', {
    textContent: 'html { overflow-x: clip; } body { overflow: clip visible; }',
  })
  document.head.append(clipping)
  let lastWidth = 0

  const paint = () => {
    const width = target.clientWidth
    if ((!EDITOR_MODE && width === lastWidth) || width <= 0) return
    lastWidth = width

    const reference = blockData.find((block) => !block.heading) ?? blockData[0]
    const contentWidth = width - reference.pad.left - reference.pad.right
    const scale = contentWidth / BASE_WIDTH
    const output = document.createDocumentFragment()
    const annotations = new Map<Annotation, AnnotationState>()
    const positioned: PositionedMask[] = []
    let y = 0
    let previousMargin = 0

    for (const [blockIndex, block] of blockData.entries()) {
      y += Math.max(previousMargin, block.margin.top)
      const blockTop = y
      const blockWidth = width - block.pad.left - block.pad.right

      for (const mask of masksByAnchor.get(blockIndex) ?? []) {
        const top = blockTop + mask.top * scale
        positioned.push({ mask, top })
        output.append(createMediaElement(mask, scale, paint, top))
      }

      const shell = block.template.cloneNode(false) as HTMLElement
      Object.assign(shell.style, {
        position: 'absolute',
        top: `${blockTop}px`,
        left: '0',
        width: '100%',
        margin: '0',
        boxSizing: 'border-box',
      })
      output.append(shell)

      let localY = 0
      const data = block.prepared
      if (data) {
        let cursor: RichInlineCursor | undefined
        while (true) {
          const rowY = blockTop + block.pad.top + localY
          const blocked = positioned.flatMap(({ mask, top }) =>
            [
              rowY + 3,
              rowY + block.lineHeight / 2,
              rowY + block.lineHeight - 3,
            ].flatMap((row) =>
              blockedIntervals(mask, row, scale, top).map(
                ([start, end]): [number, number] => [
                  start - block.pad.left,
                  end - block.pad.left,
                ],
              ),
            ),
          )
          const segments = subtractIntervals(blockWidth, blocked)
          let progressed = false

          for (const [start, end] of segments) {
            const range = layoutNextRichInlineLineRange(
              data,
              end - start,
              cursor,
            )
            if (!range) continue

            if (range.width > end - start && end - start < blockWidth) continue

            progressed = true
            const line = materializeRichInlineLineRange(data, range)
            let x = block.pad.left + start
            for (const fragment of line.fragments) {
              x += fragment.gapBefore
              const item = block.content.items[fragment.itemIndex]
              const annotation = block.content.annotations.get(
                fragment.itemIndex,
              )
              const span = createElement('span', {
                textContent: fragment.text,
                className: annotation?.className ?? '',
                style: {
                  font: item.font,
                  letterSpacing: `${item.letterSpacing ?? 0}px`,
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${block.pad.top + localY}px`,
                  lineHeight: `${block.lineHeight}px`,
                  whiteSpace: 'nowrap',
                  ...(annotation ? { cursor: 'pointer' } : {}),
                },
              })
              if (annotation) {
                const state = annotations.get(annotation) ?? {
                  spans: [],
                  lastY: 0,
                  blockTop,
                  shell,
                }
                state.spans.push(span)
                state.lastY = rowY + block.lineHeight
                annotations.set(annotation, state)
              }
              shell.append(span)
              x += fragment.occupiedWidth
            }
            cursor = line.end
          }

          localY += block.lineHeight
          if (!progressed) continue
          if (!layoutNextRichInlineLineRange(data, blockWidth, cursor)) break
        }
      }

      const blockHeight = block.pad.top + localY + block.pad.bottom
      shell.style.height = `${blockHeight}px`
      y = blockTop + blockHeight
      previousMargin = block.margin.bottom
    }
    y += previousMargin

    appendAnnotationPopovers(annotations)
    target.style.position = 'relative'
    target.style.overflow = 'visible'
    target.style.height = `${Math.max(y, mediaBottom(positioned, scale))}px`
    target.replaceChildren(output)
  }

  paint()
  window.addEventListener('resize', paint)
  return () => {
    window.removeEventListener('resize', paint)
    clipping.remove()
    target.replaceWith(...blocks)
  }
}
