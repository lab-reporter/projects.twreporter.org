'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import ReportsSwiper from './ReportsSwiper';

// 影響力報導章節主組件
export default function ReportsSection() {
  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-reports',
    // 頁面名稱識別
    sectionName: 'reports'
  });

  return (
    // 主要報導章節區塊
    <section
      // 頁面錨點 ID
      id="section-reports"
      className="relative w-full h-auto text-black flex flex-col items-center justify-center"
    >
      {/* 章節標題區域：給主時間軸使用的 ID */}
      <div id="reports-section-heading" style={{ opacity: 0 }}>
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

      {/* 報導輪播區域：展示各篇影響力報導 */}
      <div className="w-full">
        <ReportsSwiper />
      </div>
    </section>
  );
}