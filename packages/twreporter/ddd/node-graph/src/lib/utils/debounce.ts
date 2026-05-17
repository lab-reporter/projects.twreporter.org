export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
