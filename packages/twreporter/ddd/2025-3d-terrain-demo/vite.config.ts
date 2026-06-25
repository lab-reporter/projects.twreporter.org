import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumSource = 'node_modules/cesium/Build/Cesium'
const cesiumBaseUrl = 'static/cesium'
const timestamp = new Date().getTime()
const isProdRelease = process.env.RELEASE === 'prod'
const appBase = isProdRelease
  ? '/twreporter/ddd/2025-3d-terrain-demo/js'
  : '/data-reporter-infographics/dev/2025-3d-terrain-demo/js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      svelte({
        compilerOptions: {
          customElement: true,
        },
      }),
      viteStaticCopy({
        targets: [
          { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
        ],
      }),
    ],
    define: {
      CESIUM_BASE_URL: JSON.stringify(env.VITE_CESIUM_BASE_URL),
    },
    base: appBase,
    build: {
      rollupOptions: {
        output: {
          entryFileNames: isProdRelease
            ? `assets/[name]-${timestamp}.js`
            : 'assets/[name].js',
          chunkFileNames: isProdRelease
            ? `assets/[name]-${timestamp}.js`
            : 'assets/[name].js',
          assetFileNames: isProdRelease
            ? `assets/[name]-${timestamp}.[ext]`
            : 'assets/[name].[ext]',
        },
      },
    },
  }
})
