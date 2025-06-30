'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';

export default function ReportsSection() {
  const sectionHeadingRef = useRef<HTMLDivElement>(null);

  useScrollTrigger({
    sectionId: 'section-reports',
    sectionName: 'reports'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const sectionHeading = sectionHeadingRef.current;
    if (!sectionHeading) return;

    // 設定初始狀態：opacity: 0
    gsap.set(sectionHeading, {
      opacity: 0
    });

    // 創建 ScrollTrigger 動畫
    const trigger = ScrollTrigger.create({
      trigger: sectionHeading,
      start: 'top top', // 當 sectionHeading 的 top 碰到螢幕的 top
      end: '+=100',   // 立即執行
      markers: true,
      onEnter: () => {
        // 執行 0.5 秒的淡入動畫
        gsap.to(sectionHeading, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      },
      onLeave: () => {
        // 當滾動超過動畫區域時，確保停留在顯示狀態
        gsap.to(sectionHeading, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onEnterBack: () => {
        // 往回滾動進入動畫區域時，保持顯示狀態
        gsap.to(sectionHeading, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        // 往回滾動離開動畫區域時，恢復到透明狀態
        gsap.to(sectionHeading, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      id: 'reports-section-heading-fade-in'
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="section-reports"
      className="relative w-full h-auto text-black flex flex-col items-center justify-center px-8"
    >
      <div ref={sectionHeadingRef}>
        <SectionHeadings
          titleEn="IMPACT"
          titleZh="深度報導・影響力"
        >
          <p>
            「深度報導並不朝生暮死，它們帶著應該被聽見的聲音，持續發聲。」<br />
            《報導者》許多報導因為讀者的迴響，具體改變了政策與受訪者處境。
            點開報導，你將看見這些改變如何發生。
          </p>
        </SectionHeadings>
      </div>

      <div className="w-full">
        <ReportsSwiper />
      </div>
    </section>
  );
}