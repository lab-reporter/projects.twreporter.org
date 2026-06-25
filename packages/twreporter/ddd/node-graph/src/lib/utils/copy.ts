import { toast } from 'svelte-sonner'

export async function copyToClipboard(text?: string) {
  if (!text) return

  return navigator.clipboard
    .writeText(text)
    .then(() => toast.success('已複製'))
    .catch(() => toast.error('無法複製'))
}
