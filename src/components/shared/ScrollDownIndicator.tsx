'use client'

import React from 'react'
import Image from 'next/image'

export default function ScrollDownIndicator() {
  return (
    <>
      <style jsx>{`
        @keyframes scrollDown {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="mt-2 w-8 h-8"
        style={{
          animation: 'scrollDown 2s ease-in-out infinite'
        }}
      >
        <Image src="/assets/icon-scroll-down.svg"
          alt="report-banner-icon" width={24} height={24} className="w-full h-full" />
      </div>
    </>
  )
}