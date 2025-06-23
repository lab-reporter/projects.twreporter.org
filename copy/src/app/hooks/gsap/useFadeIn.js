import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 確保插件已註冊
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * 淡入動畫效果
 * @param {HTMLElement} element - DOM 元素
 * @returns {Function} 清理函數
 */
const useFadeIn = (element) => {
    // 設定初始狀態
    gsap.set(element, {
        opacity: 0,
        y: 30
    });

    // 獲取自定義設定
    const duration = parseFloat(element.getAttribute('data-duration')) || 0.8;
    const delay = parseFloat(element.getAttribute('data-delay')) || 0;
    const triggerStart = element.getAttribute('data-trigger-start') || "top 80%";
    const showMarkers = element.getAttribute('data-markers') === 'true';
    const easeType = element.getAttribute('data-ease') || "power2.out";

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
    tl.to(element, {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        ease: easeType
    });

    // 返回清理函數
    return () => {
        if (tl.scrollTrigger) {
            tl.scrollTrigger.kill();
        }
        tl.kill();
    };
};

export default useFadeIn; 