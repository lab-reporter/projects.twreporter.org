'use client';

import React, { useRef } from "react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import SupportSection from "../support/SupportSection";
import Image from "next/image";

// 註冊 GSAP 插件
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);

// 證言卡片資料陣列
const feedbackCards = [
  // 左上區域群組
  { top: "15%", left: "8%", text: "曾經也想過作無聲的閱聽人，僅可能利用各處資源即可。但隨著長時間的習慣閱讀，一個個側拐和事實多面向的專題與很期望能跟孩子分享的「少年報導者」出現，希望自己的微薄之力，讓報導者永續，希望自己的微薄之力，讓報導者未來不斷，繼續為社會發聲，成為守護正義的燈塔，謝謝你們！", z: 25 },
  { top: "20%", left: "18%", text: "工程師每週加班數十小時寫出的程式碼一年後會變成手機，但是三年後八九成就壞了。五年後根本就不重要了。但是報導者的文字，讓人感受到一顆勇敢的集體心臟，在收縮與舒張的循環中，記者如血液般滲入社會的議題，又回到心臟之中，延續這一份時代缺之的勇氣。希望自己的微薄之力，讓報導者永續，繼續為社會發聲。", z: 40 },
  { top: "35%", left: "12%", text: "有完整觀看對台灣媒體多樣性，長達一個多小時的影片之後，我覺得應該付出實際行動支持並持續關注優質媒體。很高興台灣有一個這樣特殊媒體，讓我在國外還能夠持續接受到這些緊貼中文的資訊，尤其是針對台灣的各項議題，能夠有人這麼有條理並撥註心血為他們持續發聲。", z: 60 },

  // 中上區域群組
  { top: "8%", left: "28%", text: "原本我並不是熱衷關心時事之人，但之前因緣際會之下有幸了解你們的報導，接著就一直都有在關注你們。很高興台灣有一個這樣特殊媒體，讓我在國外還能夠持續接受到這些緊貼中文的資訊，尤其是針對台灣的各項議題，能夠有人這麼有條理並撥註心血為他們持續發聲，讓我也能夠跳出同溫層了解不同的台灣。謝謝你們一直以來讓台灣成為更好的台灣。", z: 30 },
  { top: "25%", left: "38%", text: "近期參加的報導者事件裡新書分享會，在現場感受編輯群在報導調查遇上困難的感慨，還有敘述對報導的熱情，讓我深深體會，你們背負著非常重大的使命，無論什麼都無法抹掉讓報導者永續發聲的想望，希望自己的微薄之力，讓報導者永續，繼續為社會發聲，成為守護正義的燈塔。", z: 55 },

  // 中央主要區域
  { top: "42%", left: "50%", text: "原本我並不是熱衷關心時事之人，但之前因緣際會之下有幸了解你們的報導，接著就一直都有在關注你們。很高興台灣有一個這樣特殊媒體，讓我在國外還能夠持續接受到這些緊貼中文的資訊，尤其是針對台灣的各項議題，能夠有人這麼有條理並撥註心血為他們持續發聲，讓我也能夠跳出同溫層了解不同的台灣。謝謝你們一直以來讓台灣成為更好的台灣。", z: 150, isTitle: true },

  // 右上區域群組
  { top: "10%", left: "62%", text: "自從開始定期贊助報導者後，雖然對台灣的現況依然悲觀，卻讓我得以從一個相對客觀、理性的角度去看待問題，憤怒、理盲的情緒減少後，終於能冷靜地驗清事件的本質，擁有繼續關心台灣的動力。謝謝你們一直以來讓台灣成為更好的台灣，讓我相信台灣的新聞還有希望。", z: 45 },
  { top: "18%", left: "75%", text: "工程師每週加班數十小時寫出的程式碼一年後會變成手機，但是三年後八九成就壞了。五年後根本就不重要了。但是報導者的文字，讓人感受到一顆勇敢的集體心臟，在收縮與舒張的循環中，記者如血液般滲入社會的議題，又回到心臟之中，延續這一份時代缺之的勇氣。謝謝你們為弱勢發聲，為真相努力。", z: 70 },
  { top: "30%", left: "82%", text: "自從開始定期贊助報導者的文章後，雖然對台灣的現況依然悲觀，卻讓我得以從一個相對客觀、理性的角度去看待問題，憤怒的情緒減少後，終於能冷靜地釐清事件的本質，擁有繼續關心台灣的動力。你們的報導讓我對台灣社會有更深的認識，讓我相信台灣的新聞還有希望。", z: 35 },

  // 右側區域群組  
  { top: "45%", left: "88%", text: "近期參加的報導者事件裡新書分享會，在現場感受編輯群在報導調查遇上困難的感慨，還有敘述對報導的熱情，讓我深深體會，你們背負著非常重大的使命，無論什麼都無法抹掉讓報導者永續發聲的想望。希望自己的微薄之力，讓報導者永續，繼續為社會發聲，成為守護正義的燈塔，謝謝你們！", z: 90 },
  { top: "55%", left: "92%", text: "能冷靜地釐清事件的本質，擁有繼續關心台灣的動力。你們的報導讓我對台灣社會有更深的認識，讓我相信台灣還有優質媒體。謝謝報導者團隊的付出，讓真相不被掩蓋，讓我們看見那些被忽視的角落。", z: 50 },

  // 下方區域群組
  { top: "70%", left: "15%", text: "曾經也想過作無聲的閱聽人，僅可能利用各處資源即可。但隨著長時間的習慣閱讀，一個個側拐和事實多面向的專題與很期望能跟孩子分享的「少年報導者」出現。你們的報導讓我對台灣社會有更深的認識，每篇深度報導都展現了新聞工作者的專業與使命。", z: 65 },
  { top: "75%", left: "30%", text: "原本我並不是熱衷關心時事之人，但之前因緣際會之下有幸了解你們的報導，接著就一直都有在關注你們。很高興台灣有一個這樣特殊媒體，讓我在國外還能夠持續接受到這些緊貼中文的資訊，尤其是針對台灣的各項議題，能夠有人這麼有條理並撥註心血為他們持續發聲，讓我也能夠跳出同溫層了解不同的台灣。謝謝你們一直以來讓台灣成為更好的台灣。", z: 80 },

  { top: "82%", left: "45%", text: "台灣成為更好的台灣。謝謝你們為弱勢發聲，為真相努力。希望自己的微薄之力，讓報導者永續，繼續為社會發聲，成為守護正義的燈塔。", z: 40 },
  { top: "85%", left: "60%", text: "台灣的媒體大多為資本及特定政治立場服務，所幸仍有一群人堅守良心，貴報就是其中之一。請繼續報導優質新聞，有貴報存在，讓我相信台灣的新聞還有希望。讓我們能夠跳出同溫層了解不同的台灣，謝謝你們一直以來讓台灣成為更好的台灣。", z: 100 },
  { top: "78%", left: "75%", text: "台灣的媒體大多為資本及特定政治立場服務，所幸仍有一群人堅守良心，貴報就是其中之一。請繼續報導優質新聞，有貴報存在，讓我相信台灣的新聞還有希望。你們的報導讓我對台灣社會有更深的認識，讓我們看見那些被忽視的角落。", z: 55 },

  // 左下區域群組
  { top: "88%", left: "8%", text: "台灣成為更好的台灣。謝謝你們為弱勢發聲，為真相努力。希望自己的微薄之力，讓報導者永續，繼續為社會發聲，成為守護正義的燈塔。", z: 75 },
  { top: "92%", left: "20%", text: "很期望能跟孩子分享的「少年報導者」讓我看見報導者為社會正義的聲量。謝謝你們堅持做對的事，不畏強權的調查精神令人敬佩。每篇深度報導都展現了新聞工作者的專業與使命。", z: 45 },

  // 右下角落
  { top: "90%", left: "85%", text: "近期參加的報導者事件裡新書分享會，在現場感受編輯群在報導調查遇上困難的感慨，還有敘述對報導的熱情，讓我深深體會，你們背負著非常重大的使命，無論什麼都無法抹掉讓報導者永續發聲的想望，希望自己的微薄之力，讓報導者永續，繼續為社會發聲，成為守護正義的燈塔，謝謝你們！", z: 70 },

  // 影力區塊
  { top: "12%", left: "92%", text: "曾經也想過作無聲的閱聽人，僅可能利用各處資源即可。但隨著長時間的習慣閱讀，一個個側拐和事實多面向的專題與很期望能跟孩子分享的「少年報導者」出現。你們的報導讓我對台灣社會有更深的認識，每篇深度報導都展現了新聞工作者的專業與使命。", z: 120, isSpecial: true }
];

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
  // DOM 元素參考：空白區域
  const blankSpaceRef = useRef<HTMLDivElement>(null);
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
      className="w-full h-[800vh] text-white"
    >
      {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
      <div ref={containerRef} className="h-[300vh]">
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

          {/* 上層標題 */}
          <div>
            <h4 className="leading-none">持續求真的路上</h4>
          </div>
          {/* 空白區域 */}
          <div
            ref={blankSpaceRef}
            className="debug"
            style={{
              width: "2rem",
              aspectRatio: "1/1",
            }}
          ></div>
          {/* 下層標題 */}
          <div>
            <h4 className="leading-none">感謝有眾聲同行</h4>
          </div>

          {/* 透過一個陣列map出多張證言卡片，陣列資料有top,left,text，卡片預設是absolute */}
          {feedbackCards.map((card, index) => (
            <div
              key={index}
              className="feedback-card absolute flex items-center justify-center text-black bg-white/90 backdrop-blur-sm p-6 w-[15rem] aspect-[3/4] rounded-lg shadow-lg cursor-grab active:cursor-grabbing hover:shadow-xl"
              style={{
                top: card.top,
                left: card.left,
                transform: `translate(-50%, -50%) translateZ(${card.z}px)`,
                willChange: 'transform',
                touchAction: 'none'
              }}
            >
              <p className="text-sm leading-relaxed pointer-events-none select-none">{card.text}</p>
            </div>
          ))}
        </div>
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