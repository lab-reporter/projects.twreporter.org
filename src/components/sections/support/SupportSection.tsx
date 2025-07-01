'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function SupportSection() {
  useScrollTrigger({
    sectionId: 'section-support',
    sectionName: 'support'
  });

  // 共用變數：總支持人數（最終目標數字）
  const [finalSupporterCount] = useState(7964);
  // 動畫顯示的支持人數
  const [displaySupporterCount, setDisplaySupporterCount] = useState(0);
  // 動畫顯示的下一位支持者序號
  const [displayNextSupporterNumber, setDisplayNextSupporterNumber] = useState(1);
  // 動畫是否已經開始
  const [animationStarted, setAnimationStarted] = useState(false);
  // ref 用於 Intersection Observer
  const supporterRef = useRef(null);

  // 最終的下一位支持者序號（用於計算進度條等）
  const finalNextSupporterNumber = finalSupporterCount + 1;
  // 目標支持人數
  const targetSupporters = 10000;
  // 進度百分比（使用最終數字計算）
  const progressPercentage = (finalSupporterCount / targetSupporters) * 100;

  // 金額選項
  const amountOptions = [500, 1000, 3000];
  
  // 彩帶效果配置
  const CONFETTI_COLORS = {
    500: ['#FFC107', '#FF5722', '#03A9F4'],  // 黃橙藍
    1000: ['#4CAF50', '#9C27B0', '#E91E63'], // 綠紫紅
    3000: ['#c9a156', '#FF4081', '#3F51B5']  // 金紅藍
  } as const;
  
  const DEFAULT_CONFETTI_COLORS = ['#c9a156', '#FFFFFF', '#888888'];
  // 使用者選擇的金額
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  // 自訂金額
  const [customAmount, setCustomAmount] = useState('');
  // 錯誤訊息
  const [errorMessage, setErrorMessage] = useState('');

  // 數字動畫效果
  useEffect(() => {
    if (typeof window === 'undefined' || !supporterRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true);

            // 使用 GSAP 動畫
            const timeline = gsap.timeline();
            
            timeline.to({ count: 0 }, {
              count: finalSupporterCount,
              duration: 3,
              ease: "power2.out",
              onUpdate: function() {
                const currentCount = Math.floor(this.targets()[0].count);
                setDisplaySupporterCount(currentCount);
                setDisplayNextSupporterNumber(currentCount + 1);
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (supporterRef.current) {
      observer.observe(supporterRef.current);
    }

    return () => {
      if (supporterRef.current) {
        observer.unobserve(supporterRef.current);
      }
    };
  }, [finalSupporterCount, animationStarted]);

  // 觸發彩帶效果的函數
  const fireConfetti = useCallback((amount: number) => {
    // 獲取當前選擇金額的顏色，或預設顏色
    const colors = CONFETTI_COLORS[amount as keyof typeof CONFETTI_COLORS] || DEFAULT_CONFETTI_COLORS;

    // 基本彩帶效果
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });

    // 更華麗的效果：左右兩側噴發
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.6 },
        colors: colors
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.6 },
        colors: colors
      });
    }, 250);
  }, []);

  // 處理金額選擇
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrorMessage('');

    // 觸發彩帶效果
    fireConfetti(amount);
  };

  // 處理自訂金額輸入
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 確保只能輸入數字
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);

      // 如果輸入了數字且金額小於 100，顯示錯誤訊息
      if (value !== '' && Number(value) < 100) {
        setErrorMessage('請輸入至少 100 元');
      } else {
        setErrorMessage('');
      }
    }
  };

  // 處理立即支持按鈕點擊
  const handleSupport = () => {
    const finalAmount = selectedAmount || Number(customAmount);

    // 檢查金額是否有效
    if (!finalAmount) {
      setErrorMessage('請選擇或輸入金額');
      return;
    }

    // 檢查自訂金額是否達到最低要求
    if (!selectedAmount && finalAmount < 100) {
      setErrorMessage('請輸入至少 100 元');
      return;
    }

    // 構建支持頁面的 URL
    const supportUrl = `https://support.twreporter.org/authenticate?frequency=monthly&amount=${finalAmount}`;

    // 另開視窗導向支持頁面
    window.open(supportUrl, '_blank', 'noopener,noreferrer');
  };

  // 確認是否可以點擊立即支持按鈕
  const canSupport = selectedAmount || (customAmount && Number(customAmount) >= 100);

  return (
    <section
      id="section-support"
      className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center px-8 py-20"
    >
      <div className="text-center mb-8 leading-normal max-w-4xl">
        <h3 className="text-white text-xl mb-2">為了投入足夠資源產製深度報導、開發多元產品</h3>
        <h2 className="text-white text-2xl mb-4">讓報導者永續發展、小額捐款占9成</h2>
        <h1 className="text-white text-4xl my-4 leading-tight font-bold">
          我們需要 <br />
          10,000名 <br />
          定期定額捐款支持的夥伴
        </h1>
        <h4 className="text-white text-lg">幫助我們度過下一個十年的種種挑戰</h4>
      </div>

      {/* 進度條區域 */}
      <div className="w-4/5 max-w-[1000px] h-6 bg-gray-800 rounded-xl overflow-hidden relative shadow-[0_0_20px_5px_rgba(201,161,86,0.3)] mb-4">
        <div
          className="h-full bg-[#c9a156] rounded-xl absolute top-0 left-0 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* 目前支持人數 */}
      <div ref={supporterRef} className="text-center mb-8">
        <p className="text-white text-base mb-6 opacity-80">
          現在已有{displaySupporterCount.toLocaleString()}位定期定額支持者
        </p>

        {/* 主標題 */}
        <h1 className="text-white text-5xl font-bold mb-4">
          成為第{displayNextSupporterNumber.toLocaleString()}位定期定額支持者
        </h1>
      </div>

      {/* 副標題 */}
      <p className="text-white text-2xl mb-12 max-w-[700px] text-gray-300 text-center">
        和我們一起開創深度報導的媒體道路
      </p>

      {/* 金額選擇區域 */}
      <div className="flex flex-col items-center w-full max-w-[700px]">
        <div className="text-lg mb-6 bg-gray-200 text-black py-3 px-8 rounded-full">
          每月定額
        </div>

        <div className="flex justify-center gap-4 mb-6 w-full">
          {amountOptions.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelection(amount)}
              className={`flex-1 max-w-[150px] py-3 px-6 text-lg cursor-pointer transition-all duration-300 relative z-10 ${selectedAmount === amount
                ? "bg-gray-300 text-black"
                : "bg-transparent border border-gray-700 text-white hover:border-gray-300"
                }`}
            >
              {amount}
            </button>
          ))}
        </div>

        <div className="flex items-center w-full max-w-[400px] mb-6 relative border-b border-gray-700">
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="自訂金額"
            className="w-full bg-transparent border-none py-3 px-4 text-lg text-white text-center focus:outline-none placeholder-gray-500"
          />
          <span className="absolute right-4 text-gray-500">元/月</span>
        </div>

        {/* 錯誤訊息 */}
        {errorMessage && (
          <p className="text-red-400 mb-4 text-center">{errorMessage}</p>
        )}

        {/* 立即支持按鈕 */}
        <button
          type="button"
          onClick={handleSupport}
          disabled={!canSupport}
          className={`rounded-full py-3 px-10 text-lg transition-all duration-300 mt-4 relative z-10 ${canSupport
            ? "bg-gray-300 text-black cursor-pointer hover:bg-gray-100"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          立即支持
        </button>
      </div>
    </section>
  );
}