'use client'

import { useStore } from '@/stores'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'

export default function LoadingScreen() {
  const { isLoading, setLoadingProgress } = useStore()
  const [showLoading, setShowLoading] = useState(true)


  // 快速完成載入，直接進入 Section 1 開場動畫
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingProgress(1); // 直接設置為完成
    }, 300); // 300ms 後直接完成載入

    return () => clearTimeout(timer);
  }, [setLoadingProgress]);

  useEffect(() => {
    if (!isLoading) {
      // 立即隱藏 LoadingScreen，讓 useMainTimeline 接手
      setShowLoading(false)
    }
  }, [isLoading])

  if (!showLoading) return null

  return (
    <div className={`fixed inset-0 z-[10000] bg-white ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      {/* 載入期間顯示 Navigation，由 Navigation 組件自己設定初始狀態 */}
      <Navigation />
    </div>
  )
}