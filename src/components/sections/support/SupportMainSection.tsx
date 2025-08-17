'use client';

/*
 * ========================================
 * SupportMainSection - 支持頁面主要組件
 * ========================================
 * 
 * 🎯 功能概述：
 * 此組件是支持頁面的核心互動區域，結合了多種動畫效果和使用者互動功能：
 * 
 * 🎬 動畫機制分析：
 * 
 * 1️⃣ 入場動畫 (useGSAP)：
 *    - 組件初始狀態：opacity: 0, scale: 0.5（半透明 + 縮小）
 *    - 滾動觸發：當元素頂部到達視窗底部時開始
 *    - 動畫效果：opacity → 1, scale → 1（完全顯示 + 正常大小）
 *    - scrub: true 讓動畫跟隨滾動進度，提供流暢的視覺體驗
 * 
 * 2️⃣ 數字計數動畫 (IntersectionObserver + GSAP)：
 *    - 觸發條件：當數字區域進入視窗 30% 時啟動
 *    - 動畫效果：從 0 快速數到 7964（當前支持者數量）
 *    - 緩動函數：power2.out 讓數字加速後減速，更自然
 *    - 持續時間：3 秒，讓使用者有足夠時間感受數字增長
 * 
 * 3️⃣ 慶祝彩帶動畫 (canvas-confetti)：
 *    - 觸發條件：使用者點擊金額按鈕時
 *    - 多階段效果：
 *      第一階段：中央噴發 100 個粒子
 *      第二階段：左右兩側各噴發 50 個粒子（延遲 250ms）
 *    - 顏色系統：不同金額對應不同顏色主題
 *    - 無障礙支援：尊重使用者的減少動畫偏好設定
 * 
 * 🎨 視覺設計重點：
 * - 進度條金光效果：box-shadow 營造金色光暈
 * - 響應式佈局：自適應不同螢幕尺寸
 * - 狀態視覺回饋：按鈕顏色變化、禁用狀態等
 * 
 * 🚀 效能優化：
 * - useCallback 記憶化 confetti 函數
 * - IntersectionObserver 確保動畫只在需要時執行
 * - 條件渲染減少不必要的 DOM 更新
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from "@gsap/react";
export default function SupportMainSection() {

  // 狀態變數：目前的支持者總數（固定數值，不會改變）
  const [finalSupporterCount] = useState(7964);
  // 狀態變數：動畫過程中顯示的支持人數（從0開始遞增）
  const [displaySupporterCount, setDisplaySupporterCount] = useState(0);
  // 狀態變數：動畫過程中顯示的下一位支持者序號
  const [displayNextSupporterNumber, setDisplayNextSupporterNumber] = useState(1);
  // 狀態變數：記錄數字動畫是否已經執行過
  const [animationStarted, setAnimationStarted] = useState(false);
  // DOM 元素參考：用於偵測元素是否進入視窗範圍
  const supporterRef = useRef(null);

  // 計算值：下一位支持者的序號（當前支持者數量加一）
  // const finalNextSupporterNumber = finalSupporterCount + 1;
  // 常數：目標支持者人數上限
  const targetSupporters = 10000;
  // 計算值：目前進度的百分比（用於進度條顯示）
  const progressPercentage = (finalSupporterCount / targetSupporters) * 100;

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
                // 更新顯示的支持者人數
                setDisplaySupporterCount(currentCount);
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

  /**
   * ========================================
   * fireConfetti - 慶祝彩帶動畫系統
   * ========================================
   * 
   * 🎉 動畫設計概念：
   * 創造一個「從天而降的慶祝」效果，模擬真實的彩帶慶祝場景
   * 
   * 🎨 顏色心理學應用：
   * - 500 元：溫暖色調（橙黃藍）- 溫馨感謝
   * - 1000 元：活力色調（綠紫粉）- 熱情支持  
   * - 3000 元：經典色調（金粉藍）- 尊貴致敬
   * - 其他：中性色調（金白灰）- 純粹感謝
   * 
   * 🎭 三階段動畫時序：
   * 
   * 第一階段（立即）：中央爆發
   * - 100 個粒子從螢幕中央向外散開
   * - 70° 散佈角度創造自然的爆發效果
   * - y: 0.6 的發射位置讓彩帶從螢幕中上方落下
   * 
   * 第二階段（250ms 後）：左右側噴發
   * - 左側：60° 角度向右上噴發（x: 0.2）
   * - 右側：120° 角度向左上噴發（x: 0.8）  
   * - 50 個粒子的較小規模，補強主效果
   * - 創造「多點同時慶祝」的豐富視覺層次
   * 
   * 🚀 技術細節：
   * - useCallback 記憶化避免重複創建函數
   * - 顏色陣列使用展開運算子確保每次都是新陣列
   * - disableForReducedMotion 尊重無障礙偏好
   * - setTimeout 精確控制動畫時序
   */
  const fireConfetti = useCallback((amount: number) => {
    // 🎨 金額對應顏色主題配置
    const CONFETTI_COLORS = {
      500: ['#FFC107', '#FF5722', '#03A9F4'],   // 溫暖橙黃藍
      1000: ['#4CAF50', '#9C27B0', '#E91E63'],  // 活力綠紫粉
      3000: ['#c9a156', '#FF4081', '#3F51B5']   // 經典金粉藍
    } as const;

    // 🎨 預設顏色：優雅的金白灰組合
    const DEFAULT_CONFETTI_COLORS = ['#c9a156', '#FFFFFF', '#888888'];

    // 🎯 智慧顏色選擇：根據金額取得對應主題，無對應時使用預設
    const colors = CONFETTI_COLORS[amount as keyof typeof CONFETTI_COLORS] || DEFAULT_CONFETTI_COLORS;

    // 🎆 第一階段：中央主要爆發效果
    confetti({
      particleCount: 100,        // 主要爆發粒子數
      spread: 70,                // 70° 散佈角度
      origin: { y: 0.6 },       // 從螢幕 60% 高度發射
      colors: [...colors],       // 使用主題顏色（新陣列確保獨立性）
      disableForReducedMotion: true  // 無障礙：尊重減少動畫偏好
    });

    // ⏰ 第二階段：延遲 250ms 執行左右兩側補強效果
    setTimeout(() => {
      // 🎆 左側噴發：向右上方
      confetti({
        particleCount: 50,              // 補強效果粒子數
        angle: 60,                      // 60° 向右上噴發
        spread: 55,                     // 55° 散佈範圍
        origin: { x: 0.2, y: 0.6 },   // 左側 20% 位置發射
        colors: [...colors]             // 相同主題顏色
      });

      // 🎆 右側噴發：向左上方
      confetti({
        particleCount: 50,              // 補強效果粒子數  
        angle: 120,                     // 120° 向左上噴發
        spread: 55,                     // 55° 散佈範圍
        origin: { x: 0.8, y: 0.6 },   // 右側 80% 位置發射
        colors: [...colors]             // 相同主題顏色
      });
    }, 250);  // 🕐 250ms 延遲讓主爆發先完成
  }, []);  // 空依賴：函數邏輯完全自包含

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

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.to(section, {
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  })

  // 組件渲染輸出
  return (
    // 主要頁面區塊：支持頁面
    <div
      // 頁面錨點 ID
      className="w-full min-h-screen text-white flex flex-col justify-center items-center px-8 py-20 -mt-[20vh] relative z-[1] opacity-0 origin-top scale-50"
      ref={sectionRef}
    >
      {/* 標題區塊：說明支持的重要性 */}
      <div className="text-center mb-8 leading-normal max-w-4xl">
        <h1 className="text-white text-6xl my-4 leading-tight font-bold">
          深度求真
          <br />
          眾聲同行
        </h1>
        <h3 className="text-white text-xl mb-2">
          獨立報導是民主社會的基石 <br />
          為了讓《報導者》持續獨立運作、挖掘真相
        </h3>
        <h2 className="text-white text-2xl mb-4">
          在經費上我們需要提升小額捐款的比例
        </h2>
        <h1 className="text-white text-4xl my-4 leading-tight font-bold">
          號召至少10,000名 <br />
          定期定額捐款支持的夥伴
        </h1>
        <h4 className="text-white text-xl">幫助我們度過下一個十年的種種挑戰</h4>
      </div>
      <div className="text-center mb-8 leading-normal max-w-4xl">
        <h1 className="text-white text-4xl my-4 leading-tight font-bold">
          十週年限定贊助回饋
        </h1>
        <h3 className="text-white text-xl mb-2">
          凡在2025年11月30日（日）前加入定期定額贊助行列 <br />
          即可在《報導者》十週年活動領取十週年限定紀念品
        </h3>
        <button className="bg-gray-300 text-black py-2 px-4 text-md transition-all duration-300 mt-4 relative z-10">
          了解詳情
        </button>
      </div>

      {/* 進度條區域：視覺化顯示目前支持進度 */}
      <div className="w-4/5 max-w-[1000px] h-6 bg-gray-800 rounded-xl overflow-hidden relative shadow-[0_0_20px_5px_rgba(201,161,86,0.3)] mb-4">
        {/* 進度條內部填充：根據達成百分比動態調整寬度 */}
        <div
          className="h-full bg-[#c9a156] rounded-xl absolute top-0 left-0 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* 數字顯示區域：支持者人數統計（動畫觸發點） */}
      {/* 綁定 ref 用於動畫觸發偵測 */}
      <div ref={supporterRef} className="text-center mb-8">
        <p className="text-white text-base mb-6 opacity-80">
          現在已有{displaySupporterCount.toLocaleString()}位定期定額支持者
        </p>

        {/* 主要呼籲標題 */}
        <h1 className="text-white text-5xl font-bold mb-4">
          成為第{displayNextSupporterNumber.toLocaleString()}位定期定額支持者
        </h1>
      </div>

      {/* 副標題：情感呼籲 */}
      <p className="text-white text-2xl mb-12 max-w-[700px] text-gray-300 text-center">
        和我們一起開創深度報導的媒體道路
      </p>

      {/* 表單區域：金額選擇與輸入 */}
      <div className="flex flex-col items-center w-full max-w-[700px]">
        {/* 表單標籤：說明捐款類型 */}
        <div className="text-lg mb-6 bg-gray-200 text-black py-3 px-8 rounded-full">
          每月定額
        </div>

        {/* 預設金額按鈕群組 */}
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

        {/* 自訂金額輸入區域 */}
        <div className="flex items-center w-full max-w-[400px] mb-6 relative border-b border-gray-700">
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="自訂金額"
            className="w-full bg-transparent border-none py-3 px-4 text-lg text-white text-center focus:outline-none placeholder-gray-500"
          />
          {/* 金額單位標示 */}
          <span className="absolute right-4 text-gray-500">元/月</span>
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
          className={`rounded-full py-3 px-10 text-lg transition-all duration-300 mt-4 relative z-10 ${canSupport
              ? "bg-gray-300 text-black cursor-pointer hover:bg-gray-100"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          立即支持
        </button>
      </div>
    </div>
  );
}