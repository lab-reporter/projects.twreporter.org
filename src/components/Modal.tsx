'use client';

import { useEffect } from 'react';
import { useStore } from '@/stores';
import { X } from 'lucide-react';

export default function Modal() {
  const { modal, closeModal } = useStore();

  // ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.isOpen, closeModal]);

  // 阻止背景滾動
  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  const renderContent = () => {
    if (!modal.data) return null;

    // 根據內容類型渲染不同的 Modal 內容
    if (modal.data.title && modal.data.subtitle) {
      // 報導類型
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {modal.data.title}
            </h2>
            <p className="text-lg text-gray-600">
              {modal.data.subtitle}
            </p>
          </div>
          
          {modal.data.path && (
            <div className="w-full">
              <img 
                src={modal.data.path} 
                alt={modal.data.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              這是一篇深度報導的詳細內容。報導者致力於透過深度調查和專業報導，
              揭露重要的社會議題，推動正向的社會改變。
            </p>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                閱讀完整報導
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                分享報導
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (modal.data.description) {
      // 創新項目類型
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {modal.data.title}
            </h2>
            <p className="text-lg text-gray-600">
              {modal.data.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              這是報導者的創新項目之一，展示了我們在數位媒體技術方面的探索和實踐。
              透過技術創新，我們致力於提升新聞報導的品質和影響力。
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">技術特色</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• 創新的互動式設計</li>
                <li>• 優秀的使用者體驗</li>
                <li>• 跨平台兼容性</li>
                <li>• 開源友善</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                了解更多
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                技術文檔
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 默認內容
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {modal.contentId}
        </h2>
        <p className="text-gray-700">
          詳細內容載入中...
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal 內容 */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl max-h-[80vh] w-full mx-4 overflow-hidden">
        {/* 關閉按鈕 */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* 內容區域 */}
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}