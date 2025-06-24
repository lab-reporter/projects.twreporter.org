'use client';

import { ContentProps } from '../types';

export default function ReportBanner({ projectData }: Pick<ContentProps, 'projectData'>) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {projectData.title}
        </h2>
        {projectData.subtitle && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {projectData.subtitle}
          </p>
        )}
      </div>
      
      {/* 標籤顯示 */}
      {projectData.section && projectData.section.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {projectData.section.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {tag === 'reports' ? '深度報導' : tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}