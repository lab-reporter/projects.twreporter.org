'use client';

import { useStore } from '@/stores';
import { useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Modal from '@/components/Modal';
import SectionNavigation from '@/components/SectionNavigation';
import Navigation from '@/components/Navigation';
import FeedbackSection from '@/components/sections/FeedbackSection';
import SupportSection from '@/components/sections/SupportSection';

export default function Home() {
  const { currentSection, sectionProgress } = useStore();

  // 調試用：監控 body overflow 狀態
  useEffect(() => {
    const checkOverflow = () => {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Section: ${currentSection}, Body overflow: ${bodyOverflow}, overflowY: ${bodyOverflowY}`);
      }
    };
    
    checkOverflow();
    
    // 監聽 overflow 變化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          checkOverflow();
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => observer.disconnect();
  }, [currentSection]);

  // 強制確保滾動條可見
  useEffect(() => {
    // 當進入 feedback 或 support section 時，確保滾動條可見
    if (currentSection === 'feedback' || currentSection === 'support') {
      // 延遲一點執行，確保其他組件的 useEffect 已經執行
      const timer = setTimeout(() => {
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = 'auto';
          if (process.env.NODE_ENV === 'development') {
            console.log('強制重置 body overflow 為 auto');
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

  return (
    <div className="relative w-full">
      {/* 載入畫面 */}
      <LoadingScreen />

      {/* 主要內容容器 - 2D 版本 */}
      <div className="relative w-full">
        {/* TODO: 2D Section 組件將在這裡實作 */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">報導者 10 週年回顧</h1>
            <p className="text-xl opacity-75">2D 版本開發中...</p>
          </div>
        </div>
      </div>

      {/* DOM 覆蓋層 - Feedback 和 Support Section */}
      {currentSection === 'feedback' && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-60"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <FeedbackSection 
            visible={true} 
            progress={sectionProgress}
          />
        </div>
      )}
      
      {currentSection === 'support' && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-60"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <SupportSection 
            visible={true} 
            progress={sectionProgress}
          />
        </div>
      )}

      {/* UI 組件 */}
      <Navigation />
      <Modal />
      <SectionNavigation />
    </div>
  );
}
