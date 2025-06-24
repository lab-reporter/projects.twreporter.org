'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentProps, AdjacentProjects } from '../types';

interface NavigationProps extends Pick<ContentProps, 'onNavigate'> {
  adjacentProjects: AdjacentProjects;
}

export default function Navigation({ onNavigate, adjacentProjects }: NavigationProps) {
  if (!onNavigate || (!adjacentProjects.prev && !adjacentProjects.next)) {
    return null;
  }
  
  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
      {/* 上一個項目 */}
      {adjacentProjects.prev ? (
        <button
          onClick={() => onNavigate('prev')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft size={20} />
          <div className="text-left">
            <p className="text-xs text-gray-500">上一個</p>
            <p className="text-sm font-medium truncate max-w-32">
              {adjacentProjects.prev.title}
            </p>
          </div>
        </button>
      ) : (
        <div></div> // 佔位符保持布局
      )}
      
      {/* 下一個項目 */}
      {adjacentProjects.next ? (
        <button
          onClick={() => onNavigate('next')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <div className="text-right">
            <p className="text-xs text-gray-500">下一個</p>
            <p className="text-sm font-medium truncate max-w-32">
              {adjacentProjects.next.title}
            </p>
          </div>
          <ChevronRight size={20} />
        </button>
      ) : (
        <div></div> // 佔位符保持布局
      )}
    </div>
  );
}