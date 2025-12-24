window.addEventListener('message', (event) => {
  if (
    event.origin !== 'https://projects.twreporter.org' &&
    !event.origin.startsWith('http://localhost')
  )
    return

  const sourceId = event.data.source

  const iframe = document.getElementById(sourceId)

  if (!iframe || !event.data.bodyHeight) return

  iframe.style.height = event.data.bodyHeight + 'px'
})
