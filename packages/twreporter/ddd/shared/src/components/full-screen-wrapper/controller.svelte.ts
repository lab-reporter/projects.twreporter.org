import { createNoScroll } from '@fluejs/noscroll'
import { tick } from 'svelte'
import type { Action } from 'svelte/action'

let restorePagePosition: (() => void) | undefined

const { disablePageScroll, enablePageScroll } = createNoScroll({
  onScrollDisable(body) {
    const { scrollX, scrollY } = window
    const properties = ['position', 'top', 'left', 'width', 'box-sizing']
    const styles = properties.map((property) => ({
      property,
      value: body.style.getPropertyValue(property),
      priority: body.style.getPropertyPriority(property),
    }))
    const hiddenPrintStyle = document.createElement('style')
    hiddenPrintStyle.textContent =
      'body .hidden-print { display: none !important; }'
    document.head.append(hiddenPrintStyle)

    body.style.setProperty('position', 'fixed')
    body.style.setProperty('top', `${-scrollY}px`)
    body.style.setProperty('left', `${-scrollX}px`)
    body.style.setProperty('width', '100%')
    body.style.setProperty('box-sizing', 'border-box')

    restorePagePosition = () => {
      hiddenPrintStyle.remove()
      for (const { property, value, priority } of styles) {
        if (value) body.style.setProperty(property, value, priority)
        else body.style.removeProperty(property)
      }
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
    }
  },
  onScrollEnable() {
    restorePagePosition?.()
    restorePagePosition = undefined
  },
})

export function createWrapperController() {
  let scrollLock = $state(false)
  let buttonVisible = $state(true)
  let element: HTMLElement | undefined

  const attach: Action = (node) => {
    element = node
    $effect(() => {
      if (!scrollLock) return
      node.scrollIntoView({ behavior: 'instant', block: 'start' })
      disablePageScroll()
      return enablePageScroll
    })
    return {
      destroy() {
        element = undefined
      },
    }
  }

  return {
    attach,
    get scrollLock() {
      return scrollLock
    },
    get buttonVisible() {
      return buttonVisible
    },
    lock() {
      scrollLock = true
    },
    async release() {
      const node = element
      if (!scrollLock || !node) return
      scrollLock = false
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      await tick()
      if (scrollLock || element !== node) return
      window.scrollTo({
        behavior: 'smooth',
        top: window.scrollY + node.getBoundingClientRect().bottom,
      })
    },
    setButtonVisible(visible: boolean) {
      buttonVisible = visible
    },
  }
}

export type WrapperController = ReturnType<typeof createWrapperController>
