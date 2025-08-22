'use client';

import { useState } from 'react';
import DonatePanel from '@/components/sections/support/DonatePanel';

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
            <div className="pl-1 bg-gradient-to-b from-[#5656F3] via-[#9651CA] to-[#F32137]">
                <div className="relative bg-white flex flex-col items-start justify-center shadow-lg p-8 bg-white max-w-[40rem] mx-auto">
                    <h5 className="relative text-left font-noto-sans-tc font-bold">
                        <span
                            className="z-0 bg-gradient-to-l from-[#5656F3] via-[#9651CA] to-[#F32137] opacity-25 block w-full h-[50%] absolute top-1/3 left-[0.5rem]"
                        ></span>
                        <span className="relative font-bold">支持獨立媒體邁向下一個十年</span>
                    </h5>
                    <p className="text-gray-800 leading-[1.8] mb-2 mt-4">謝謝每一位讀者的支持，讓《報導者》能走到今天。過去十年，公共討論的環境巨變，我們也更加意識到，唯有獨立運作的媒體，才能讓自由的討論和真相浮現。</p>
                    <p className="text-gray-800 leading-[1.8] mb-2">為了讓獨立媒體永續經營、持續挖掘真相，我們需要提升小額捐款比例至8成，因此在《報導者》滿10歲之際，我們許下一個生日願望：累積至少10,000位定期定額捐款支持的夥伴。</p>
                    <p className="text-gray-800 leading-[1.8] mb-2">請與我們同行，一起面對下一個十年的挑戰。</p>
                    <div className="flex justify-end w-full">
                        <button
                            onClick={handleOpenModal}
                            className="mt-2 bg-gray-800 backdrop-blur-sm leading-none text-white px-6 py-3 hover:bg-red-90 transition-colors duration-100"
                        >
                            贊助支持
                        </button>
                    </div>
                </div>
            </div>

            {/* 捐款 Modal 彈跳視窗 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* 背景遮罩 */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />

                    {/* Modal 內容容器 */}
                    <div className="relative w-full h-full overflow-y-auto">
                        {/* 關閉按鈕 */}
                        {/* <div className="absolute top-8 right-8 z-10">
                            <Button
                                variant="close"
                                size="sm"
                                onClick={handleCloseModal}
                                aria-label="關閉捐款視窗"
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
