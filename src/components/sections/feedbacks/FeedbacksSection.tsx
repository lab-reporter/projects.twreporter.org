'use client';

import React, { useRef } from "react";
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
      <div className="">
        {/* 背景證言卡片 */}
        <div
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
            <h5 className="mb-4">
              為了讓獨立媒體永續經營、邁向下一個十年 <br />
              我們需要提升小額捐款比例至七成
            </h5>
            <h4>我們希望累積至少</h4>
            <h1>
              10000
              <span className="text-4xl font-noto-serif-tc font-bold">位</span>
            </h1>
            <h4 className="mb-2">定期定額捐款支持的夥伴</h4>
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