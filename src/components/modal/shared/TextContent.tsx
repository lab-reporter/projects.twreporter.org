'use client';

import { ReactNode } from 'react';

interface TextContentProps {
  children: ReactNode;
  className?: string;
  variant?: 'prose' | 'description' | 'summary';
  fontSize?: 'sm' | 'base' | 'lg';
}

export default function TextContent({ 
  children, 
  className = '',
  variant = 'prose',
  fontSize = 'base'
}: TextContentProps) {
  // 基礎樣式配置
  const baseClasses = 'leading-relaxed text-gray-700';
  
  // 變體樣式
  const variantClasses = {
    prose: `
      prose prose-gray max-w-none
      [&_p]:mb-6 [&_p]:leading-relaxed 
      [&_p:last-child]:mb-0
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-3
      [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mb-2
      [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1
      [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1
      [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic
      [&_strong]:font-semibold [&_strong]:text-gray-800
      [&_em]:italic
      [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
    `,
    description: `
      space-y-4
      [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700
      [&_p:last-child]:mb-0
    `,
    summary: `
      space-y-3
      [&_p]:mb-3 [&_p]:leading-normal [&_p]:text-gray-600
      [&_p:last-child]:mb-0
    `
  };
  
  // 字體大小
  const fontSizeClasses = {
    sm: '[&_p]:text-sm',
    base: '[&_p]:text-base',
    lg: '[&_p]:text-lg'
  };
  
  return (
    <div className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${fontSizeClasses[fontSize]}
      ${className}
    `}>
      {children}
    </div>
  );
}