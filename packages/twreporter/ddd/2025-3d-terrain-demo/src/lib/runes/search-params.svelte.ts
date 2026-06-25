export function useSearchParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}
