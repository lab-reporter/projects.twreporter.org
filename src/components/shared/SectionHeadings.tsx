import { ReactNode } from 'react';

interface SectionHeadingsProps {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}

export default function SectionHeadings({ titleEn, titleZh, children }: SectionHeadingsProps) {
  return (
    // heading外層容器
    <div className="relative w-full h-[150vh] mx-auto">
      {/* heading內層sticky容器 */}
      <div className="mb-4 mx-auto px-8 sticky top-0 h-screen flex flex-col items-center justify-center">
        <h1 className="text-center">
          {titleEn}
        </h1>
        <h2 className="text-center">
          {titleZh}
        </h2>
        <div
          className="text-xl mt-4 max-w-[44rem] text-justify"
          style={{ textAlignLast: 'center' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}