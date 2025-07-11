'use client';

import SectionHeadings from '@/components/shared/SectionHeadings';

interface ChallengesIntroProps {
  className?: string;
}

export default function ChallengesIntro({ className = '' }: ChallengesIntroProps) {
  return (
    <div className={`w-screen flex-1 mx-auto flex flex-col items-center justify-center gap-4 mb-10 mt-20 ${className}`}>
      <SectionHeadings
        titleEn="Breakthrough"
        titleZh="非營利媒體・突圍"
      >
        <p>
          非營利媒體的10年路，背後是數不清的辯證、碰壁，和重新出發。<br />
          既有新聞創業與媒體營運甘苦談，也有不同路徑的艱難選擇。<br />
          一起走進新聞室的幕後，看這條獨立媒體之路的心路歷程。
        </p>
      </SectionHeadings>
    </div>
  );
}