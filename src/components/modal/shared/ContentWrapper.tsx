'use client';

import { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export default function ContentWrapper({ 
  children, 
  className = '',
  maxWidth = '4xl'
}: ContentWrapperProps) {
  // 最大寬度映射
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };
  
  return (
    <div className={`
      px-4 md:px-8 lg:px-12 
      pt-6 
      ${maxWidthClasses[maxWidth]} 
      mx-auto 
      relative
      ${className}
    `}>
      {children}
    </div>
  );
}