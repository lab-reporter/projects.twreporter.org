import { ReactNode } from 'react';

interface SectionHeadingsProps {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}

export default function SectionHeadings({ titleEn, titleZh, children }: SectionHeadingsProps) {
  return (
    <div className="w-full mx-auto px-4 py-16 max-w-[50rem]">
      <div className="mb-4">
        <h1 className="text-center text-[5rem] leading-none font-serif font-normal">
          {titleEn}
        </h1>
        <h2 className="leading-normal text-[3rem] font-bold text-center">
          {titleZh}
        </h2>
      </div>
      <div
        className="text-[20px] leading-normal text-justify"
        style={{ textAlignLast: 'center' }}
      >
        {children}
      </div>
    </div>
  );
}