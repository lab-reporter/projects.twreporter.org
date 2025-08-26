export function textTemplate(data: Record<string, any>, template: string) {
  return template.replace(/{{(.*?)}}/g, (substring, key) => {
    return data[key.trim()] ?? ''
  })
}
