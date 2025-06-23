import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 確保插件已註冊
if (typeof window !== 'undefined') {
    gsap.registerPlugin(SplitText, ScrollTrigger);
}

/**
 * 處理 split-text-bottom 類型的動畫
 * @param {HTMLElement} element - DOM 元素
 * @returns {Function} 清理函數
 */
const useSplitTextBottom = (element) => {
    // 分割文字為單個字元
    const splitText = new SplitText(element, { type: "chars" });

    // 設定初始狀態
    gsap.set(splitText.chars, {
        y: 50,
        opacity: 0
    });

    // 獲取自定義設定（如果有）
    const duration = parseFloat(element.getAttribute('data-duration')) || 0.5;
    const staggerTotal = parseFloat(element.getAttribute('data-stagger-total')) || 0.5;
    const triggerStart = element.getAttribute('data-trigger-start') || "50% 40%";
    const showMarkers = element.getAttribute('data-markers') === 'true';

    // 建立動畫時間軸
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: element,
            start: triggerStart,
            markers: showMarkers,
            toggleActions: "play none none none"
        }
    });

    // 加入動畫
    tl.to(splitText.chars, {
        y: 0,
        opacity: 1,
        stagger: staggerTotal / splitText.chars.length,
        duration: duration,
        ease: "power2.out"
    });

    // 返回清理函數
    return () => {
        if (splitText && splitText.revert) {
            splitText.revert();
        }

        if (tl.scrollTrigger) {
            tl.scrollTrigger.kill();
        }
        tl.kill();
    };
};

export default useSplitTextBottom; 