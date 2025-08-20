'use client';

/*
 * ========================================
 * ClaimMethodModal - 領取辦法 Modal 組件
 * ========================================
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseButton from '@/components/shared/CloseButton';

interface ClaimMethodModalProps {
    onClose: () => void;
}

export default function ClaimMethodModal({ onClose }: ClaimMethodModalProps) {
    // 處理背景點擊關閉
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 處理 ESC 鍵關閉
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [onClose]);

    // 防止背景滾動
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // 檢查是否在瀏覽器環境
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[25000] p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-y-auto relative">
                {/* 關閉按鈕 */}
                <div className="absolute top-4 right-4">
                    <CloseButton
                        onClick={onClose}
                        variant="default"
                        size="sm"
                        ariaLabel="關閉領取辦法視窗"
                        className=""
                    />
                </div>

                {/* Modal 內容 */}
                <div className="p-12">
                    <h4 className="font-bold text-gray-800 mb-6 text-left">
                        十週年回饋品登記領取辦法
                    </h4>

                    <div className="text-gray-700 leading-relaxed flex flex-col justify-left">
                        <h6 className="text-left mb-1 font-semibold">登記資格</h6>
                        <p className="mb-6 text-justify text-sm md:text-base">凡在2025年11月30日前加入《報導者》定期定額贊助行列，即可登記領取十週年限定回饋品。</p>

                        <h6 className="text-left mb-1 font-semibold">登記方式</h6>
                        <p className="mb-6 text-justify text-sm md:text-base">成為定期定額贊助者後，請至《報導者》官網「個人專區」的「專屬回饋」分頁填寫登記表單，即可選擇以下領取方式：</p>

                        <h6 className="text-left mb-1 font-semibold">親自領取</h6>
                        <p className="mb-6 text-justify text-sm md:text-base">請於2025年12月4日至12月7日期間，前往《報導者》十週年特展（地點：台北華山1914文化創意產業園區 中4A館）現場領取。</p>

                        <h6 className="text-left mb-1 font-semibold">宅配領取</h6>
                        <p className="mb-6 text-justify text-sm md:text-base">《報導者》將在2025年12月8日至12月12日將回饋品陸續寄送至您所填寫的收件地址，配送期間請留意包裹配送情況。</p>

                        <h6 className="text-left mb-1 font-semibold">領取資格</h6>
                        <p className="mb-6 text-justify text-sm md:text-base">無論從何時開始贊助，凡在十週年特展期間仍持續定期定額贊助《報導者》，即可獲得十週年限定回饋品。</p>

                        <p className="text-sm text-gray-600">
                            如您對十週年限定回饋品有任何問題，歡迎來信&nbsp;
                            <a href="mailto:events@twreporter.org" className="text-gold-70 hover:underline">
                                events@twreporter.org
                            </a>
                            &nbsp;與《報導者》聯絡。
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
