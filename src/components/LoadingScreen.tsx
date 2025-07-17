'use client'

import { useStore } from '@/stores'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const { isLoading, setLoadingProgress } = useStore()
  const [showLoading, setShowLoading] = useState(true)


  // 快速完成載入，直接進入 Section 1 開場動畫
  useEffect(() => {
    console.log('LoadingScreen mounted, setting progress to 1 in 300ms');
    const timer = setTimeout(() => {
      console.log('Setting loading progress to 1');
      setLoadingProgress(1); // 直接設置為完成
    }, 300); // 300ms 後直接完成載入

    return () => clearTimeout(timer);
  }, [setLoadingProgress]);

  useEffect(() => {
    console.log('isLoading changed to:', isLoading);
    if (!isLoading) {
      // 立即隱藏 LoadingScreen
      console.log('Setting showLoading to false');
      setShowLoading(false)
    }
  }, [isLoading])

  console.log('LoadingScreen render - showLoading:', showLoading, 'isLoading:', isLoading);
  
  if (!showLoading) return null

  return (
    <div 
      className={`fixed inset-0 z-[10000] bg-white transition-all duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 載入畫面內容 - 不包含 Navigation，讓它在 page.tsx 中獨立顯示 */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </div>
    </div>
  )
}