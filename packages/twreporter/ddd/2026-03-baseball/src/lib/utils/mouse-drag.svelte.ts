const DRAG_THRESHOLD = 4

export class MouseDrag {
  offset = $state({ x: 0, y: 0 })
  isDragging = $state(false)
  isMousePointer = $state(false)

  #pointerDown = false
  #start = { x: 0, y: 0, offsetX: 0, offsetY: 0 }

  reset() {
    this.offset = { x: 0, y: 0 }
  }

  handlePointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    this.isMousePointer = true
    this.#pointerDown = true
    this.isDragging = false
    this.#start = {
      x: e.clientX,
      y: e.clientY,
      offsetX: this.offset.x,
      offsetY: this.offset.y,
    }
  }

  handlePointerMove = (e: PointerEvent) => {
    if (!this.#pointerDown) return
    const dx = e.clientX - this.#start.x
    const dy = e.clientY - this.#start.y
    if (!this.isDragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)
        return
      this.isDragging = true
    }
    this.offset = { x: this.#start.offsetX + dx, y: this.#start.offsetY + dy }
  }

  handlePointerUp = () => {
    this.#pointerDown = false
    this.isDragging = false
  }
}
