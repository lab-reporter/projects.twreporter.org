import { useEffect } from 'react';
import { useStore } from '@/stores';

interface UseScrollTriggerOptions {
  sectionId: string;
  sectionName: string;
  start?: string;
  end?: string;
  delay?: number;
}

// 找出目前視窗中最合適的章節
const findActiveSection = (): string | null => {
  // 排除 opening，因為它是 fixed 定位
  const sections = ['reports', 'innovations', 'challenges', 'feedbacks', 'support'];
  
  // 視窗中心點
  const viewportCenter = window.innerHeight / 2;
  let closestSection: { name: string; distance: number } | null = null;
  
  // 不再返回 opening，因為它是 fixed 定位且 SectionNavigation 只在動畫後顯示
  // 預設返回 reports
  if (window.scrollY < window.innerHeight * 0.5) {
    return 'reports';
  }
  
  for (const sectionName of sections) {
    const element = document.getElementById(`section-${sectionName}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      
      // 檢查章節是否在視窗內
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // 優先選擇頂部在視窗上半部的章節
        if (rect.top >= 0 && rect.top < viewportCenter) {
          return sectionName;
        }
        
        // 計算章節中心到視窗中心的距離
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        // 找出最接近視窗中心的章節
        if (!closestSection || distance < closestSection.distance) {
          closestSection = { name: sectionName, distance };
        }
      }
    }
  }
  
  // 如果找到最接近的章節就返回，否則預設返回 reports
  return closestSection?.name || 'reports';
};

export function useScrollTrigger({
  sectionId,
  sectionName,
  start = "top 80%",
  end = "bottom 20%",
  delay = 200
}: UseScrollTriggerOptions) {
  const { setCurrentSection } = useStore();

  useEffect(() => {
    const createScrollTrigger = async () => {
      if (typeof window !== 'undefined') {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        ScrollTrigger.create({
          trigger: `#${sectionId}`,
          id: `${sectionName}-main`,
          start: sectionName === 'opening' ? "top top" : start,
          end: sectionName === 'opening' ? "bottom center" : end,
          markers: false, // 調試時可設為 true
          onEnter: () => {
            // 進入章節時，檢查是否應該更新
            const activeSection = findActiveSection();
            if (activeSection === sectionName) {
              setCurrentSection(sectionName);
              if (process.env.NODE_ENV === 'development') {
                console.log(`✅ onEnter: Setting current section to: ${sectionName}`);
              }
            }
          },
          onLeave: () => {
            // 離開時重新計算最合適的章節
            setTimeout(() => {
              const activeSection = findActiveSection();
              if (activeSection && activeSection !== sectionName) {
                setCurrentSection(activeSection);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🔄 onLeave: Updating section from ${sectionName} to ${activeSection}`);
                }
              }
            }, 50);
          },
          onEnterBack: () => {
            // 往回進入章節時
            const activeSection = findActiveSection();
            if (activeSection === sectionName) {
              setCurrentSection(sectionName);
              if (process.env.NODE_ENV === 'development') {
                console.log(`✅ onEnterBack: Setting current section to: ${sectionName}`);
              }
            }
          },
          onLeaveBack: () => {
            // 往回離開時重新計算
            setTimeout(() => {
              const activeSection = findActiveSection();
              if (activeSection && activeSection !== sectionName) {
                setCurrentSection(activeSection);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🔄 onLeaveBack: Updating section from ${sectionName} to ${activeSection}`);
                }
              }
            }, 50);
          }
        });
      }
    };

    // 延遲建立，確保 GSAP 已經註冊
    const timer = setTimeout(createScrollTrigger, delay);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getById(`${sectionName}-main`)?.kill();
        });
      }
    };
  }, [sectionId, sectionName, start, end, delay, setCurrentSection]);
}