import { toast } from 'svelte-sonner'

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
type AsyncFn = (...args: any[]) => Promise<any>

export function tryCatchToast<T extends AsyncFn>(
  func: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null> {
  return async (...args: Parameters<T>) => {
    try {
      return await func(...args)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '發生錯誤')
      return null
    }
  }
}
