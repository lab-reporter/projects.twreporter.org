import { ReactNode } from 'react';

interface SectionHeadingsProps {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
  className?: string;
}

export default function SectionHeadings({ titleEn, titleZh, children, className }: SectionHeadingsProps) {
  return (
    < div className={`mx-auto px-12 h-screen flex flex-col items-center justify-center ${className || ''}`} >
      <h1 className="text-center">
        {titleEn}
      </h1>
      <h2 className="text-center">
        {titleZh}
      </h2>
      <div
        className="text-base md:text-lg lg:text-xl mt-4 max-w-[44rem] text-justify"
        style={{ textAlignLast: 'center' }}
      >
        {children}
      </div>
    </div >
  );
}