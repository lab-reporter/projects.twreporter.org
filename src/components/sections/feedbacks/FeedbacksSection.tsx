'use client';

import React, { useRef } from "react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import SupportSection from "../support/SupportSection";


// 註冊 GSAP 插件
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);



// ============================
// 主要組件
// ============================
// 證言回饋頁面主要組件：展示使用者回饋並引導至贊助頁面
export default function FeedbacksSection() {

  // ============================
  // 自訂 Hooks 區塊
  // ============================
  // 滾動觸發器：監控當前頁面位置並更新全域狀態
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-feedbacks',
    // 頁面名稱識別
    sectionName: 'feedbacks'
  });

  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：證言卡片
  const cardsRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：卡片外層容器
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用滑鼠追蹤 Hook
  useMouseTracking3D({
    enabled: true,
    targetRef: cardsRef,
    cssProperty: 'perspectiveOrigin',
    rangeMin: 25,
    rangeMax: 75,
    useLerp: true,
    lerpFactor: 0.1
  });

  // ============================
  // ScrollTrigger 動畫設定（使用 useGSAP）
  // ============================
  useGSAP(() => {
    // 確保容器和卡片存在
    if (!containerRef.current || !cardsRef.current) return;

    // 選取所有證言卡片
    const cards = cardsRef.current.querySelectorAll('.feedback-card');

    // 設定初始狀態
    gsap.set(cards, { opacity: 0 });

    // 創建一個代理對象來優化 perspective 動畫
    const proxy = { perspective: 10 };

    // 使用 ScrollTrigger 直接控制動畫
    gsap.to(proxy, {
      perspective: 30,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '10% top', // 只在前 10% 執行動畫
        scrub: 0.3, // 降低 scrub 值讓動畫更流暢
        onUpdate: () => {
          // 使用 CSS 變數來更新 perspective，避免重複計算
          if (cardsRef.current) {
            cardsRef.current.style.setProperty('--perspective', `${proxy.perspective}vw`);
          }
        }
      }
    });

    // 卡片透明度動畫
    gsap.to(cards, {
      opacity: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '10% top',
        scrub: 0.3
      }
    });
  }, { scope: containerRef }); // 設定作用範圍

  // ============================
  // Draggable 拖曳設定（使用 useGSAP）
  // ============================
  useGSAP(() => {
    if (!cardsRef.current) return;

    // 選取所有證言卡片
    const cards = cardsRef.current.querySelectorAll('.feedback-card');

    // 為每張卡片建立 Draggable 實例
    cards.forEach((card) => {
      Draggable.create(card as HTMLElement, {
        type: "x,y",
        // 拖曳時的慣性效果
        inertia: true,
        // 設定邊界（可選）
        bounds: cardsRef.current,
        // 拖曳時提高 z-index
        zIndexBoost: true,
        // 拖曳時的游標樣式
        cursor: "grab",
        activeCursor: "grabbing"
      });
    });
  }, { scope: cardsRef }); // 設定作用範圍

  // ============================
  // 渲染區塊
  // ============================
  // 組件渲染輸出
  return (
    // 主容器：設定總體滾動高度以容納所有動畫階段
    <section
      id="section-feedbacks"
      className="w-full text-white"
    >
      {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
      <div ref={containerRef} className="">
        {/* 背景證言卡片 */}
        <div
          ref={cardsRef}
          className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            perspective: 'var(--perspective, 10vw)',
            willChange: 'perspective-origin',
            // 使用 transform 來啟用 GPU 加速
            transform: 'translateZ(0)'
          }}>
          <div>
            <h2 className="mb-4 leading-relaxed">
              持續求真的路上
              <br />
              感謝有眾聲同行
            </h2>
            <h5 className="mb-2">
              感謝
              <span className="px-2 text-6xl font-normal">7964</span>
              位定期定額贊助者
            </h5>
            <h6>
              讓《報導者》持續獨立運作、挖掘真相
            </h6>
          </div>
        </div>
      </div>

      {/* ============================
      // 第二部分：號召新贊助者
      // ============================*/}
      <div className="z-1 h-auto">
        {/* 號召新贊助者（觸發灰色圓圈顯示） */}
        <div data-trigger="show-hidden-circle" className="relative flex flex-col items-center justify-center h-screen">
          <div>
            <h5>
              為了迎接下一個十年的種種挑戰， <br />
              在經費上我們需要提升小額捐款的比例，
            </h5>
            <h4>我們想號召至少</h4>
            <h1>
              10000
              <span className="text-4xl font-bold">位</span>
            </h1>
            <h4 className="mb-2">支持報導者的定期定額贊助者</h4>
          </div>
        </div>
      </div>

      {/* ============================
      // 第三部分：贊助行動區域
      // ============================*/}
      <div data-trigger="support-section" className="sticky top-0 flex flex-col items-center justify-center h-screen">
        {/* 嵌入贊助區塊組件 */}
        <SupportSection />
      </div>
    </section>
  );
}