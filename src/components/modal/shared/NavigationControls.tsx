'use client';

import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { AdjacentProjects } from '../types';

interface NavigationControlsProps {
  onNavigate?: (direction: 'prev' | 'next') => void;
  onHome?: () => void;
  adjacentProjects: AdjacentProjects;
  className?: string;
  showHomeButton?: boolean;
}

export default function NavigationControls({ 
  onNavigate,
  onHome,
  adjacentProjects,
  className = '',
  showHomeButton = true
}: NavigationControlsProps) {
  
  // 按鈕基礎樣式
  const buttonBaseClass = `
    px-4 md:px-6 py-2 md:py-3
    bg-white border border-gray-300
    transition-all duration-200
    hover:bg-gray-50 hover:border-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    font-medium text-sm md:text-base
  `;
  
  const disabledButtonClass = `
    px-4 md:px-6 py-2 md:py-3
    bg-gray-100 border border-gray-200
    text-gray-400 cursor-not-allowed
    font-medium text-sm md:text-base
  `;
  
  return (
    <div className={`w-full flex justify-between items-center gap-2 md:gap-4 my-6 md:my-8 px-4 md:px-8 ${className}`}>
      {/* 上一個按鈕 */}
      {adjacentProjects.prev ? (
        <button
          onClick={() => onNavigate?.('prev')}
          className={`${buttonBaseClass} flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300`}
        >
          <ChevronLeft size={18} />
          <div className="text-left hidden sm:block">
            <div className="text-xs text-gray-500">上一個</div>
            <div className="text-sm font-medium truncate max-w-24 md:max-w-32">
              {adjacentProjects.prev.title}
            </div>
          </div>
          <span className="sm:hidden">上一個</span>
        </button>
      ) : (
        <div className={disabledButtonClass}>
          <ChevronLeft size={18} className="opacity-50" />
          <span className="ml-2 sm:hidden">上一個</span>
          <div className="text-left hidden sm:block ml-2">
            <div className="text-xs">上一個</div>
            <div className="text-sm">---</div>
          </div>
        </div>
      )}
      
      {/* 回到首頁按鈕 */}
      {showHomeButton && (
        <button
          onClick={onHome}
          className={`${buttonBaseClass} flex items-center gap-2 hover:bg-gray-700 hover:text-white hover:border-gray-700`}
        >
          <Home size={16} />
          <span className="hidden sm:inline">回到首頁</span>
          <span className="sm:hidden">首頁</span>
        </button>
      )}
      
      {/* 下一個按鈕 */}
      {adjacentProjects.next ? (
        <button
          onClick={() => onNavigate?.('next')}
          className={`${buttonBaseClass} flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300`}
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-500">下一個</div>
            <div className="text-sm font-medium truncate max-w-24 md:max-w-32">
              {adjacentProjects.next.title}
            </div>
          </div>
          <span className="sm:hidden">下一個</span>
          <ChevronRight size={18} />
        </button>
      ) : (
        <div className={disabledButtonClass}>
          <div className="text-right hidden sm:block mr-2">
            <div className="text-xs">下一個</div>
            <div className="text-sm">---</div>
          </div>
          <span className="sm:hidden mr-2">下一個</span>
          <ChevronRight size={18} className="opacity-50" />
        </div>
      )}
    </div>
  );
}