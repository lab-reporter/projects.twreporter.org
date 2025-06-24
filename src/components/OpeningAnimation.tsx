'use client';

import { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useStore } from '@/stores';

interface OpeningAnimationProps {
  onComplete: () => void;
}

// 定義 Lottie 動畫數據的類型
interface LottieAnimationData {
  w: number;
  h: number;
  fr: number;
  op: number;
  layers?: any[];
  assets?: any[];
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lottieRef = useRef<any>(null);
  const { setCurrentSection } = useStore();

  // 處理動畫完成的函數
  const handleAnimationComplete = () => {
    console.log('🎬 Lottie 動畫完成，準備切換場景');
    setIsVisible(false);
    setCurrentSection('reports');
    onComplete();
  };

  // 動態載入 Lottie JSON 文件
  useEffect(() => {
    console.log('🎬 開始載入修正後的 Lottie 動畫...');
    
    const loadAnimation = async () => {
      try {
        const response = await fetch('/assets/open.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ 修正後的 Lottie 動畫載入成功:', data);
        console.log('📊 動畫詳細資訊:', {
          width: data.w,
          height: data.h,
          frameRate: data.fr,
          duration: data.op,
          layers: data.layers?.length,
          assets: data.assets?.length
        });
        setAnimationData(data as LottieAnimationData);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Lottie 動畫載入失敗:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, []);

  // Skip 按鈕自動消失 (3秒後)
  useEffect(() => {
    if (!isLoading && !error && animationData) {
      const skipButtonTimer = setTimeout(() => {
        setShowSkipButton(false);
        console.log('⏰ Skip 按鈕自動隱藏');
      }, 3000);

      return () => clearTimeout(skipButtonTimer);
    }
  }, [isLoading, error, animationData]);

  const handleSkip = () => {
    console.log('⏭️ 用戶選擇跳過 Lottie 動畫');
    setIsVisible(false);
    setCurrentSection('reports');
    onComplete();
  };

  // 組件不可見時直接返回 null
  if (!isVisible) {
    console.log('👻 OpeningAnimation 組件已隱藏');
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* 載入狀態 */}
      {isLoading && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600">載入 Lottie 動畫中...</span>
        </div>
      )}
      
      {/* 錯誤狀態 */}
      {error && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="text-red-500 text-xl">❌</div>
          <div className="text-red-600">動畫載入失敗</div>
          <div className="text-sm text-gray-500">{error}</div>
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            直接進入網站
          </button>
        </div>
      )}
      
      {/* Lottie 動畫 */}
      {animationData && !isLoading && !error && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 動畫容器 */}
          <div 
            className="relative"
            style={{ 
              width: `${animationData.w}px`, 
              height: `${animationData.h}px`,
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
          >
            <Lottie
              ref={lottieRef}
              animationData={animationData}
              autoplay={true}
              loop={false}
              onComplete={handleAnimationComplete}
              onEnterFrame={(e) => {
                // 減少 console 輸出避免干擾
                if (e && 'currentTime' in e && typeof e.currentTime === 'number') {
                  if (Math.floor(e.currentTime) % 30 === 0) {
                    console.log(`🎬 Lottie 動畫播放中: ${Math.floor(e.currentTime)}/${animationData.op}`);
                  }
                }
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid meet',
                progressiveLoad: false
              }}
            />
          </div>
          
          {/* Skip 按鈕 */}
          {showSkipButton && (
            <button
              onClick={handleSkip}
              className={`
                absolute top-8 right-8 
                px-4 py-2 
                bg-black/60 backdrop-blur-sm 
                rounded-lg 
                text-white text-sm font-medium
                hover:bg-black/80 
                transition-all duration-300
                ${showSkipButton ? 'opacity-100' : 'opacity-0'}
              `}
            >
              跳過 Skip
            </button>
          )}
          
          {/* 開發調試資訊 - 只在開發環境顯示 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
              <div>尺寸: {animationData.w} x {animationData.h}</div>
              <div>總幀數: {animationData.op} ({Math.round(animationData.op / animationData.fr)}秒)</div>
              <div>播放狀態: {lottieRef.current ? '播放中' : '準備中'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}