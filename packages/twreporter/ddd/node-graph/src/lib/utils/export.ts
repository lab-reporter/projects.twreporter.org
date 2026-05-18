import { domToPng } from 'modern-screenshot'
import { toast } from 'svelte-sonner'

export async function exportAndDownloadImage({
  ref,
  title,
}: {
  ref?: HTMLElement | null
  title?: string
}) {
  if (!ref) return
  return domToPng(ref, {
    quality: 1,
    scale: 3,
  })
    .then((dataUrl) => {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${title ?? '圖表'}／報導者.png`
      a.click()
    })
    .catch((err) => {
      console.error(err)
      toast.error('無法匯出圖表')
    })
}
