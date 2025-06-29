'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function FeedbacksSection() {
  useScrollTrigger({
    sectionId: 'section-feedbacks',
    sectionName: 'feedbacks'
  });

  return (
    <section 
      id="section-feedbacks" 
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">贊助者證言</h2>
        <p className="text-xl opacity-75">支持者的聲音</p>
      </div>
    </section>
  );
}