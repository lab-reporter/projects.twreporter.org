import { useEffect } from 'react';
import { useStore } from '@/stores';

interface UseScrollTriggerOptions {
  sectionId: string;
  sectionName: string;
  start?: string;
  end?: string;
  delay?: number;
}

// 章節優先級配置：數字越大優先級越高
const SECTION_PRIORITY: Record<string, number> = {
  'opening': 0,      // 最低優先級
  'reports': 1,
  'innovations': 2,
  'challenges': 3,
  'feedbacks': 4,
  'support': 5       // 最高優先級
};

// 檢查是否有更高優先級的章節在視窗中
const hasHigherPrioritySectionInView = (currentSectionName: string): boolean => {
  const currentPriority = SECTION_PRIORITY[currentSectionName] || 0;

  // 檢查所有優先級更高的章節
  const higherPrioritySections = Object.entries(SECTION_PRIORITY)
    .filter(([_, priority]) => priority > currentPriority)
    .map(([sectionName, _]) => sectionName);

  // 檢查這些章節是否在視窗中
  for (const sectionName of higherPrioritySections) {
    const element = document.getElementById(`section-${sectionName}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      // 更嚴格的檢查：章節必須有顯著部分在視窗中（至少 30% 的視窗高度）
      const significantHeight = window.innerHeight * 0.3;
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const isSignificantlyInView = visibleHeight > significantHeight && rect.top < window.innerHeight * 0.7;

      if (isSignificantlyInView) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚫 Higher priority section "${sectionName}" is significantly in view, blocking "${currentSectionName}"`);
        }
        return true;
      }
    }
  }

  return false;
};

// 檢查當前章節是否應該被設為 active（基於滾動方向的智能檢查）
const shouldSetCurrentSection = (sectionName: string, isEnteringFromTop: boolean = true): boolean => {
  // 對於往回滾動的情況，需要更寬鬆的檢查
  if (!isEnteringFromTop) {
    // 檢查當前章節是否在視窗的主要區域
    const element = document.getElementById(`section-${sectionName}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInMainView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.1;

      if (isInMainView && !hasHigherPrioritySectionInView(sectionName)) {
        return true;
      }
    }
    return false;
  }

  // 正常進入時的檢查
  return !hasHigherPrioritySectionInView(sectionName);
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

        // 對於 Opening Section，使用修正的邏輯
        if (sectionName === 'opening') {
          ScrollTrigger.create({
            trigger: `#${sectionId}`,
            id: `${sectionName}-main`,
            start: "top top",
            end: "+=100px", // 滾動 100px 後結束 opening 狀態
            onEnter: () => {
              // 檢查是否有更高優先級的章節在視窗中
              if (shouldSetCurrentSection(sectionName, true)) {
                setCurrentSection(sectionName);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Setting current section to: ${sectionName}`);
                }
              }
            },
            onLeave: () => {
              if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Leaving opening section');
              }
            },
            onEnterBack: () => {
              // 回到頂部時，檢查是否應該設為 opening
              if (shouldSetCurrentSection(sectionName, false)) {
                setCurrentSection(sectionName);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ EnterBack: Setting current section to: ${sectionName}`);
                }
              }
            },
            onLeaveBack: () => {
              if (process.env.NODE_ENV === 'development') {
                console.log('🔄 LeaveBack: Leaving opening section (going down)');
              }
            }
          });
        } else {
          // 其他 Section 使用優先級檢查邏輯
          ScrollTrigger.create({
            trigger: `#${sectionId}`,
            id: `${sectionName}-main`,
            start,
            end,
            onEnter: () => {
              // 從上方進入時，總是設定較高優先級的章節
              if (shouldSetCurrentSection(sectionName, true)) {
                setCurrentSection(sectionName);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Setting current section to: ${sectionName} (priority: ${SECTION_PRIORITY[sectionName]})`);
                }
              }
            },
            onLeave: () => {
              // 離開時的處理（向下滾動離開）
              if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 Leaving section: ${sectionName} (scrolling down)`);
              }
            },
            onEnterBack: () => {
              // 回到章節時（從下方回來），使用逆向滾動檢查
              if (shouldSetCurrentSection(sectionName, false)) {
                setCurrentSection(sectionName);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ EnterBack: Setting current section to: ${sectionName} (scrolling back up)`);
                }
              }
            },
            onLeaveBack: () => {
              // 往回離開時的處理（向上滾動離開）
              if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 LeaveBack: Leaving section: ${sectionName} (scrolling up)`);
              }
            }
          });
        }
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