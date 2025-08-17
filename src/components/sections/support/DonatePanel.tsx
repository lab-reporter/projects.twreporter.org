'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import Image from 'next/image';

// 支持頁面主要組件
export default function DonatePanel() {
    // 使用滾動觸發器來監控當前頁面位置
    useScrollTrigger({
        sectionId: 'section-support',
        sectionName: 'support'
    });

    // 狀態變數：目前的支持者總數（固定數值，不會改變）
    const [finalSupporterCount] = useState(7964);
    // 狀態變數：動畫過程中顯示的下一位支持者序號
    const [displayNextSupporterNumber, setDisplayNextSupporterNumber] = useState(1);
    // 狀態變數：記錄數字動畫是否已經執行過
    const [animationStarted, setAnimationStarted] = useState(false);
    // DOM 元素參考：用於偵測元素是否進入視窗範圍
    const supporterRef = useRef(null);

    // 常數：預設的金額選項按鈕
    const amountOptions = [500, 1000, 3000];


    // 狀態變數：使用者選擇的預設金額（可為空值）
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    // 狀態變數：使用者輸入的自訂金額文字
    const [customAmount, setCustomAmount] = useState('');
    // 狀態變數：表單驗證錯誤訊息
    const [errorMessage, setErrorMessage] = useState('');

    // 副作用：設定數字計數動畫效果
    useEffect(() => {
        // 檢查是否在瀏覽器環境且 DOM 元素存在
        if (typeof window === 'undefined' || !supporterRef.current) return;

        // 建立觀察器：偵測元素是否進入視窗範圍
        const observer = new IntersectionObserver(
            (entries) => {
                // 遍歷所有被觀察的元素
                entries.forEach((entry) => {
                    // 當元素進入視窗且動畫尚未開始時
                    if (entry.isIntersecting && !animationStarted) {
                        // 標記動畫已開始（避免重複執行）
                        setAnimationStarted(true);

                        // 建立 GSAP 時間軸動畫
                        const timeline = gsap.timeline();

                        // 執行數字遞增動畫
                        timeline.to({ count: 0 }, {
                            // 動畫目標數值
                            count: finalSupporterCount,
                            // 動畫執行時間
                            duration: 3,
                            // 緩動函數類型
                            ease: "power2.out",
                            // 動畫更新時的回調函數
                            onUpdate: function () {
                                // 取得當前動畫數值（無條件捨去）
                                const currentCount = Math.floor(this.targets()[0].count);
                                // 更新顯示的下一位支持者序號
                                setDisplayNextSupporterNumber(currentCount + 1);
                            }
                        });
                    }
                });
            },
            {
                // 元素進入視窗的觸發比例
                threshold: 0.3,
                // 觸發範圍的邊界調整
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // 複製引用以避免 cleanup 時的警告
        const element = supporterRef.current;

        // 開始觀察指定的 DOM 元素
        if (element) {
            observer.observe(element);
        }

        // 清理函數：組件卸載時停止觀察
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
        // 依賴變數：當這些值改變時重新執行
    }, [finalSupporterCount, animationStarted]);

    // 記憶化函數：觸發慶祝彩帶動畫效果
    const fireConfetti = useCallback((amount: number) => {
        // 將常數移入 useCallback 內部以避免依賴警告
        const CONFETTI_COLORS = {
            500: ['#edc39d', '#9e7a4e', '#493018'],
            1000: ['#6ee5b5', '#3c927a', '#0e3532'],
            3000: ['#f80b28', '#c40d23', '#9b051e']
        } as const;

        const DEFAULT_CONFETTI_COLORS = ['#c9a156', '#FFFFFF', '#888888'];

        // 根據金額取得對應的顏色配置，無對應時使用預設顏色
        const colors = CONFETTI_COLORS[amount as keyof typeof CONFETTI_COLORS] || DEFAULT_CONFETTI_COLORS;

        // 第一階段：中央基本彩帶效果
        confetti({
            // 彩帶粒子數量
            particleCount: 100,
            // 散佈角度範圍
            spread: 70,
            // 發射起始位置（垂直方向）
            origin: { y: 0.6 },
            // 使用對應金額的顏色
            colors: [...colors],
            // 支援減少動畫的無障礙設定
            disableForReducedMotion: true
        });

        // 第二階段：延遲執行左右兩側噴發效果
        setTimeout(() => {
            // 左側彩帶噴發
            confetti({
                // 粒子數量
                particleCount: 50,
                // 噴發角度
                angle: 60,
                // 散佈範圍
                spread: 55,
                // 發射位置（左側）
                origin: { x: 0.2, y: 0.6 },
                // 使用相同顏色配置
                colors: [...colors]
            });

            // 右側彩帶噴發
            confetti({
                // 粒子數量
                particleCount: 50,
                // 噴發角度（向左）
                angle: 120,
                // 散佈範圍
                spread: 55,
                // 發射位置（右側）
                origin: { x: 0.8, y: 0.6 },
                // 使用相同顏色配置
                colors: [...colors]
            });
            // 延遲執行時間
        }, 250);
        // 空依賴陣列：函數內容不依賴外部變數
    }, []);

    // 事件處理函數：處理預設金額按鈕的點擊
    const handleAmountSelection = (amount: number) => {
        // 設定選中的金額
        setSelectedAmount(amount);
        // 清空自訂金額輸入框
        setCustomAmount('');
        // 清除錯誤訊息
        setErrorMessage('');

        // 播放慶祝彩帶動畫
        fireConfetti(amount);
    };

    // 事件處理函數：處理自訂金額輸入框的變更
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 取得輸入框的新值
        const value = e.target.value;
        // 驗證輸入：只允許空值或純數字
        if (value === '' || /^\d+$/.test(value)) {
            // 更新自訂金額狀態
            setCustomAmount(value);
            // 清除預設金額選擇
            setSelectedAmount(null);

            // 金額驗證：檢查是否達到最低金額要求
            if (value !== '' && Number(value) < 100) {
                // 顯示最低金額錯誤訊息
                setErrorMessage('請輸入至少 100 元');
            } else {
                // 清除錯誤訊息
                setErrorMessage('');
            }
        }
        // 註：不符合數字格式的輸入會被忽略
    };

    // 事件處理函數：處理立即支持按鈕的點擊
    const handleSupport = () => {
        // 決定最終金額：優先使用預設金額，否則使用自訂金額
        const finalAmount = selectedAmount || Number(customAmount);

        // 第一層驗證：檢查是否有選擇任何金額
        if (!finalAmount) {
            setErrorMessage('請選擇或輸入金額');
            // 中止執行
            return;
        }

        // 第二層驗證：檢查自訂金額是否符合最低要求
        if (!selectedAmount && finalAmount < 100) {
            setErrorMessage('請輸入至少 100 元');
            // 中止執行
            return;
        }

        // 建構外部支持網站的 URL（包含金額參數）
        const supportUrl = `https://support.twreporter.org/authenticate?frequency=monthly&amount=${finalAmount}`;

        // 在新分頁開啟支持頁面（安全設定：防止反向連結攻擊）
        window.open(supportUrl, '_blank', 'noopener,noreferrer');
    };

    // 計算值：判斷立即支持按鈕是否可點擊
    // 條件：有選擇預設金額 或 (有輸入自訂金額 且 金額達到最低要求)
    const canSupport = selectedAmount || (customAmount && Number(customAmount) >= 100);

    // 組件渲染輸出
    return (
        // 主要頁面區塊：支持頁面
        <div
            className="w-full min-h-screen text-white flex flex-col lg:flex-row justify-center items-center gap-16 px-8 py-20"
        >
            {/* 左側贊助支持區塊 */}
            <div>
                {/* 數字顯示區域：支持者人數統計（動畫觸發點） */}
                {/* 綁定 ref 用於動畫觸發偵測 */}
                <div ref={supporterRef} className="text-center">
                    {/* <p className="text-white text-base mb-6 opacity-80">
          現在已有{displaySupporterCount.toLocaleString()}位定期定額支持者
        </p> */}

                    {/* 主要呼籲標題 */}
                    <h3 className="text-white leading-normal">
                        成為 <br />
                        第<span className="text-8xl font-normal">{displayNextSupporterNumber.toLocaleString()}</span>位<br />
                        定期定額支持者
                    </h3>
                </div>

                {/* 副標題：情感呼籲 */}
                <h6 className="text-white mt-2 mb-4 max-w-[700px]">
                    和我們一起開創深度報導的媒體道路
                </h6>

                {/* 表單區域：金額選擇與輸入 */}
                <div className="flex flex-col items-center w-auto max-w-[700px]">
                    {/* 表單標籤：說明捐款類型 */}
                    <div className="font-noto-sans-tc text-md w-full text-center mb-3 bg-gray-200 text-black py-3 px-8">
                        每月定額
                    </div>

                    {/* 預設金額按鈕群組 */}
                    <div className="flex justify-center gap-2 mb-2 w-full">
                        {amountOptions.map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => handleAmountSelection(amount)}
                                className={`flex-1 max-w-[150px] py-3 px-8 text-lg cursor-pointer transition-all duration-300 relative z-10 ${selectedAmount === amount
                                    ? "bg-red-70 border-red-70"
                                    : "bg-transparent border border-2 border-gray-700 text-white hover:border-gray-300"
                                    }`}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>

                    {/* 自訂金額輸入區域 */}
                    <div className="font-noto-sans-tc  flex items-center w-full max-w-[400px] mb-6 relative border-b border-gray-700">
                        <input
                            type="text"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="自訂金額"
                            className="w-full text-xl bg-transparent border-none py-3 px-4 text-lg text-white text-center focus:outline-none placeholder-gray-500"
                        />
                        {/* 金額單位標示 */}
                        <span className="font-noto-sans-tc absolute right-4 text-gray-500">元/月</span>
                    </div>

                    {/* 錯誤訊息顯示區域（條件渲染） */}
                    {errorMessage && (
                        <p className="text-red-400 mb-4 text-center">{errorMessage}</p>
                    )}

                    {/* 主要行動按鈕：立即支持 */}
                    <button
                        type="button"
                        onClick={handleSupport}
                        disabled={!canSupport}
                        className={`py-2 px-4 text-md transition-all duration-300 mt-4 relative z-10 ${canSupport
                            ? "bg-gray-300 text-black cursor-pointer hover:bg-gray-100"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        立即支持
                    </button>
                </div>
            </div>
            {/* 右側十週年回饋說明*/}
            <div data-trigger="bigger-circle" className="relative flex flex-col items-center justify-center h-screen">
                <Image
                    src="/assets/gift.png"
                    width={1000}
                    height={1000}
                    alt="十週年限定贊助回饋"
                    className="w-full h-auto max-w-[25rem] mb-4" />
                <h6 className="mb-2 font-bold">
                    十週年限定贊助回饋
                </h6>
                <h5 className="mb-2">
                    報導者 × 春池玻璃
                </h5>
                <h4 className="mb-2">
                    聯名玻璃磚
                </h4>
                <p className="leading-relaxed max-w-[20rem] text-center">
                    凡在2025年11月30日前加入《報導者》定期定額贊助行列，即可登記領取十週年限定回饋品。
                </p>
                <button className="mt-4 bg-gray-100 px-4 rounded-full text-black cursor-pointer hover:bg-red-50 hover:text-white transition-all duration-300">
                    領取辦法
                </button>
            </div>

        </div>
    );
}
