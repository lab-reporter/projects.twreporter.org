'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/stores';
import SplineLoader from './SplineLoader';

/**
 * OpeningSpline 組件
 * 
 * 功能說明：
 * 1. 顯示網站開場動畫，使用 Spline 3D 場景
 * 2. 提供 fallback 機制，當 Spline 載入失敗時顯示載入畫面
 * 3. 載入時間依據實際 Spline 載入速度決定
 * 4. 自動播放 12 秒後淡出，或使用者可手動點擊 SKIP 跳過
 * 5. 開場期間鎖定頁面滾動，結束後解鎖
 */


/**
 * OpeningSpline 主組件
 * 
 * 管理整個開場動畫的生命週期：
 * 1. 控制動畫的顯示/隱藏
 * 2. 處理淡出效果
 * 3. 管理 SKIP 按鈕
 * 4. 控制頁面滾動鎖定
 */
export default function OpeningSpline() {
    // 組件可見性狀態
    const [isVisible, setIsVisible] = useState(true); // 組件是否顯示
    const [isFading, setIsFading] = useState(false); // 是否正在淡出
    const [isMounted, setIsMounted] = useState(false); // 組件是否已掛載（避免 SSR 問題）
    const [showSkipButton, setShowSkipButton] = useState(false); // 是否顯示 SKIP 按鈕

    // 計時器引用（使用 ref 確保在清理時能正確訪問）
    const timerRef = useRef<NodeJS.Timeout | null>(null); // 12 秒自動關閉計時器
    const fadeTimerRef = useRef<NodeJS.Timeout | null>(null); // 淡出動畫計時器

    // 全域狀態更新函數
    const setOpeningComplete = useStore((state) => state.setOpeningComplete);

    // 組件掛載時設置 mounted 狀態
    useEffect(() => {
        setIsMounted(true); // 標記組件已在客戶端掛載

        // 清理函數：確保組件卸載時清理所有計時器
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (fadeTimerRef.current) {
                clearTimeout(fadeTimerRef.current);
            }
        };
    }, []);

    // 管理頁面滾動鎖定
    // 開場動畫期間防止使用者滾動頁面
    useEffect(() => {
        if (isVisible) {
            // 鎖定滾動：同時設置 body 和 html 確保跨瀏覽器相容
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            // 解鎖滾動：清空樣式恢復預設行為
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        // 清理函數：確保組件卸載時恢復滾動
        // 避免意外情況導致頁面永久無法滾動
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isVisible]);

    // Spline 載入完成的處理函數
    const handleSplineLoaded = () => {
        // 顯示 SKIP 按鈕，讓使用者可以手動跳過
        setShowSkipButton(true);

        // 設置 12 秒自動關閉計時器
        timerRef.current = setTimeout(() => {
            // 開始淡出動畫（opacity 1 -> 0）
            setIsFading(true);

            // 1 秒後（淡出動畫完成後）完全隱藏組件
            fadeTimerRef.current = setTimeout(() => {
                setIsVisible(false); // 移除組件
                setOpeningComplete(true); // 更新全域狀態
                // 重置滾動位置，確保主頁面從頂部開始
                window.scrollTo(0, 0);
            }, 1000); // 配合 CSS transition duration-1000
        }, 12000); // 12 秒的展示時間
    };

    // 處理使用者點擊 SKIP 按鈕
    const handleSkip = () => {
        // 清理所有進行中的計時器
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current);
        }

        // 立即開始淡出動畫
        setIsFading(true);

        // 300ms 後（快速淡出）完全隱藏
        setTimeout(() => {
            setIsVisible(false);
            setOpeningComplete(true);
            window.scrollTo(0, 0);
        }, 300); // 比自動關閉的淡出時間短，提供更快的響應
    };

    // 組件已隱藏，不渲染任何內容
    if (!isVisible) return null;

    // SSR 保護：在客戶端掛載前顯示黑色佔位符
    // 避免服務端渲染和客戶端渲染不一致的問題
    if (!isMounted) {
        return (
            <div className="w-full h-screen bg-black z-[99999] relative">
            </div>
        );
    }

    // 主要渲染內容
    return (
        <div
            className={`w-full h-screen fixed z-[99999] overflow-hidden m-0 bg-black transition-opacity ${isFading ? 'opacity-0 duration-1000' : 'opacity-100'
                }`}
        >
            {/* Spline 容器 */}
            <div className="w-full h-full overflow-hidden m-0">
                <SplineLoader onLoaded={handleSplineLoaded} />
            </div>

            {/* SKIP 按鈕 - 只在 Spline 載入後顯示 */}
            {showSkipButton && (
                <button
                    onClick={handleSkip}
                    className="absolute leading-none bottom-4 right-4 z-[99999] bg-[rgba(0,0,0,0.5)] backdrop-blur-lg text-gray-200 px-2 py-2 text-sm hover:bg-gray-800 hover:text-white transition-colors"
                >
                    SKIP
                </button>
            )}
        </div>
    );
}
