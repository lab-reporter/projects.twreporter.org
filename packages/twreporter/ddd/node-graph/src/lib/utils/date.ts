const dateTimeFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: number | Date) {
  return dateTimeFormatter.format(
    value instanceof Date ? value : new Date(value),
  )
}
