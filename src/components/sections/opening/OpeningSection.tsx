'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function OpeningSection() {
  useScrollTrigger({
    sectionId: 'section-opening',
    sectionName: 'opening'
  });

  return (
    <section 
      id="section-opening" 
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">報導者</h1>
        <p className="text-2xl opacity-75">十週年回顧</p>
      </div>
    </section>
  );
}