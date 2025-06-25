'use client';

import { AdjacentProjects } from '../types';

interface NavigationControlsProps {
  onNavigate?: (direction: 'prev' | 'next') => void;
  onHome?: () => void;
  adjacentProjects: AdjacentProjects;
  className?: string;
}

export default function NavigationControls({ 
  onNavigate,
  onHome,
  adjacentProjects,
  className = ''
}: NavigationControlsProps) {
  
  return (
    <div className={`w-full flex justify-between px-8 gap-4 my-8 ${className}`}>
      {/* 上一個按鈕 */}
      {adjacentProjects.prev ? (
        <button
          onClick={() => onNavigate?.('prev')}
          className="px-8 py-2 bg-white border-[1px] border-gray-300 transition-colors duration-300 hover:bg-gray-700 hover:text-white"
        >
          上一個
        </button>
      ) : (
        <div className="px-8 py-2 bg-gray-100 border-[1px] border-gray-200 text-gray-400 cursor-not-allowed">
          上一個
        </div>
      )}
      
      {/* 回到首頁按鈕 */}
      <div 
        onClick={onHome}
        className="px-8 py-2 bg-white border-[1px] border-gray-300 transition-colors duration-300 hover:bg-gray-700 hover:text-white cursor-pointer"
      >
        回到首頁
      </div>
      
      {/* 下一個按鈕 */}
      {adjacentProjects.next ? (
        <button
          onClick={() => onNavigate?.('next')}
          className="px-8 py-2 bg-white border-[1px] border-gray-300 transition-colors duration-300 hover:bg-gray-700 hover:text-white"
        >
          下一個
        </button>
      ) : (
        <div className="px-8 py-2 bg-gray-100 border-[1px] border-gray-200 text-gray-400 cursor-not-allowed">
          下一個
        </div>
      )}
    </div>
  );
}