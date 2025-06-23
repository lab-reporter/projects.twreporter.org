"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UiProvider } from './context/UiContext';
import Navigation from './components/Navigation';

// 404 頁面內容組件
function NotFoundContent() {
    const router = useRouter();

    // 處理返回首頁
    const handleGoHome = () => {
        router.push('/');
    };

    // 處理返回上一頁
    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* 導航欄 */}
            <Navigation />

            {/* 主要內容 */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-2xl mx-auto">
                    {/* 404 大數字 */}
                    <div className="mb-8">
                        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text leading-none">
                            404
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#C40D23] to-[#FF6B6B] mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* 標題和說明 */}
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            找不到您要的頁面
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-2">
                            抱歉，您要查看的頁面可能已被移動、刪除，
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            或者網址輸入錯誤。
                        </p>
                    </div>

                    {/* 行動按鈕 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button
                            onClick={handleGoHome}
                            className="w-full sm:w-auto px-8 py-3 bg-[#C40D23] text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-[#9B051E] hover:shadow-lg hover:shadow-red-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200"
                        >
                            回到首頁
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// 主要的 404 頁面組件，包含 UiProvider
export default function NotFound() {
    return (
        <UiProvider>
            <NotFoundContent />
        </UiProvider>
    );
} 