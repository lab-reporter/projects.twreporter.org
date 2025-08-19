'use client';

import { useState } from 'react';
import DonatePanel from '@/components/sections/support/DonatePanel';
import CloseButton from '@/components/shared/CloseButton';

interface ModalDonateProps {
    /**
     * 當關閉按鈕被點擊時的回調函數
     * 這個函數應該同時關閉 ModalDonate 和父級 Modal
     */
    onClose: () => void;
}

/**
 * Modal 內的捐款組件
 * 包含觸發按鈕和彈跳式捐款面板
 */
export default function ModalDonate({ onClose }: ModalDonateProps) {
    // 控制捐款 Modal 的顯示狀態
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 開啟捐款 Modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // 關閉捐款 Modal 並觸發父級關閉
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // 同時關閉父級 Modal (Reports1Content 的 Modal)
        onClose();
    };

    return (
        <>
            {/* 觸發按鈕 */}
            <div className="flex justify-center mt-8 mb-4">
                <button
                    onClick={handleOpenModal}
                    className="bg-red-70 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-80 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                >
                    支持報導者邁向下一個10年
                </button>
            </div>

            {/* 捐款 Modal 彈跳視窗 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[20000] flex items-center justify-center">
                    {/* 背景遮罩 */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />

                    {/* Modal 內容容器 */}
                    <div className="relative w-full h-full overflow-y-auto">
                        {/* 關閉按鈕 */}
                        <div className="absolute top-4 right-4 z-10">
                            <CloseButton
                                onClick={handleCloseModal}
                                variant="modal"
                                size="md"
                                ariaLabel="關閉捐款視窗"
                            />
                        </div>

                        {/* 捐款面板內容 */}
                        <DonatePanel />
                    </div>
                </div>
            )}
        </>
    );
}
