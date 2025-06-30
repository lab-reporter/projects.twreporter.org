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
      className="sticky top-0 w-full h-screen overflow-hidden relative z-0"
      style={{
        backgroundImage: 'url(/assets/bg_grid.svg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Container */}
      <div
        className="w-full h-full absolute inset-0 m-auto"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '300px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Left Face */}
        <div
          className="w-full h-full absolute"
          style={{
            transform: 'rotateY(90deg)',
            transformOrigin: 'left',
          }}
        >
          {/* <img src="/assets/img2.png" className="absolute top-[10%] right-[0%] w-[40%] h-auto" alt="" /> */}
        </div>

        {/* Right Face */}
        <div
          className="w-full h-full absolute"
          style={{
            transform: 'rotateY(-90deg)',
            transformOrigin: 'right',
          }}
        ></div>

        {/* Top Face */}
        <div
          className="w-full h-full absolute"
          style={{
            transform: 'rotateX(-90deg)',
            transformOrigin: 'top',
          }}
        ></div>

        {/* Bottom Face */}
        <div
          className="w-full h-full absolute"
          style={{
            transform: 'rotateX(90deg)',
            transformOrigin: 'bottom',
          }}
        ></div>

        {/* Back Face */}
        <div
          className="w-full h-full absolute flex items-center justify-center"
          style={{
            transform: 'translateZ(-800px)',
          }}
        >
        </div>
      </div>
    </section>
  );
}