'use client'

import { useStore } from '@/stores'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const { isLoading, setLoadingProgress } = useStore()
  const [showLoading, setShowLoading] = useState(true)
  
  // 快速完成載入，直接進入 Section 1 開場動畫
  useEffect(() => {
    console.log('LoadingScreen: Starting quick loading');
    const timer = setTimeout(() => {
      setLoadingProgress(1); // 直接設置為完成
      console.log('LoadingScreen: Loading complete, entering Section 1');
    }, 300); // 300ms 後直接完成載入

    return () => clearTimeout(timer);
  }, [setLoadingProgress]);
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])
  
  if (!showLoading) return null
  
  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* 簡潔的載入畫面，準備進入 Section 1 開場動畫 */}
      <div className="text-center text-white">
        <div className="text-3xl font-light mb-4">報導者</div>
        <div className="text-lg text-gray-400">十週年回顧</div>
        <div className="mt-8">
          <div className="animate-pulse text-sm text-gray-500">
            載入中...
          </div>
        </div>
      </div>
    </div>
  )
}