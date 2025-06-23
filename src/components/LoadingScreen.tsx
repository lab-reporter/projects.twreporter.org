'use client'

import { useStore } from '@/stores'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const { isLoading, loadingProgress } = useStore()
  const [showLoading, setShowLoading] = useState(true)
  
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
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="text-2xl font-light mb-4">Loading...</div>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {Math.round(loadingProgress * 100)}%
        </div>
      </div>
    </div>
  )
}