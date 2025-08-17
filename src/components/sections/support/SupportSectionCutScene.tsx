'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SupportCutSceneSection from "./SupportCutSceneSection";
import SupportMainSection from './SupportMainSection';

export default function SupportSectionCutScene() {
  useScrollTrigger({
    sectionId: 'section-support',
    sectionName: 'support'
  });

  return (
    <section
      id="section-support"
      className="w-full flex flex-col"
    >
      <SupportCutSceneSection />
      <SupportMainSection />
    </section>
  );
}