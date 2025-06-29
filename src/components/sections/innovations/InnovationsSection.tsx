'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function InnovationsSection() {
  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations'
  });

  return (
    <section 
      id="section-innovations" 
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">多元創新</h2>
        <p className="text-xl opacity-75">數位敘事 × 新聞實驗</p>
      </div>
    </section>
  );
}