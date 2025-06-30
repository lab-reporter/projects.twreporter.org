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

    // 使用 gsap.fromTo 搭配 ScrollTrigger 的精簡寫法
    gsap.fromTo(sectionHeading,
      { opacity: 0 }, // 從 opacity: 0 開始
      {
        opacity: 1, // 到 opacity: 1 結束
        scrollTrigger: {
          trigger: sectionHeading,
          start: 'top -10%',
          end: '+=100',
          markers: true,
          scrub: true,
          id: 'reports-section-heading-fade-in'
        }
      }
    );

    return () => {
      ScrollTrigger.getById('reports-section-heading-fade-in')?.kill();
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