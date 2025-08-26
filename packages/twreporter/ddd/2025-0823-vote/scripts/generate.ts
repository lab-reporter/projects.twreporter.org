import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

type Attr = {
  [key: string]: string
}

type IFrameConfig = {
  comp: string
  attr: Attr[]
}

type Config = {
  [key: string]: IFrameConfig
}

const STORAGE_BASE_URL =
  'https://projects.twreporter.org/twreporter/ddd/2025-0823-vote'

// iframe HTML
function createIframeHTML(iframe: IFrameConfig): string {
  const { comp, attr } = iframe

  const attrString = Object.entries(attr)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n      ')

  return `<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
      crossorigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Roboto+Slab:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <script
      type="module"
      src="${`${STORAGE_BASE_URL}/index.js?ignoreCache=0`}"
      defer
    ></script>
    <meta charset="UTF-8">
  </head>
  <body style="overflow: hidden;">
    <${comp}
      ${attrString}
    ></${comp}>
  </body>
</html>`
}

function buildEmbedCode(key: string, dl: boolean = false) {
  return `<div
  style="
    position: relative;
    width: 100%;
    height: 0px;
    padding: ${
      dl
        ? 'clamp(0px, 150%, 1095px) 0px 0px'
        : 'clamp(0px, 125%, 912.5px) 0px 0px'
    };
    overflow: hidden;
    will-change: transform;
  "
>
  <iframe
    src="${`${STORAGE_BASE_URL}/iframe/${key}.html${
      dl ? '?ignoreCache=0&download' : '?ignoreCache=0'
    }`}"
    allowfullscreen=""
    allow="fullscreen"
    loading="lazy"
    style="
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      border: none;
      padding: 0px;
      margin: 0px;
      overflow: hidden;
    "
  ></iframe>
</div>`
}

function buildWebComponent(iframe: IFrameConfig): string {
  const { comp, attr } = iframe

  const attrString = Object.entries(attr)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  return `
  <${comp} ${attrString}
  ></${comp}>`
}

function createDownloadPageHTML(config: Config) {
  const components = Object.entries(config).map(([key, iframe]) => ({
    wc: buildWebComponent(iframe),
    iframe: buildEmbedCode(key),
  }))

  const iframes = components.map((c) => c.iframe).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- [FONTS] Fetch from base document -->
    <link
      rel="preconnect"
      href="https://fonts.googleapis.com"
      crossorigin="anonymous"
    />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&amp;family=Roboto+Slab:wght@100..900&amp;display=swap"
      rel="stylesheet"
      crossorigin="anonymous"
    />
    <!-- [FONTS] End -->

    <title>[Dev] 2025-0823-vote</title>
    <script
      type="module"
      crossorigin=""
      src="${STORAGE_BASE_URL}/index.js?ignoreCache=0"
    ></script>
  </head>
  <body style="background: #f1f1f1">
  <h1>2025-0823-vote</h1>
    <textarea disabled style="width: 100%; max-width: 730px; height: 120px; margin: 10px 0;">${iframes}</textarea>
    ${components
      .map(
        (
          c
        ) => `<div style="margin: 10px 0;"><textarea disabled style="width: 100%; max-width: 730px; height: 120px;">${c.iframe}</textarea>
      ${c.wc}</div>
      `
      )
      .join('\n')}
  </body>
</html>`
}

function initConfig(configPath: string, outputDir: string) {
  const fileContents = fs.readFileSync(configPath, 'utf8')
  const config = yaml.load(fileContents) as Config

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  return config
}

function generateHTMLFiles(
  configPath: string = './output.yml',
  outputDir: string = './iframe'
) {
  try {
    const config = initConfig(configPath, outputDir)

    Object.entries(config).forEach(([key, iframeConfig]) => {
      const iframe = createIframeHTML(iframeConfig)

      fs.writeFileSync(path.join(outputDir, `${key}.html`), iframe, 'utf8')

      console.log(`[iframe] HTML created for: ${key}`)
    })

    fs.writeFileSync(
      path.join(outputDir, 'wc.html'),
      createDownloadPageHTML(config)
    )

    console.log('[Web Component] Download page created.')
  } catch (error) {
    console.error('[Error]', error)
  }
}

function main() {
  generateHTMLFiles()
}

main()
