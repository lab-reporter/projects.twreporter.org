'use client';

import { ReactNode } from 'react';

interface TextContentProps {
  children: ReactNode;
  className?: string;
}

export default function TextContent({
  children,
  className = ''
}: TextContentProps) {
  return (
    <div className={`text-black project-description font-noto-serif-tc [&>*>p]:mb-6 text-justify [&>*>p:last-child]:mb-0 [&>*>p]:text-[1.125rem] ${className}`}>
      {children}
    </div>
  );
}