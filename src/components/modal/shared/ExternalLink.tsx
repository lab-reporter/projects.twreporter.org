'use client';

import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps {
  href?: string;
  children?: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function ExternalLink({ 
  href = '#',
  children = '閱讀完整專題',
  target = '_blank',
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true
}: ExternalLinkProps) {
  
  // 變體樣式
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
    outline: 'bg-transparent text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
  };
  
  // 尺寸樣式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // 圖示尺寸
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };
  
  const handleClick = () => {
    if (href === '#') {
      console.log('閱讀完整專題:', children);
      // 這裡可以加入實際的導航邏輯
    }
  };
  
  return (
    <div className="w-full flex justify-center my-6">
      <a
        href={href}
        target={target}
        onClick={href === '#' ? handleClick : undefined}
        className={`
          inline-flex items-center justify-center gap-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          border rounded-md
          font-medium
          transition-all duration-200
          hover:transform hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${className}
        `}
      >
        {children}
        {showIcon && (
          <ExternalLinkIcon size={iconSizes[size]} className="ml-1" />
        )}
      </a>
    </div>
  );
}