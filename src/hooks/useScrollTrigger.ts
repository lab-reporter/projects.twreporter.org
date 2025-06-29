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
        
        ScrollTrigger.create({
          trigger: `#${sectionId}`,
          id: `${sectionName}-main`,
          start,
          end,
          onEnter: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Enter ${sectionName} (向下滾動)`);
            }
            setCurrentSection(sectionName);
          },
          onEnterBack: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Enter back ${sectionName} (向上滾動)`);
            }
            setCurrentSection(sectionName);
          },
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