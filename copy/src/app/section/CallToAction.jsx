"use client";

import dynamic from 'next/dynamic';
// 移除 UiContext 引用，不再需要背景色管理

// 使用 dynamic import 避免 SSR 渲染問題
const BackgroundBlocks = dynamic(() => import('../components/BackgroundBlocks'), {
    ssr: false
});

export default function CallToAction({ children }) {
    // 移除背景色管理功能，簡化組件

    return (
        <div className="w-full h-full relative  bg-black">
            {/* 背景方塊效果 */}
            <BackgroundBlocks
                className="absolute inset-0 z-0"
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
} 