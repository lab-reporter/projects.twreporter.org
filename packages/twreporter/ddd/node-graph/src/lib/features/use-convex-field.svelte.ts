export function useConvexField<T>(
  getRemote: () => T | undefined,
  mutate: (v: T) => void,
  delay = 300,
) {
  let value = $state<T | undefined>(undefined)
  let lastSynced: T | undefined
  let timer: ReturnType<typeof setTimeout>

  $effect(() => {
    const remote = getRemote()
    if (remote !== undefined && remote !== lastSynced) {
      value = remote
      lastSynced = remote
    }
  })

  $effect(() => {
    if (value === undefined || value === lastSynced) return
    const v = value
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastSynced = v
      mutate(v)
    }, delay)
  })

  return {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
  }
}
