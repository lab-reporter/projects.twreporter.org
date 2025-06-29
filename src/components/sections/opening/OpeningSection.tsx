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
      className="w-full h-screen overflow-hidden relative"
    >
      {/* Container */}
      <div 
        className="w-full h-full absolute inset-0 m-auto"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '100px',
          perspectiveOrigin: 'center center'
        }}
      >
        {/* Left Face */}
        <div 
          className="w-full h-full absolute border border-black bg-white"
          style={{
            transform: 'rotateY(90deg)',
            transformOrigin: 'left',
          }}
        />

        {/* Right Face */}
        <div 
          className="w-full h-full absolute border border-black bg-white"
          style={{
            transform: 'rotateY(-90deg)',
            transformOrigin: 'right',
          }}
        />

        {/* Top Face */}
        <div 
          className="w-full h-full absolute border border-black bg-white"
          style={{
            transform: 'rotateX(-90deg)',
            transformOrigin: 'top',
          }}
        />

        {/* Bottom Face */}
        <div 
          className="w-full h-full absolute border border-black bg-white"
          style={{
            transform: 'rotateX(90deg)',
            transformOrigin: 'bottom',
          }}
        />

        {/* Back Face */}
        <div 
          className="w-full h-full absolute border border-black bg-white flex items-center justify-center"
          style={{
            transform: 'translateZ(-400px)',
          }}
        ><img className="w-[50%] h-auto mx-auto" src="/assets/nav_logo--light.svg" alt="" />
        </div>
      </div>
    </section>
  );
}