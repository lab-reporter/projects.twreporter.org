'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';

export default function InnovationsSection() {
  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations'
  });

  return (
    <section
      id="section-innovations"
      className="w-full h-auto bg-white text-black flex items-center justify-center"
    >
      <SectionHeadings
        titleEn="INNOVATION"
        titleZh="開放新聞室・創新"
      >
        <p>
          《報導者》與時俱進，不斷創新說故事方式、突破敘事框架、翻新內容形式，讓文字、聲音、影像在開放協作中碰撞出新的可能。<br />
          點點物件，看10年來的新嘗試，你參與了多少呢？
        </p>
      </SectionHeadings>
    </section>
  );
}