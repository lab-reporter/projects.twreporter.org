'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores';

// 調試面板組件 - 開發環境專用
export default function DebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [swiperAnimating, setSwiperAnimating] = useState(false);
    const { currentSection } = useStore();

    // 監聽滾動和動畫狀態
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const updateStatus = () => {
            setScrollY(window.scrollY);
            setSwiperAnimating(document.body.hasAttribute('data-swiper-animating'));
        };

        const handleScroll = () => updateStatus();
        const handleMutation = () => updateStatus();

        // 初始更新
        updateStatus();

        // 監聽滾動
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 監聽 DOM 變化（檢測 data-swiper-animating 屬性）
        const observer = new MutationObserver(handleMutation);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-swiper-animating']
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    // 快捷鍵切換顯示
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const handleKeydown = (e: KeyboardEvent) => {
            // Ctrl + D 切換調試面板
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, []);

    // 生產環境不顯示
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <>
            {/* 切換按鈕 */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed top-4 right-4 z-[99999] bg-red-600 text-white px-3 py-1 rounded text-sm font-mono shadow-lg hover:bg-red-700"
                title="切換調試面板 (Ctrl+D)"
            >
                DEBUG
            </button>

            {/* 調試面板 */}
            {isVisible && (
                <div className="fixed top-16 right-4 z-[99998] bg-black/90 text-white p-4 rounded-lg shadow-xl backdrop-blur-sm font-mono text-sm max-w-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-green-400">調試信息</h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* 基本狀態 */}
                        <div>
                            <span className="text-blue-400">當前章節:</span>
                            <span className="ml-2">{currentSection || 'unknown'}</span>
                        </div>

                        <div>
                            <span className="text-blue-400">滾動位置:</span>
                            <span className="ml-2">{scrollY}px</span>
                        </div>

                        <div>
                            <span className="text-blue-400">Swiper 動畫:</span>
                            <span className={`ml-2 ${swiperAnimating ? 'text-yellow-400' : 'text-green-400'}`}>
                                {swiperAnimating ? '進行中' : '停止'}
                            </span>
                        </div>

                        {/* 視窗信息 */}
                        <div className="border-t border-gray-600 pt-2 mt-2">
                            <div>
                                <span className="text-blue-400">視窗高度:</span>
                                <span className="ml-2">{typeof window !== 'undefined' ? window.innerHeight : 0}px</span>
                            </div>
                        </div>

                        {/* 調試工具按鈕 */}
                        <div className="border-t border-gray-600 pt-2 mt-2 space-y-1">
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && (window as any).debugTracker) {
                                        (window as any).debugTracker.report();
                                    }
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                            >
                                查看調試報告
                            </button>

                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && (window as any).debugTracker) {
                                        const jumps = (window as any).debugTracker.findJumps();
                                        console.log('🔍 滾動跳躍分析:', jumps);
                                    }
                                }}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
                            >
                                分析滾動跳躍
                            </button>

                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && (window as any).debugTracker) {
                                        (window as any).debugTracker.clear();
                                    }
                                }}
                                className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                            >
                                清空調試記錄
                            </button>

                            <button
                                onClick={() => {
                                    console.log('📍 當前狀態快照:', {
                                        scrollY: window.scrollY,
                                        currentSection,
                                        swiperAnimating,
                                        timestamp: new Date().toLocaleTimeString()
                                    });
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                            >
                                記錄當前狀態
                            </button>
                        </div>

                        {/* 提示信息 */}
                        <div className="border-t border-gray-600 pt-2 mt-2 text-xs text-gray-400">
                            <p>• 使用 Ctrl+D 快速切換面板</p>
                            <p>• 查看 console 以獲得詳細信息</p>
                            <p>• 問題發生時點擊「分析滾動跳躍」</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
