import { ReactNode } from 'react';
import ScrollDownIndicator from './ScrollDownIndicator';
import Image from 'next/image';

interface SectionHeadingsProps {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
  className?: string;
}

export default function SectionHeadings({ titleEn, titleZh, children, className }: SectionHeadingsProps) {
  return (
    < div className={`mx-auto w-full px-8 flex flex-col items-center justify-center ${className || ''}`} >
      <div className="relative">
        <h1 className="text-center mb-4 relative z-10">
          {titleEn}
        </h1>
        <Image
          src="/assets/line.png"
          alt="Innovation"
          className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 z-0 max-w-[30rem] h-auto"
          width={1382}
          height={213}
        />
      </div>

      <h2 className="text-center">
        {titleZh}
      </h2>
      <div
        className="text-base md:text-lg lg:text-xl mt-4 max-w-[44rem] text-justify"
        style={{ textAlignLast: 'center' }}
      >
        {children}
      </div>
      <div className="hidden lg:block">
        <ScrollDownIndicator />
      </div>
    </div >
  );
}