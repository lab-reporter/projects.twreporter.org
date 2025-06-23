import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// 節流函數
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// 防抖函數
const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

export const useOptimizedScrollTrigger = ({
    trigger,
    start = "top top",
    end = "bottom bottom",
    scrub = 1,
    onUpdate,
    onEnter,
    onLeave,
    pin = false,
    throttleMs = 16, // 約 60fps
    enabled = true
}) => {
    const triggerRef = useRef(null);
    const rafId = useRef(null);
    const lastProgress = useRef(-1);

    // 優化的更新函數
    const optimizedUpdate = useCallback((self) => {
        // 避免重複計算相同的進度
        if (Math.abs(self.progress - lastProgress.current) < 0.001) {
            return;
        }

        lastProgress.current = self.progress;

        // 使用 RAF 確保在正確的時機更新
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }

        rafId.current = requestAnimationFrame(() => {
            if (onUpdate) {
                onUpdate(self);
            }
        });
    }, [onUpdate]);

    // 節流版本的更新函數
    const throttledUpdate = useCallback(
        throttle(optimizedUpdate, throttleMs),
        [optimizedUpdate, throttleMs]
    );

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const config = {
            trigger,
            start,
            end,
            pin,
            onUpdate: throttledUpdate,
            onEnter: debounce(onEnter || (() => { }), 100),
            onLeave: debounce(onLeave || (() => { }), 100),
        };

        // 根據 scrub 類型設定
        if (typeof scrub === 'number') {
            config.scrub = scrub;
        } else if (scrub === true) {
            config.scrub = 1;
        }

        const scrollTrigger = ScrollTrigger.create(config);
        triggerRef.current = scrollTrigger;

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
            if (triggerRef.current) {
                triggerRef.current.kill();
            }
        };
    }, [trigger, start, end, pin, scrub, throttledUpdate, onEnter, onLeave, enabled]);

    return {
        scrollTrigger: triggerRef.current,
        refresh: () => triggerRef.current?.refresh(),
        kill: () => triggerRef.current?.kill()
    };
};

// 批次 ScrollTrigger 管理
export const useScrollTriggerBatch = (triggers = [], enabled = true) => {
    const triggersRef = useRef([]);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // 清理舊的 triggers
        triggersRef.current.forEach(trigger => trigger.kill());
        triggersRef.current = [];

        // 批次創建新的 triggers
        const newTriggers = triggers.map(config => {
            const scrollTrigger = ScrollTrigger.create({
                ...config,
                // 為每個 trigger 添加默認的節流優化
                onUpdate: config.onUpdate ? throttle(config.onUpdate, 16) : undefined
            });
            return scrollTrigger;
        });

        triggersRef.current = newTriggers;

        return () => {
            triggersRef.current.forEach(trigger => trigger.kill());
            triggersRef.current = [];
        };
    }, [triggers, enabled]);

    return {
        triggers: triggersRef.current,
        refreshAll: () => ScrollTrigger.refresh(),
        killAll: () => {
            triggersRef.current.forEach(trigger => trigger.kill());
            triggersRef.current = [];
        }
    };
};

// 交集觀察器 Hook（用於替代簡單的 ScrollTrigger 場景）
export const useIntersectionObserver = ({
    threshold = 0.1,
    rootMargin = '0px',
    onIntersect,
    onLeave,
    enabled = true
}) => {
    const elementRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!enabled || !elementRef.current) return;

        const observer = new IntersectionObserver(
            throttle((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && onIntersect) {
                        onIntersect(entry);
                    } else if (!entry.isIntersecting && onLeave) {
                        onLeave(entry);
                    }
                });
            }, 100), // 節流 100ms
            { threshold, rootMargin }
        );

        observer.observe(elementRef.current);
        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold, rootMargin, onIntersect, onLeave, enabled]);

    return elementRef;
}; 