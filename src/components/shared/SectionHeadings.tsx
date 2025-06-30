import { ReactNode } from 'react';

interface SectionHeadingsProps {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}

export default function SectionHeadings({ titleEn, titleZh, children }: SectionHeadingsProps) {
  return (
    // heading外層容器
    <div className="relative w-full h-[150vh] mx-auto px-4 py-16 max-w-[50rem]">
      {/* heading內層sticky容器 */}
      <div className="mb-4 sticky top-0 h-screen flex flex-col items-center justify-center">
        <h1 className="text-center text-[5rem] leading-none font-serif font-normal">
          {titleEn}
        </h1>
        <h2 className="leading-normal text-[3rem] font-bold text-center">
          {titleZh}
        </h2>
        <div
          className="text-[20px] leading-normal text-justify"
          style={{ textAlignLast: 'center' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}