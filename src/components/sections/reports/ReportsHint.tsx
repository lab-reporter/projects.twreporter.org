'use client';

import React from 'react';
import Image from 'next/image';

interface ReportsHintProps {
    show: boolean;
    opacity: number;
    onClose: () => void;
}

export default function ReportsHint({ 
    show, 
    opacity, 
    onClose 
}: ReportsHintProps) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 w-full h-screen z-[10] transition-opacity duration-500"
            style={{
                opacity: opacity
            }}
        >
            {/* 模糊背景效果 */}
            <div className="bg-black/80 absolute inset-0 backdrop-blur-sm" />

            {/* 關閉按鈕 */}
            <button
                onClick={onClose}
                className="absolute bottom-8 right-1/2 -translate-x-1/2 z-20 text-white p-3 hover:bg-white/20 rounded-full transition-all duration-200 border border-white/30 hover:border-white/50 group"
                aria-label="關閉提示"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* 教學內容 */}
            <div className="relative text-white px-32 z-10 w-full h-full flex items-center justify-center">
                <div className="w-full flex-1 flex items-center px-8 justify-center gap-2">
                    <Image 
                        src="/assets/swipe-left.svg"
                        alt="arrow-left"
                        width={48}
                        height={48} 
                    />
                    <h6>向左滑動切換</h6>
                </div>
                <div className="w-full flex-1 flex items-center px-8 justify-center gap-2">
                    <Image 
                        src="/assets/click.svg"
                        alt="click"
                        width={48}
                        height={48} 
                    />
                    <h6>點擊卡片檢視詳細內容</h6>
                </div>
                <div className="w-full flex-1 flex items-center px-8 justify-center gap-2">
                    <Image 
                        src="/assets/swipe-right.svg"
                        alt="arrow-right"
                        width={48}
                        height={48} 
                    />
                    <h6>向右滑動切換</h6>
                </div>
                
                {/* 側邊提示 */}
                <div className="border border-2 border-red-50 absolute top-1/2 -translate-y-1/2 right-0 w-16 h-[22rem]">
                    <h6
                        className="text-sm absolute top-1/2 -translate-y-1/2 left-[-2rem]"
                        style={{
                            writingMode: 'vertical-rl'
                        }}
                    >
                        點擊切換至不同Section
                    </h6>
                </div>
                
                {/* 底部提示 */}
                <div className="absolute bottom-0 right-0 flex items-center justify-center gap-2">
                    <h6 className="text-sm text-right">
                        跳至下一個Section
                    </h6>
                    <div className="w-16 h-16 border border-2 border-red-50"></div>
                </div>
            </div>
        </div>
    );
}