import { useEffect } from 'react';
import { useStore } from '@/stores';

interface UseScrollTriggerOptions {
  sectionId: string;
  sectionName: string;
  start?: string;
  end?: string;
  delay?: number;
}

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

        // 對於 Opening Section，使用特殊的判斷邏輯
        if (sectionName === 'opening') {
          ScrollTrigger.create({
            trigger: `#${sectionId}`,
            id: `${sectionName}-main`,
            start: "top top",
            end: "bottom top",
            onEnter: () => {
              // 只有當頁面真正在頂部時才設為 opening
              if (window.scrollY < 50) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🏠 Enter ${sectionName} (頁面頂部)`);
                }
                setCurrentSection(sectionName);
              }
            },
            onEnterBack: () => {
              // 向上滾動回到頂部時
              if (window.scrollY < 50) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🏠 Enter back ${sectionName} (回到頂部)`);
                }
                setCurrentSection(sectionName);
              }
            },
          });
        } else {
          // 其他 Section 使用正常邏輯
          ScrollTrigger.create({
            trigger: `#${sectionId}`,
            id: `${sectionName}-main`,
            start,
            end,
            onEnter: () => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`➡️ Enter ${sectionName} (向下滾動)`);
              }
              setCurrentSection(sectionName);
            },
            onEnterBack: () => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`⬅️ Enter back ${sectionName} (向上滾動)`);
              }
              setCurrentSection(sectionName);
            },
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