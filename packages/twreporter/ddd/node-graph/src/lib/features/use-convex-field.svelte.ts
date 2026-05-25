export type ConvexField<T> = {
  value: T | undefined
}

export function useConvexOptimisticUpdateValue<T>(
  getState: () => T,
  setState: (newState: T) => any,
) {
  return {
    get value() {
      return getState()
    },
    set value(newState) {
      setState(newState)
    },
  }
}
