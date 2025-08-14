import { useEffect, useRef } from 'react';
import { useStore } from '@/stores';

interface DebugEvent {
    timestamp: number;
    type: 'scroll' | 'click' | 'navigation' | 'section-change' | 'animation' | 'swiper' | 'modal' | 'keyboard' | 'focus' | 'other';
    source: string;
    details: Record<string, unknown>;
    scrollY: number;
    currentSection?: string;
}

// 全域調試追蹤器
class DebugTracker {
    private events: DebugEvent[] = [];
    private maxEvents = 50;
    private lastScrollY = 0;
    private scrollTimeout: NodeJS.Timeout | null = null;

    log(type: DebugEvent['type'], source: string, details: Record<string, unknown> = {}) {
        if (process.env.NODE_ENV !== 'development') return;

        const { currentSection } = useStore.getState();
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

        const event: DebugEvent = {
            timestamp: Date.now(),
            type,
            source,
            details,
            scrollY,
            currentSection
        };

        this.events.push(event);

        // 保持事件數量在限制內
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        // 特殊事件的特別標記
        const isImportant = type === 'navigation' || type === 'section-change' ||
            (type === 'scroll' && Math.abs(scrollY - this.lastScrollY) > 500);

        if (isImportant) {
            console.log(`🔍 [DEBUG-${type.toUpperCase()}] ${source}:`, {
                scrollY: `${scrollY}px`,
                currentSection,
                ...details
            });
        }

        this.lastScrollY = scrollY;
    }

    // 取得最近的事件
    getRecentEvents(count = 10) {
        return this.events.slice(-count);
    }

    // 搜尋特定類型的事件
    findEvents(type?: DebugEvent['type'], source?: string, timeRange?: number) {
        let filtered = this.events;

        if (type) {
            filtered = filtered.filter(e => e.type === type);
        }

        if (source) {
            filtered = filtered.filter(e => e.source.includes(source));
        }

        if (timeRange) {
            const cutoff = Date.now() - timeRange;
            filtered = filtered.filter(e => e.timestamp > cutoff);
        }

        return filtered;
    }

    // 分析跳轉事件
    analyzeJumpEvents() {
        const recentEvents = this.getRecentEvents(30);
        const scrollJumps = [];

        for (let i = 1; i < recentEvents.length; i++) {
            const prev = recentEvents[i - 1];
            const curr = recentEvents[i];
            const scrollDiff = Math.abs(curr.scrollY - prev.scrollY);
            const timeDiff = curr.timestamp - prev.timestamp;

            // 檢測異常的滾動跳躍（超過 500px 且時間很短）
            if (scrollDiff > 500 && timeDiff < 1000) {
                const jumpEvent = {
                    from: prev,
                    to: curr,
                    scrollDiff,
                    timeDiff,
                    possibleCause: this.determinePossibleCause(prev, curr),
                    context: this.getEventContext(i, recentEvents)
                };

                scrollJumps.push(jumpEvent);

                // 立即輸出詳細信息
                console.group('🚨 檢測到滾動跳躍事件');
                console.log('跳躍距離:', scrollDiff + 'px');
                console.log('時間差:', timeDiff + 'ms');
                console.log('從:', prev.scrollY + 'px →', curr.scrollY + 'px');
                console.log('可能原因:', jumpEvent.possibleCause);
                console.log('前一事件:', prev);
                console.log('當前事件:', curr);
                console.log('上下文事件:', jumpEvent.context);

                // 分析可能的觸發點
                console.log('📊 事件時間線分析:');
                jumpEvent.context.forEach((ctx: any, idx: number) => {
                    const marker = ctx.relativeIndex === 0 ? '👉 [跳躍點]' :
                        ctx.relativeIndex === -1 ? '⬅️ [前一事件]' :
                            `${ctx.relativeIndex > 0 ? '➡️' : '⬅️'} [${Math.abs(ctx.relativeIndex)}步${ctx.relativeIndex > 0 ? '後' : '前'}]`;
                    console.log(`${marker} ${ctx.type} (scrollY: ${ctx.scrollY})`);
                });

                console.groupEnd();
            }
        }

        return scrollJumps;
    }

    // 取得事件上下文
    private getEventContext(currentIndex: number, events: DebugEvent[]) {
        const start = Math.max(0, currentIndex - 3);
        const end = Math.min(events.length, currentIndex + 3);
        return events.slice(start, end).map((event, idx) => ({
            relativeIndex: start + idx - currentIndex,
            timestamp: event.timestamp,
            type: event.type,
            source: event.source,
            scrollY: event.scrollY
        }));
    }

