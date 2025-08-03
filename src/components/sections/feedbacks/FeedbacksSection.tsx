'use client';

import React, { useEffect, useRef } from "react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SupportSection from "../support/SupportSection";
import Image from "next/image";
import FeedbackCircleBackground, { FeedbackCircleBackgroundHandle } from "./FeedbackCircleBackground";

// 註冊 GSAP ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// ============================
// 主要組件
// ============================
// 證言回饋頁面主要組件：展示使用者回饋並引導至贊助頁面
export default function FeedbacksSection() {
  // ============================
  // DOM 參考區塊
  // ============================
  // DOM 元素參考：左側標題容器
  const leftTitleRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：右側標題容器
  const rightTitleRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：報導者 Logo
  const logoRef = useRef<HTMLImageElement>(null);
  // DOM 元素參考：半色調 Logo
  const halftoneRef = useRef<HTMLImageElement>(null);
  // DOM 元素參考：背景圓圈容器
  const bgCircleRef = useRef<FeedbackCircleBackgroundHandle>(null);

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
  // Effects 區塊 - 主要動畫序列
  // ============================
  // 設定頁面滾動動畫序列
  useEffect(() => {

    // ============================
    // 第二階段：感謝頁面轉場動畫
    // ============================
    if (leftTitleRef.current && rightTitleRef.current && logoRef.current) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="thanks-area"]',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        }
      });

      titleTl
        // 標題向上移動
        .to([leftTitleRef.current, rightTitleRef.current], {
          y: '-50%',
          ease: 'power2.inOut'
        })
        // 顯示報導者 Logo
        .to(logoRef.current, {
          scale: 1,
        }, '<')
        // 顯示半色調 Logo
        .to(halftoneRef.current, {
          scale: 1,
        }, '<');
    }

    // ============================
    // 第三階段：半色調轉場到圓圈背景
    // ============================
    if (halftoneRef.current && logoRef.current && leftTitleRef.current && rightTitleRef.current) {
      const halftoneTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-trigger="halftone-area"]',
          start: 'top 20%',
          end: 'bottom 20%',
          scrub: true,
        }
      });

      halftoneTl
        // 半色調 Logo 放大並淡出
        .to(halftoneRef.current, {
          scale: 200,
          opacity: 0,
          ease: 'power2.inOut'
        })
        // 同時淡出其他元素
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          opacity: 0,
          ease: 'expo.out'
        }, '<')
        // 隱藏元素
        .to([logoRef.current, leftTitleRef.current, rightTitleRef.current], {
          display: 'none'
        }, '<')
        // 顯示圓圈背景
        .call(() => {
          // 使用 DOM 查詢找到 canvas 元素
          const canvas = document.querySelector('#section-feedbacks canvas');
          if (canvas) {
            gsap.to(canvas, {
              opacity: 1,
              ease: 'power2.in',
              duration: 1
            });
          }
        }, [], '<')
    }

    // 清理函數：移除所有 ScrollTrigger 實例
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // ============================
  // 渲染區塊
  // ============================
  // 組件渲染輸出
  return (
    // 主容器：設定總體滾動高度以容納所有動畫階段
    <section
      id="section-feedbacks"
      className="w-full h-[800vh] text-white"
    >
      {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
      <div data-trigger="content-area" className="overflow-hidden h-screen sticky top-0 text-center flex flex-col md:flex-row justify-center items-center gap-[0px]">
        {/* 左側標題：感謝詞前半段 */}
        <div className="h-[28px] overflow-hidden">
          <div ref={leftTitleRef}>
            <h4 className="text-right leading-none">持續求真的路上</h4>
            <h4 className="text-right leading-none">因為有你們</h4>
          </div>
        </div>
        {/* 右側標題：感謝詞後半段 */}
        <div className="h-[28px] overflow-hidden">
          <div ref={rightTitleRef}>
            <h4 className="text-left leading-none">感謝有眾聲同行</h4>
            <h4 className="text-left leading-none">才有報導者</h4>
          </div>
        </div>


        {/* Logo 元素：用於轉場動畫 */}
        <img ref={halftoneRef} src="/assets/logo-halftone.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <img ref={logoRef} src="/assets/favicon.svg" alt="報導者LOGO" className="w-[48px] h-auto mx-auto scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* 背景圓圈容器：Canvas 繪圖區域 */}
        <FeedbackCircleBackground ref={bgCircleRef} />
      </div>

      {/* ============================
      // 轉場區域：動畫觸發點
      // ============================*/}
      <div data-trigger="thanks-area" className="h-[50vh]">
      </div>

      <div data-trigger="halftone-area" className="h-[50vh]">
      </div>

      {/* ============================
      // 第二部分：贊助者統計與號召
      // ============================*/}
      <div className="z-1 h-auto">
        {/* 現有贊助者感謝 */}
        <div className="relative flex flex-col items-center justify-center h-screen">
          <div>
            <h3>感謝目前</h3>
            <h1>
              7964
              <span className="text-4xl font-bold">位</span>
            </h1>
            <h3 className="mb-2">定期定額贊助者</h3>
            <h5>讓《報導者》持續獨立運作、挖掘真相</h5>
          </div>
        </div>
        
        {/* 號召新贊助者（觸發灰色圓圈顯示） */}
        <div data-trigger="show-hidden-circle" className="relative flex flex-col items-center justify-center h-screen">
          <div>
            <h5>
              為了迎接下一個十年的種種挑戰 <br />
              我們需要更多定期定額支持的夥伴與我們前行
            </h5>
            <h4>號招</h4>
            <h1>
              10000
              <span className="text-4xl font-bold">位</span>
            </h1>
            <h3 className="mb-2">支持報導者的定期定額贊助者</h3>
            <h6>和我們一起打造多元進步的公民社會</h6>
          </div>
        </div>
        
        {/* 十週年限定回饋（觸發圓圈放大） */}
        <div data-trigger="bigger-circle" className="relative flex flex-col items-center justify-center h-screen">
          <Image
            src="/assets/gift.png"
            width={1000}
            height={1000}
            alt="十週年限定贊助回饋"
            className="w-full h-auto max-w-[30rem]" />
          <h4 className="mb-2 font-bold">
            十週年限定贊助回饋
          </h4>
          <h6 className="leading-relaxed">
            凡在2025年11月30日（日）前加入定期定額贊助行列 <br />
            即可在《報導者》十週年活動領取十週年限定紀念品
          </h6>
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