'use client';

import { useStore } from '@/stores';

// 匯入各個 Section 組件
import ReportsSection from './sections/ReportsSection';
import InnovationSection from './sections/InnovationSection';
import TimelineSection from './sections/TimelineSection';
import FeedbackSection from './sections/FeedbackSection';
import SupportSection from './sections/SupportSection';

interface SectionRendererProps {
  onCurrentProjectChange?: (project: any) => void;
  onInnovationFocusChange?: (project: any) => void;
  onInnovationFocusedItemChange: (item: any) => void;
}

export default function SectionRenderer({
  onCurrentProjectChange,
  onInnovationFocusChange,
  onInnovationFocusedItemChange
}: SectionRendererProps) {
  const { currentSection, sectionProgress } = useStore();

  return (
    <>
      {/* Reports Section - 3D 圓柱畫廊 */}
      <ReportsSection 
        visible={currentSection === 'reports'} 
        progress={sectionProgress}
        onCurrentProjectChange={onCurrentProjectChange}
      />
      
      {/* Innovation Section - 3D 模型展示 */}
      <InnovationSection 
        visible={currentSection === 'innovation'} 
        progress={sectionProgress}
        onFocusedItemChange={onInnovationFocusedItemChange}
        onCurrentProjectChange={onInnovationFocusChange}
      />
      
      {/* Timeline Section - 時間軸展示 */}
      <TimelineSection 
        visible={currentSection === 'timeline'} 
        progress={sectionProgress}
      />
      
      {/* Feedback Section - 回饋互動 */}
      <FeedbackSection 
        visible={currentSection === 'feedback'} 
        progress={sectionProgress}
      />
      
      {/* Support Section - 支持者展示 */}
      <SupportSection 
        visible={currentSection === 'support'} 
        progress={sectionProgress}
      />
    </>
  );
} 