    private determinePossibleCause(prev: DebugEvent, curr: DebugEvent) {
        const causes = [];

        if (prev.type === 'swiper' || curr.type === 'swiper') {
            causes.push('Swiper animation');
        }

        if (prev.type === 'click' || curr.type === 'click') {
            causes.push('Button click');
        }

        if (prev.currentSection !== curr.currentSection) {
            causes.push('Section change');
        }

        if (curr.type === 'navigation') {
            causes.push('Navigation triggered');
        }

        return causes.length > 0 ? causes.join(', ') : 'Unknown';
    }

    // 清空記錄
    clear() {
        this.events = [];
        console.log('🔍 Debug tracker cleared');
    }

    // 輸出完整報告
    report() {
        const jumps = this.analyzeJumpEvents();
        console.group('🔍 Debug Tracker Report');
        console.log('Recent events:', this.getRecentEvents());
        console.log('Detected scroll jumps:', jumps);
        console.log('Navigation events:', this.findEvents('navigation'));
        console.log('Swiper events:', this.findEvents('swiper'));
        console.groupEnd();
    }
}

// 單例實例
const debugTracker = new DebugTracker();

// Hook for easy access
export function useDebugTracker() {
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        // 攔截 window.scrollTo 來追蹤意外的滾動調用
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function (x: number, y: number) {
            // 記錄所有 scrollTo 調用
            const stack = new Error().stack;
            debugTracker.log('scroll', 'window.scrollTo', {
                x, y,
                currentScrollY: window.scrollY,
                isSwiperAnimating: document.body.hasAttribute('data-swiper-animating'),
                callStack: stack
            });

            // 如果是跳到頂部且不在允許的情況下，發出警告
            if (y === 0 && window.scrollY > 100) {
                console.group('⚠️ 檢測到 scrollTo(0, 0) 調用');
                console.log('當前位置:', window.scrollY + 'px');
                console.log('目標位置:', y + 'px');
                console.log('Swiper 動畫中:', document.body.hasAttribute('data-swiper-animating'));
                console.log('調用堆疊:', stack);
                console.groupEnd();
            }

            return originalScrollTo.call(this, x, y);
        };

        // 全域事件監聽
        const handleScroll = () => {
            // 節流滾動事件
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                const scrollY = window.scrollY;
                const { currentSection } = useStore.getState();

                debugTracker.log('scroll', 'window.scroll', {
                    scrollY,
                    currentSection,
                    viewportHeight: window.innerHeight,
                    documentHeight: document.documentElement.scrollHeight,
                    swiperAnimating: document.body.hasAttribute('data-swiper-animating'),
                    timestamp: Date.now()
                });
            }, 100);
        };

        const handleClick = (e: Event) => {
            const target = e.target as HTMLElement;
            const elementInfo = {
                tagName: target.tagName,
                className: target.className,
                id: target.id,
                textContent: target.textContent?.substring(0, 50) || ''
            };

            debugTracker.log('click', `${target.tagName}.${target.className}`, elementInfo);
        };

        const handleKeydown = (e: KeyboardEvent) => {
            // 只記錄可能導致導航的按鍵
            if (['Escape', 'Tab', 'Enter', 'Space', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
                debugTracker.log('keyboard', `key.${e.key}`, {
                    key: e.key,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey,
                    altKey: e.altKey
                });
            }
        };

        const handleFocus = (e: Event) => {
            const target = e.target as HTMLElement;
            debugTracker.log('focus', `focus.${target.tagName}`, {
                tagName: target.tagName,
                className: target.className,
                id: target.id
            });
        };

        // 註冊事件監聽器
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('click', handleClick, true); // 使用捕獲階段
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('focus', handleFocus, true);

        // 添加全域方法供調試使用
        if (typeof window !== 'undefined') {
            (window as any).debugTracker = {
                log: debugTracker.log.bind(debugTracker),
                report: debugTracker.report.bind(debugTracker),
                clear: debugTracker.clear.bind(debugTracker),
                findJumps: debugTracker.analyzeJumpEvents.bind(debugTracker)
            };
        }

        return () => {
            // 恢復原始的 scrollTo 函數
            window.scrollTo = originalScrollTo;

            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('focus', handleFocus, true);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return {
        log: debugTracker.log.bind(debugTracker),
        report: debugTracker.report.bind(debugTracker),
        clear: debugTracker.clear.bind(debugTracker),
        analyzeJumps: debugTracker.analyzeJumpEvents.bind(debugTracker)
    };
}

export default debugTracker;
