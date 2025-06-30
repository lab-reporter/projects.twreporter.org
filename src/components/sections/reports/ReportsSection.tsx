'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';

export default function ReportsSection() {
  useScrollTrigger({
    sectionId: 'section-reports',
    sectionName: 'reports'
  });

  return (
    <section
      id="section-reports"
      className="w-full h-auto bg-white text-black flex flex-col items-center justify-center px-8"
    >
      <div className="py-8 mt-8">
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