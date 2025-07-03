'use client';

import { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ContentWrapper({
  children,
  className = ''
}: ContentWrapperProps) {
  return (
    <div className={`px-12 pt-8 max-w-[720px] mx-auto relative ${className}`}>
      {children}
    </div>
  );
}