import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  // 觸發範圍，0.0 = 剛進入，1.0 = 完全進入
  threshold?: number;
  // 提前觸發的邊距
  rootMargin?: string;
  // 是否只觸發一次
  triggerOnce?: boolean;
}

// 視窗可見性監聽 Hook
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    triggerOnce = false
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果設定只觸發一次且已經觸發過，則不再監聽
    if (triggerOnce && hasBeenVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
        
        // 如果設定只觸發一次且已觸發，則停止監聽
        if (triggerOnce && visible) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasBeenVisible]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible
  };
}