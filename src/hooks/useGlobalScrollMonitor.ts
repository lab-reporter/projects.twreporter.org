import { useEffect } from 'react';
import { useStore } from '@/stores';

// 全域滾動監控 Hook
export function useGlobalScrollMonitor() {
  const { setCurrentSection } = useStore();

  useEffect(() => {
    let ticking = false;

    const updateCurrentSection = () => {
      // 排除 opening，因為它是 fixed 定位
      const sections = ['reports', 'innovations', 'challenges', 'feedbacks', 'support'];
      
      // 如果滾動距離很小，保持在 reports（因為 SectionNavigation 只在動畫後顯示）
      // 註解掉這段，因為 opening 是 fixed 定位，不應該被設為 currentSection
      // if (window.scrollY < window.innerHeight * 0.5) {
      //   setCurrentSection('opening');
      //   return;
      // }
      
      // 視窗中心點
      const viewportCenter = window.innerHeight / 2;
      let activeSection: string | null = null;
      let minDistance = Infinity;
      
      for (const sectionName of sections) {
        const element = document.getElementById(`section-${sectionName}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          
          // 檢查章節是否在視窗內
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            // 優先選擇頂部在視窗上半部的章節
            if (rect.top >= -100 && rect.top < viewportCenter) {
              activeSection = sectionName;
              break;
            }
            
            // 計算章節頂部到視窗頂部的距離
            const distance = Math.abs(rect.top);
            
            if (distance < minDistance) {
              minDistance = distance;
              activeSection = sectionName;
            }
          }
        }
      }
      
      // 如果找到 active section 就設定，否則預設為 reports
      if (activeSection) {
        setCurrentSection(activeSection);
      } else {
        // 找不到任何 section 時，預設為 reports
        setCurrentSection('reports');
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // 初始檢查
    updateCurrentSection();

    // 監聽滾動事件
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setCurrentSection]);
}