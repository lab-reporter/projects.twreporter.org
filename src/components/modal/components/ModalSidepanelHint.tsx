'use client';

import React from 'react';
import Image from 'next/image';

interface ModalSidepanelHintProps {
    show: boolean;
    opacity: number;
    onClose: () => void;
}

export default function ModalSidepanelHint({
    show,
    opacity,
    onClose
}: ModalSidepanelHintProps) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 w-full h-full z-[10001] transition-opacity duration-500 overflow-hidden pointer-events-none"
            style={{
                opacity: opacity,
                height: '100%',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            {/* 提示內容區域 - 右上角 */}
            <div className="absolute top-4 right-20 pointer-events-auto">
                <div className="relative bg-gray-100 rounded-lg shadow-2xl p-6 max-w-sm">
                    {/* 關閉按鈕 */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 left-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="關閉提示"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="stroke-gray-800"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {/* 提示內容 */}
                    <div className="space-y-4">
                        <h5 className="text-base font-medium text-gray-900">
                            探索更多內容
                        </h5>

                        <div className="space-y-3">
                            {/* 關閉按鈕說明 */}
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-white flex items-center justify-center">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="stroke-black"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        點擊關閉按鈕離開此頁面
                                    </p>
                                </div>
                            </div>

                            {/* Sidepanel 按鈕說明 */}
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                    <Image
                                        src="/assets/modal-sidepanel-arrow.svg"
                                        alt="sidepanel arrow"
                                        width={20}
                                        height={20}
                                        className="rotate-180"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        點擊箭頭展開導覽列
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 提示文字 */}
                        <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                            此提示只會顯示一次
                        </p>
                    </div>

                    {/* 指向箭頭 - 指向右上角按鈕區域 */}
                    <div className="absolute -right-2 top-4 w-4 h-4 bg-gray-100 transform rotate-45"></div>
                </div>
            </div>
        </div>
    );
}