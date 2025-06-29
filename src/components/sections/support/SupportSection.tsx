'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function SupportSection() {
  useScrollTrigger({
    sectionId: 'section-support',
    sectionName: 'support'
  });

  return (
    <section 
      id="section-support" 
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">贊助支持</h2>
        <p className="text-xl opacity-75">與我們一起前行</p>
      </div>
    </section>
  );
}