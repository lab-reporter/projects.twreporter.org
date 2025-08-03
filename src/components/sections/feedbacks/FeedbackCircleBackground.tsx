'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 註冊 GSAP ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// ============================
// 型別定義
// ============================
export interface FeedbackCircleBackgroundHandle {
  updateCircleState: (showHidden: boolean, opacity: number, scale: number) => void;
}

interface FeedbackCircleBackgroundProps {
  className?: string;
}

// ============================
// 主要組件
// ============================
// 圓圈背景組件：使用 Canvas 繪製動態圓圈背景圖案
const FeedbackCircleBackground = forwardRef<FeedbackCircleBackgroundHandle, FeedbackCircleBackgroundProps>(
  ({ className = '' }, ref) => {
    // ============================
    // DOM 參考區塊
    // ============================
    // DOM 元素參考：背景圓圈容器
    const bgCircleRef = useRef<HTMLDivElement>(null);
    // DOM 元素參考：Canvas 繪圖區域
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // ============================
    // 動畫狀態區塊
    // ============================
    // 狀態參考：是否顯示灰色外框圓圈
    const showHiddenCircles = useRef(false);
    // 狀態參考：灰色圓圈的透明度值
    const grayCircleOpacity = useRef(0);
    // 狀態參考：圓圈的縮放倍數
    const circleScale = useRef(1);

    // ============================
    // 繪圖函數區塊
    // ============================
    // 函數：繪製圓圈圖案
    const drawCircles = useRef<() => void>(() => {});

    // ============================
    // 對外接口
    // ============================
    useImperativeHandle(ref, () => ({
      updateCircleState: (showHidden: boolean, opacity: number, scale: number) => {
        showHiddenCircles.current = showHidden;
        grayCircleOpacity.current = opacity;
        circleScale.current = scale;
        if (drawCircles.current) {
          drawCircles.current();
        }
      }
    }));

    // ============================
    // Effects 區塊 - Canvas 圓圈背景繪製
    // ============================
    // 使用 Canvas 繪製動態圓圈背景圖案
    useEffect(() => {
      if (!bgCircleRef.current) return;

      // 創建 Canvas 元素
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 函數：更新 Canvas 尺寸以適應視窗大小
      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawCircles.current();
      };

      // 設定繪圖函數
      drawCircles.current = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 圓圈參數設定（使用 vw 單位確保響應式）
        const vw = canvas.width / 100;
        const scale = circleScale.current;
        // 圓圈直徑
        const circleDiameter = 12.5 * vw * scale;
        // 圓圈半徑
        const circleRadius = circleDiameter / 2;
        // 圓心到圓心的水平間距
        const horizontalSpacing = 25 * vw * scale;
        // 列與列之間的垂直間距
        const verticalSpacing = 12.5 * vw * scale;

        // 計算視窗中心點
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // 計算需要的行列數（從中心向外延伸）
        const halfCols = Math.ceil(centerX / horizontalSpacing) + 1;
        const halfRows = Math.ceil(centerY / verticalSpacing) + 1;

        // 繪製紅色填充圓圈（錯位排列形成網格圖案）
        for (let row = -halfRows - 1; row <= halfRows + 1; row++) {
          for (let col = -halfCols - 1; col <= halfCols + 1; col++) {
            // 偶數列：圓圈向右偏移半個間距
            if (row % 2 === 0) {
              const x = centerX + col * horizontalSpacing + horizontalSpacing / 2;
              const y = centerY + row * verticalSpacing;

              ctx.beginPath();
              ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
              ctx.fillStyle = '#F80B28';
              ctx.fill();
            }
            // 奇數列：圓圈正常排列
            else {
              const x = centerX + col * horizontalSpacing;
              const y = centerY + row * verticalSpacing;

              ctx.beginPath();
              ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
              ctx.fillStyle = '#F80B28';
              ctx.fill();
            }
          }
        }

        // 繪製灰色外框圓圈（顯示潛在贊助者位置）
        if (showHiddenCircles.current) {
          // 在紅色圓圈之間的空隙繪製灰色外框
          for (let row = -halfRows; row <= halfRows; row++) {
            for (let col = -halfCols; col <= halfCols; col++) {
              // 奇數列向右偏移半個間距（與紅色圓圈互補）
              const xOffset = (row % 2) * (horizontalSpacing / 2);
              const x = centerX + col * horizontalSpacing + xOffset;
              const y = centerY + row * verticalSpacing;

              ctx.beginPath();
              ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(100, 100, 100, ${grayCircleOpacity.current})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }
      };

      // 初始化 Canvas 樣式並加入 DOM
      canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;';
      bgCircleRef.current.appendChild(canvas);
      updateCanvasSize();

      // 監聽視窗大小變化
      window.addEventListener('resize', updateCanvasSize);

      // ============================
      // ScrollTrigger 動畫設定
      // ============================
      // 動畫：顯示灰色外框圓圈（代表潛在贊助者）
      gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="show-hidden-circle"]',
          start: 'top 50%',
          end: 'top 20%',
          scrub: true,
          onUpdate: (self) => {
            // 根據滾動進度調整灰色圓圈透明度
            grayCircleOpacity.current = self.progress;
            showHiddenCircles.current = self.progress > 0;
            drawCircles.current();
          }
        }
      });

      // 動畫：放大圓圈效果（強調贊助者數量）
      gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="bigger-circle"]',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          onUpdate: (self) => {
            // 圓圈從原始大小放大到指定倍數
            circleScale.current = 1 + self.progress * 5;
            drawCircles.current();
          }
        }
      });

      return () => {
        window.removeEventListener('resize', updateCanvasSize);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      };
    }, []);

    // ============================
    // 渲染區塊
    // ============================
    return (
      <div 
        ref={bgCircleRef} 
        className={`w-full h-screen absolute top-0 left-0 -z-10 ${className}`}
      />
    );
  }
);

FeedbackCircleBackground.displayName = 'FeedbackCircleBackground';

export default FeedbackCircleBackground;