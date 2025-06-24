'use client';

import { ReactNode } from 'react';

interface ProjectSummaryProps {
  children?: ReactNode;
  title?: string;
  highlights?: string[];
  stats?: Array<{
    label: string;
    value: string | number;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  }>;
  className?: string;
}

export default function ProjectSummary({ 
  children,
  title = '專案重點',
  highlights = [],
  stats = [],
  className = ''
}: ProjectSummaryProps) {
  
  // 統計數據顏色配置
  const statColors = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    gray: 'bg-gray-50 text-gray-800 border-gray-200'
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 自定義內容 */}
      {children && (
        <div className="space-y-4">
          {children}
        </div>
      )}
      
      {/* 重點列表 */}
      {highlights.length > 0 && (
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">
            {title}
          </h3>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm md:text-base text-gray-700"
              >
                <span className="text-blue-500 mt-1">•</span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 統計數據 */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`
                p-3 md:p-4 rounded-lg border text-center
                ${statColors[stat.color || 'gray']}
              `}
            >
              <div className="text-lg md:text-2xl font-bold">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm opacity-80 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}