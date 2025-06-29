'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

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
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">挑戰與成長</h2>
        <p className="text-xl opacity-75">非營利媒體之路</p>
      </div>
    </section>
  );
}