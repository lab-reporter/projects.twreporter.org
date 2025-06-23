'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useStore } from '@/stores'

interface SceneProps {
  children: React.ReactNode
}

export default function Scene({ children }: SceneProps) {
  const { cameraPosition, cameraTarget, cameraFOV, quality } = useStore()
  
  // 根據品質調整設定
  const getSceneSettings = () => {
    switch (quality) {
      case 'high':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }
      case 'medium':
        return {
          shadows: true,
          antialias: false,
          pixelRatio: 1,
        }
      case 'low':
        return {
          shadows: false,
          antialias: false,
          pixelRatio: 1,
        }
      default:
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }
    }
  }
  
  const settings = getSceneSettings()
  
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{
          position: cameraPosition,
          fov: cameraFOV,
          near: 0.1,
          far: 10000,
        }}
        shadows={settings.shadows}
        gl={{
          antialias: settings.antialias,
          pixelRatio: settings.pixelRatio,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}