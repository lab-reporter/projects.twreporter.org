'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export default function ReportsSection() {
  useScrollTrigger({
    sectionId: 'section-reports',
    sectionName: 'reports'
  });

  return (
    <section 
      id="section-reports" 
      className="w-full h-screen bg-white text-black flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">影響力報導</h2>
        <p className="text-xl opacity-75">深度調查 × 社會影響</p>
      </div>
    </section>
  );
}