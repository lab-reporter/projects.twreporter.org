'use client'

import Scene from '@/components/Scene'
import LoadingScreen from '@/components/LoadingScreen'
import { useStore } from '@/stores'
import { useEffect } from 'react'

export default function Home() {
  const { setLoadingProgress } = useStore()
  
  useEffect(() => {
    // 模擬載入進度
    let progress = 0
    const interval = setInterval(() => {
      progress += 0.01
      setLoadingProgress(progress)
      
      if (progress >= 1) {
        clearInterval(interval)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [setLoadingProgress])
  
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <LoadingScreen />
      
      <Scene>
        {/* 基礎場景設置 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* 測試用的基礎幾何體 */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      </Scene>
      
      {/* 臨時的開發資訊 */}
      <div className="absolute top-4 left-4 z-40 text-white text-sm bg-black/50 p-4 rounded">
        <h2 className="font-bold mb-2">R3F 10th Recap - 開發中</h2>
        <p>✅ 基礎專案架構</p>
        <p>✅ Zustand 狀態管理</p>
        <p>✅ R3F Scene 設置</p>
        <p>⏳ 組件重構進行中...</p>
      </div>
    </main>
  )
}
