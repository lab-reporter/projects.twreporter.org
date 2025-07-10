'use client'

import { useStore } from '@/stores'
import { useEffect, useState } from 'react'
import Image from 'next/image';

export default function LoadingScreen() {
  const { isLoading, setLoadingProgress } = useStore()
  const [showLoading, setShowLoading] = useState(true)
  const logoSrc = '/assets/nav_logo--light.svg'

  // 快速完成載入，直接進入 Section 1 開場動畫
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingProgress(1); // 直接設置為完成
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
    <div className={`fixed inset-0 z-[10000] bg-white flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'
      }`}>
      {/* 簡潔的載入畫面，準備進入 Section 1 開場動畫 */}
      <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
        {/* 網站標誌 */}
        <Image
          src={logoSrc}
          alt="Logo"
          width={240}
          height={60}
          priority={true}
          className="h-15 w-auto scale-150"
        />
      </div>
    </div>
  )
}