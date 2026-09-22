function escapeAttribute(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function generateEmbedCode(
  componentName: string,
  attributes: Record<string, unknown>,
): string {
  const timestamp =
    import.meta.env.VITE_BUILD_TIMESTAMP ?? '<version-timestamp>'
  const scriptPath = `components/${componentName}/${componentName}-${timestamp}.js`
  const scriptUrl =
    typeof window === 'undefined'
      ? `$BASE_URL/${scriptPath}`
      : new URL(`../${scriptPath}`, window.location.href).href
  const serializedAttributes = Object.entries(attributes)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== false,
    )
    .map(([name, value]) =>
      value === true ? name : `${name}="${escapeAttribute(value)}"`,
    )
    .map((attribute) => `  ${attribute}`)
    .join('\n')
  const tagName = `twreporter-${componentName}`

  return [
    `<script type="module" src="${scriptUrl}"></script>`,
    `<link rel="stylesheet" href="https://projects.twreporter.org/twreporter/ddd/shared/embed.css">`,
    `<div class="embed-code-container">`,
    `<${tagName}${serializedAttributes ? `\n${serializedAttributes}\n` : ''}></${tagName}>`,
    `</div>`,
  ].join('\n')
}
