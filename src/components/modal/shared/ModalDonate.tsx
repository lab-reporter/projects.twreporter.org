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
            <div className="border-l-[2px] border-red-90 flex flex-col items-start justify-center mt-2 mb-8 shadow-lg p-8 bg-white max-w-[40rem] mx-auto">
                <h5 className="text-xl text-left mb-2 font-noto-sans-tc font-bold">用行動支持報導者</h5>
                <p className="text-gray-800 leading-[1.8] mb-2">獨立的精神，是自由思想的條件。獨立的媒體，才能守護公共領域，讓自由的討論和真相浮現。</p>
                <p className="text-gray-800 leading-[1.8] mb-2">在艱困的媒體環境，《報導者》堅持以非營利組織的模式投入公共領域的調查與深度報導。我們透過讀者的贊助支持來營運，不仰賴商業廣告置入，在獨立自主的前提下，穿梭在各項重要公共議題中。</p>
                <p className="text-gray-800 leading-[1.8] mb-2">你的支持能幫助《報導者》持續追蹤國內外新聞事件的真相，邀請你加入 3 種支持方案，和我們一起推動這場媒體小革命。</p>
                <div className="flex justify-end w-full">
                    <button
                        onClick={handleOpenModal}
                        className="mt-2 bg-gray-800 backdrop-blur-sm leading-none text-white px-6 py-3 hover:bg-red-90 transition-colors duration-100"
                    >
                        立即支持
                    </button>
                </div>
            </div>

            {/* 捐款 Modal 彈跳視窗 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[20000] flex items-center justify-center">
                    {/* 背景遮罩 */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />

                    {/* Modal 內容容器 */}
                    <div className="relative w-full h-full overflow-y-auto">
                        {/* 關閉按鈕 */}
                        {/* <div className="absolute top-4 right-4 z-10">
                            <CloseButton
                                onClick={handleCloseModal}
                                variant="modal"
                                size="md"
                                ariaLabel="關閉捐款視窗"
                            />
                        </div> */}

                        {/* 捐款面板內容 */}
                        <DonatePanel />
                    </div>
                </div>
            )}
        </>
    );
}
