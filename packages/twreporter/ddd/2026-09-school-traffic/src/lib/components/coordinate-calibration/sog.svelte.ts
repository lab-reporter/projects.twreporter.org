import {
  Application,
  ASPECT_MANUAL,
  Asset,
  Color,
  DEVICETYPE_WEBGL2,
  DEVICETYPE_WEBGPU,
  Entity,
  FILLMODE_NONE,
  GSPLATDATA_COMPACT,
  PROJECTION_ORTHOGRAPHIC,
  RESOLUTION_AUTO,
  createGraphicsDevice,
  type CameraComponent,
  type Layer,
} from 'playcanvas'
import type { ViewportView } from './viewport.svelte.ts'

export class SogScene {
  loading = $state(true)
  error = $state('')
  app: Application | undefined
  camera: Entity | undefined
  view: ViewportView = { width: 1, height: 1, x: 0, y: 0, k: 1, rotation: 0 }

  mount(canvas: HTMLCanvasElement, url: string) {
    let destroyed = false
    void createGraphicsDevice(canvas, {
      deviceTypes: [DEVICETYPE_WEBGPU, DEVICETYPE_WEBGL2],
      antialias: false,
    })
      .then((device) => {
        if (destroyed) {
          device.destroy()
          return
        }
        const app = new Application(canvas, { graphicsDevice: device })
        this.app = app
        device.maxPixelRatio = 1
        app.setCanvasFillMode(FILLMODE_NONE, this.view.width, this.view.height)
        app.setCanvasResolution(RESOLUTION_AUTO)
        app.scene.gsplat.splatBudget = 4_000_000
        app.scene.gsplat.dataFormat = GSPLATDATA_COMPACT
        app.scene.gsplat.lodDistanceShrink = 0
        app.scene.gsplat.lodUnderfillLimit = 1
        app.scene.gsplat.useTonemap = false
        app.scene.gsplat.useFog = false

        const camera = new Entity('Calibration camera', app)
        camera.addComponent('camera', {
          projection: PROJECTION_ORTHOGRAPHIC,
          aspectRatioMode: ASPECT_MANUAL,
          clearColor: new Color(0.09, 0.13, 0.15),
          nearClip: 0.1,
          farClip: 2000,
        })
        camera.setEulerAngles(-90, 0, 0)
        app.root.addChild(camera)
        this.camera = camera
        this.setView(this.view)

        const asset = new Asset('Calibration SOG', 'gsplat', {
          url,
          filename: 'lod-meta.json',
        })
        asset.on('error', (message: string) => {
          this.error = message
          this.loading = false
        })
        asset.ready(() => {
          if (destroyed) return
          const splat = new Entity('Streamed GSplat', app)
          splat.setPosition(0, -3.25, 0)
          splat.setEulerAngles(0, 0, 180)
          splat.setLocalScale(10, 10, 10)
          splat.addComponent('gsplat', {
            asset,
            unified: true,
            lodBaseDistance: 50,
            lodMultiplier: 1.5,
            castShadows: false,
          })
          app.root.addChild(splat)
        })
        const gsplatSystem = app.systems.gsplat
        if (!gsplatSystem) throw new Error('The GSplat system is unavailable.')
        gsplatSystem.on(
          'frame:ready',
          (
            _camera: CameraComponent,
            _layer: Layer,
            ready: boolean,
            loadingCount: number,
          ) => {
            if (ready && loadingCount === 0) this.loading = false
          },
        )
        app.assets.add(asset)
        app.assets.load(asset)
        app.start()
      })
      .catch((cause) => {
        if (!destroyed) {
          this.error =
            cause instanceof Error
              ? cause.message
              : 'Unable to initialize the SOG viewer.'
          this.loading = false
        }
      })

    return () => {
      destroyed = true
      this.app?.destroy()
      this.app = undefined
      this.camera = undefined
    }
  }

  setView(view: ViewportView) {
    this.view = view
    if (
      !this.app ||
      !this.camera?.camera ||
      view.width <= 1 ||
      view.height <= 1
    )
      return
    this.app.resizeCanvas(view.width, view.height)
    const halfHeight = view.height / (2 * view.k)
    this.camera.camera.aspectRatio = view.width / view.height
    this.camera.camera.orthoHeight = halfHeight
    const center = new DOMMatrix().rotate(-view.rotation).transformPoint({
      x: (view.width / 2 - view.x) / view.k,
      y: (view.height / 2 - view.y) / view.k,
    })
    this.camera.setEulerAngles(-90, view.rotation, 0)
    this.camera.setPosition(center.x, Math.max(35, halfHeight * 2), center.y)
    this.app.renderNextFrame = true
  }
}
