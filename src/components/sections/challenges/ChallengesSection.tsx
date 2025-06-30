'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';

export default function ChallengesSection() {
  useScrollTrigger({
    sectionId: 'section-challenges',
    sectionName: 'challenges'
  });

  return (
    <section
      id="section-challenges"
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <SectionHeadings
        titleEn="BREAKTHROUGH"
        titleZh="非營利媒體・突圍"
      >
        <p>
          非營利媒體的10年路，背後是數不清的辯證、碰壁，和重新出發。<br />
          既有新聞創業與媒體營運甘苦談，也有不同路徑的艱難選擇。<br />
          一起走進新聞室的幕後，看這條獨立媒體之路的心路歷程。
        </p>
      </SectionHeadings>


    </section>
  );
}