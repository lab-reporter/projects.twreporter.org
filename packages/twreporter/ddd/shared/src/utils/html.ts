export function serializeHTMLAttr(attributes: object) {
  return Object.entries(attributes)
    .map(([name, value]) => {
      const url = value ? new URL(value, document.baseURI).href : ''
      const escaped = url
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `  ${name}="${escaped}"`
    })
    .join('\n')
}
